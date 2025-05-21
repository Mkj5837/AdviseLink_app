import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../Features/authSlice";
import userReducer from "../Features/userSlice";
import messageReducer from "../Features/messagesSlice";

// Initial reducers
const initialReducers = {
  auth: authReducer,
  user: userReducer,
  messages: messageReducer,
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth state
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

export const persistor = persistStore(store);
