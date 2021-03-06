import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
  Input,
  Icon,
  Dropdown,
} from "semantic-ui-react";
import { auth, db } from "../../firebase";
import { useHistory } from "react-router-dom";

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewPass, setViewPass] = useState(false);
  const [error, setError] = useState(null);
  const signin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        localStorage.setItem("token", res.user.refreshToken);
        localStorage.setItem("user", res.user.email);
        history.push("/home");
      })
      .catch((error) => {
        var errorMessage = error.message;
        setError(errorMessage);
      });
  };
  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" textAlign="center" className="white-font">
          TODO-ISH
        </Header>
        <Header as="h2" textAlign="center" className="white-font">
          Log-in to your account
        </Header>
        <Form size="large">
          <Segment stacked className="dark-color">
            <Form.Input
              className="login-input"
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
            />
            <Form.Input
              fluid
              icon={
                <Icon
                  name={viewPass ? "eye" : "eye slash"}
                  link
                  onClick={() => {
                    setViewPass(!viewPass);
                    setError(null);
                  }}
                />
              }
              iconPosition="right"
              placeholder="Password"
              value={password}
              type={viewPass ? "text" : "password"}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div className="error">{error && error}</div>
            <Button fluid size="large" onClick={signin}>
              Login
            </Button>
          </Segment>
        </Form>
        <Message className="secondary-color white-font">
          New to us?{" "}
          <a href="/signup" className="link">
            Sign Up
          </a>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
