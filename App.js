import React from "react";
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";
import Login from "./src/components/Login";
import ForgotPassword from "./src/components/ForgotPassword";
import Home from "./src/components/Home";
import ProfileUpdate from "./src/components/ProfileUpdate";
import POS_2MENU from "./src/components/POS_2MENU";
import { View, AsyncStorage } from "react-native";

class App extends React.Component {
  componentDidMount() {
    this.checkAuth();
  }

  checkAuth = async () => {
    try {
      const session_login_id = await AsyncStorage.getItem("session_login_id");
      if (
        session_login_id !== undefined &&
        session_login_id !== null &&
        session_login_id !== ""
      ) {
        this.props.navigation.navigate("HomeNav");
      } else {
        this.props.navigation.navigate("LoginNav");
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return <View />;
  }
}

const ProfileNav = createStackNavigator({
  ProfileUpdate: ProfileUpdate
});
const PosNav = createStackNavigator({
  POS_2MENU: POS_2MENU
});

const HomeNav = createStackNavigator({
  Home: { screen: Home, navigationOptions: { header: null } },
  Profile: { screen: ProfileNav },
  POS: { screen: PosNav }
});

const LoginNav = createStackNavigator({
  Login: { screen: Login },
  ForgotPassword: { screen: ForgotPassword }
});

const MainNav = createSwitchNavigator(
  {
    Splash: App,
    LoginNav: LoginNav,
    HomeNav: HomeNav
  },
  {
    initialRouteName: "Splash"
  }
);

export default createAppContainer(MainNav);
