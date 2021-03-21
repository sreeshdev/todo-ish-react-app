import React from "react";
import { Link } from "react-router-dom";
import { Menu, Segment } from "semantic-ui-react";
import "./index.scss";
import { auth } from "../../firebase";
import { useHistory } from "react-router-dom";

const MenuBar = ({ activeItem }) => {
  const history = useHistory();
  const logout = () => {
    auth
      .signOut()
      .then(() => {
        localStorage.removeItem("token");
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Segment inverted>
      <Menu inverted pointing secondary style={{ paddingLeft: "10px" }}>
        <Menu.Item onClick={() => history.push("/home")}>TODO-ISH</Menu.Item>
        <Link to="/home">
          <Menu.Item name="Home" active={activeItem === "home"} />
        </Link>
        <Link to="/bucket">
          <Menu.Item name="Bucket" active={activeItem === "bucket"} />
        </Link>
        <Menu.Menu position="right">
          <Menu.Item
            name="logout"
            active={activeItem === "logout"}
            onClick={logout}
          />
        </Menu.Menu>
      </Menu>
    </Segment>
  );
};

export default MenuBar;
