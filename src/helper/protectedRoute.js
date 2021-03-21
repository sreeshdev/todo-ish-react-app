import React from "react";
import { Redirect, Route } from "react-router-dom";

const ProtectedRoute = ({ path, component, render }) => {
  var token = localStorage.getItem("token");
  if (path === "/" || path === "/signup") {
    return !token ? (
      <Route path={path} component={component} />
    ) : (
      <Redirect to="/home" />
    );
  } else {
    return token ? (
      <Route exact path={path} component={component} />
    ) : (
      <Redirect to="/" />
    );
  }
};

export default ProtectedRoute;
