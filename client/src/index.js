import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../src/store/store";
import { persistore } from "../src/store/store";
import { PersistGate } from "redux-persist/integration/react";

const root= ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Router>
      <React.StrictMode>
        <PersistGate loading={null} persistor={persistore}>
          <App />
        </PersistGate>
      </React.StrictMode>
    </Router>
  </Provider>
);
