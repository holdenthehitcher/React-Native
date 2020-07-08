import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { Campsites } from "./campsites";
import { Comments } from "./comments";
import { Partners } from "./partners";
import { Promotions } from "./promotions";
import { Favorites } from "./favorites";

export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
      campsites: Campsites,
      comments: Comments,
      partners: Partners,
      promotions: Promotions,
      favorites: Favorites,
    }),
    applyMiddleware(thunk, logger)
  );

  return store;
};
