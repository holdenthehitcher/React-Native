import React, { Component } from "react";
import { PanResponder, Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert } from "react-native";
import { Card, Icon, Input, Rating } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite, postComment } from "../redux/ActionCreators";
import * as Animatable from "react-native-animatable";

const mapStateToProps = (state) => {
  return {
    campsites: state.campsites,
    comments: state.comments,
    favorites: state.favorites,
  };
};

const mapDispatchToProps = {
  postFavorite: (campsiteId) => postFavorite(campsiteId),
  postComment: (campsiteId, rating, author, text) => postComment(campsiteId, rating, author, text),
};

function RenderCampsite(props) {
  const { campsite } = props;

  const recognizeDrag = ({ dx }) => (dx < -200 ? true : false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderEnd: (e, gestureState) => {
      console.log("pan responder end", gestureState);
      if (recognizeDrag(gestureState)) {
        Alert.alert(
          "Add Favorite",
          "Are you sure you wish to add " + campsite.name + " to favorites?",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => console.log("Cancel Pressed"),
            },
            {
              text: "OK",
              onPress: () => (props.favorite ? console.log("Already set as a favorite") : props.markFavorite()),
            },
          ],
          { cancelable: false }
        );
      }
      return true;
    },
  });

  if (campsite) {
    return (
      <Animatable.View animation="fadeInDown" duration={2000} delay={1000} {...panResponder.panHandlers}>
        <Card featuredTitle={campsite.name} image={{ uri: baseUrl + campsite.image }}>
          <Text style={{ margin: 10 }}>{campsite.description}</Text>
          <View style={styles.cardRow}>
            <Icon
              type="font-awesome"
              name={props.favorite ? "heart" : "heart-o"}
              raised
              reverse
              color="#f50"
              onPress={() => (props.favorite ? console.log("Already set as favorite") : props.markFavorite())}
            />
            <Icon
              style={styles.cardItem}
              type="font-awesome"
              name="pencil"
              color="#5637dd"
              raised
              reverse
              onPress={() => props.onShowModal()}
            />
          </View>
        </Card>
      </Animatable.View>
    );
  }
  return <View />;
}

function RenderComments({ comments }) {
  const renderCommentItem = ({ item }) => {
    return (
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.text}</Text>
        <Rating
          startingValue={item.rating}
          imageSize={10}
          style={{ alignItems: "flex-start", paddingVertical: "5%" }}
          readonly
        />
        <Text style={{ fontSize: 12 }}>{`-- ${item.author}, ${item.date}`}</Text>
      </View>
    );
  };
  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card title="Comments">
        <FlatList data={comments} renderItem={renderCommentItem} keyExtractor={(item) => item.id.toString()} />
      </Card>
    </Animatable.View>
  );
}

class CampsiteInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      rating: 5,
      author: "",
      text: "",
    };
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleComment(campsiteId) {
    const { rating, author, text } = this.state;
    this.props.postComment(campsiteId, rating, author, text);
    this.toggleModal();
  }

  resetForm() {
    this.setState({
      showModal: false,
      rating: 5,
      author: "",
      text: "",
    });
  }

  markFavorite(campsiteId) {
    this.props.postFavorite(campsiteId);
  }

  static navigationOptions = {
    title: "Campsite Information",
  };

  render() {
    const campsiteId = this.props.navigation.getParam("campsiteId");
    const campsite = this.props.campsites.campsites.filter((campsite) => campsite.id === campsiteId)[0];
    const comments = this.props.comments.comments.filter((comment) => comment.campsiteId === campsiteId);

    return (
      <ScrollView>
        <RenderCampsite
          campsite={campsite}
          favorite={this.props.favorites.includes(campsiteId)}
          markFavorite={() => this.markFavorite(campsiteId)}
          onShowModal={() => this.toggleModal()}
        />
        <RenderComments comments={comments} />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <Rating
              readonly
              showRating
              startingValue={this.state.rating}
              imageSize={40}
              onFinishRating={(rating) => this.setState({ rating: rating })}
              style={{ paddingVertical: 10 }}
            />
            <Input
              placeholder="Author"
              leftIcon={{ type: "font-awesome", name: "user-o" }}
              leftIconContainerStyle={{ paddingRight: 10 }}
              onChangeText={(author) => this.setState({ author: author })}
              value={this.state.author}
            />
            <Input
              placeholder="Comment"
              leftIcon={{ type: "font-awesome", name: "comment-o" }}
              leftIconContainerStyle={{ paddingRight: 10 }}
              onChangeText={(text) => this.setState({ text: text })}
              value={this.state.text}
            />
            <View>
              <View>
                <Button
                  color="#5637dd"
                  title="Submit"
                  onPress={() => {
                    this.handleComment(campsiteId);
                    this.resetForm();
                  }}
                />
              </View>
              <View>
                <Button color="#808080" title="Cancel" onPress={() => this.resetForm()} />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  cardItem: {
    flex: 1,
    margin: 1,
  },
  modal: {
    justifyContent: "center",
    margin: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);
