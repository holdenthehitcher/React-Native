import React, { Component } from "react";
import Directory from "./DirectoryComponent";
import { createStackNavigator, createDrawerNavigator } from "react-navigation";
import CampsiteInfo from "./CampsiteInfoComponent";
import { View, Platform } from "react-native";
import Home from "./HomeComponent";

const DirectoryNavigator = createStackNavigator(
  {
    Directory: { screen: Directory },
    CampsiteInfo: { screen: CampsiteInfo },
  },
  {
    initialRouteName: "Directory",
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#5637DD",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#fff",
      },
    },
  }
);
const HomeNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    CampsiteInfo: { screen: CampsiteInfo },
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#5637DD",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#fff",
      },
    },
  }
);

const MainNavigator = createDrawerNavigator(
  {
    Home: { screen: HomeNavigator },
    Directory: { screen: DirectoryNavigator },
  },
  {
    drawerBackgroundColor: "#cec8ff",
  }
);

export default class Main extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop: Platform.OS === "ios" ? 0 : Expo.Constants.statusBarHeight,
        }}
      >
        <MainNavigator />
      </View>
    );
  }
}
