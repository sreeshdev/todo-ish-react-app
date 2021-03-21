import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Icon,
} from "semantic-ui-react";
import { auth, db } from "../../firebase";

import { useHistory } from "react-router-dom";

const Signup = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewPass, setViewPass] = useState(false);
  const [error, setError] = useState(null);
  const signup = async () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (res) => {
        console.log(res);
        const response = await db
          .collection("users")
          .doc(res.user.email)
          .add({ email: res.user.email });
        localStorage.setItem("token", res.user.refreshToken);
        localStorage.setItem("user", res.user.email);
        history.push("/home");
      })
      .catch((error) => {
        var errorMessage = error.message;
        setError(errorMessage);
        // ..
      });
  };
  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" color="teal" textAlign="center">
          TODO-ISH
        </Header>
        <Header as="h2" color="teal" textAlign="center">
          Sign-up to your account
        </Header>
        <Form size="large">
          <Segment stacked className="dark-color">
            <Form.Input
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

            <Button color="teal" fluid size="large" onClick={signup}>
              Signup
            </Button>
          </Segment>
        </Form>
        <div className="error">{error && error}</div>
        <Message className="secondary-color">
          Already Have Account?{" "}
          <a className="link" href="/">
            Log In
          </a>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Signup;
