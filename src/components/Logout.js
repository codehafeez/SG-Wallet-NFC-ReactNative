import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";
export default class Logout extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;

    AsyncStorage.removeItem("session_login_id");
    AsyncStorage.removeItem("session_login_password");
    AsyncStorage.removeItem("session_login_token");
    this.props.navigation.navigate("LoginNav");
  }

  render() {
    return <View />;
  }
}
