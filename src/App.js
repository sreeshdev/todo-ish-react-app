import React from "react";
import "./styles/index.scss"
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./pages/login";
import { Provider } from "react-redux";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Bucket from "./pages/bucket";
import ProtectedRoute from "./helper/protectedRoute";
import configureStore from "./store/configureStore";
const initialState = {};
const store = configureStore(initialState);

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Switch>
            <ProtectedRoute path="/" exact component={Login} />
            <ProtectedRoute path="/signup" exact component={Signup} />
            <ProtectedRoute path="/home" component={Home} />
            <ProtectedRoute path="/bucket" component={Bucket} />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
