import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userReducer from "../Features/userSlice";
import taskReducer from "../Features/taskSlice";
import meetingReducer from "../Features/meetingSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage by default

// Initial reducers
const initialReducers = {
  user: userReducer,
  tasks: taskReducer,
  meetings: meetingReducer,
  // auth: authReducer,

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

const persistor = persistStore(store); // Create persistor for rehydration

export { persistor };
