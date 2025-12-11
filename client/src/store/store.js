import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import authReducer from "../Features/authSlice";
import userReducer from "../Features/userSlice";
import messageReducer from "../Features/messagesSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage by default

// Initial reducers
const initialReducers = {
  user: userReducer,
  // auth: authReducer,
  // messages: messageReducer,
};

const persistConfig = {
  key: "reduxstore", // The key to identify the persisted state in storage
  storage, // The storage method (localStorage)
};

const rootReducer = combineReducers(initialReducers);
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistore = persistStore(store); // Create persistore for rehydration

export {persistore};
