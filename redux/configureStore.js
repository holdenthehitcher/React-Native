import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { persistStore, persistCombineReducers } from "redux-persist";
import storage from "redux-persist/es/storage";
import { Campsites } from "./campsites";
import { Comments } from "./comments";
import { Partners } from "./partners";
import { Promotions } from "./promotions";
import { Favorites } from "./favorites";

const config = {
  key: "root",
  storage,
  debug: true,
};

export const ConfigureStore = () => {
  const store = createStore(
    persistCombineReducers(config, {
      campsites: Campsites,
      comments: Comments,
      partners: Partners,
      promotions: Promotions,
      favorites: Favorites,
    }),
    applyMiddleware(thunk, logger)
  );

  const persistor = persistStore(store);

  return { persistor, store };
};
