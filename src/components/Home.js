import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import Screen1 from "./Transaction";
import Screen2 from "./POS";
import Screen3 from "./Card";
import Screen4 from "./Transfer";
import Screen5 from "./Pay";
import Screen6 from "./Profile";
import Screen7 from "./Logout";
class Home extends Component {
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          <Image
            source={require("./drawer.png")}
            style={{ width: 25, height: 25, marginLeft: 15, marginTop: 5 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const FirstActivity_StackNavigator = createStackNavigator({
  First: {
    screen: Screen1,
    navigationOptions: ({ navigation }) => ({
      title: "Transaction",
      headerLeft: <Home navigationProps={navigation} />,
      headerStyle: { backgroundColor: "#008CBA" },
      headerTintColor: "#fff"
    })
  }
});

const Screen2_StackNavigator = createStackNavigator({
  Second: {
    screen: Screen2,
    navigationOptions: ({ navigation }) => ({
      title: "POS",
      headerLeft: <Home navigationProps={navigation} />,
      headerStyle: { backgroundColor: "#008CBA" },
      headerTintColor: "#fff"
    })
  }
});

const Screen3_StackNavigator = createStackNavigator({
  Third: {
    screen: Screen3,
    navigationOptions: ({ navigation }) => ({
      title: "Card",
      headerLeft: <Home navigationProps={navigation} />,
      headerStyle: { backgroundColor: "#008CBA" },
      headerTintColor: "#fff"
    })
  }
});

const Screen4_StackNavigator = createStackNavigator({
  Third: {
    screen: Screen4,
    navigationOptions: ({ navigation }) => ({
      title: "Transfer",
      headerLeft: <Home navigationProps={navigation} />,
      headerStyle: { backgroundColor: "#008CBA" },
      headerTintColor: "#fff"
    })
  }
});

const Screen5_StackNavigator = createStackNavigator({
  Third: {
    screen: Screen5,
    navigationOptions: ({ navigation }) => ({
      title: "Pay",
      headerLeft: <Home navigationProps={navigation} />,
      headerStyle: { backgroundColor: "#008CBA" },
      headerTintColor: "#fff"
    })
  }
});

const Screen6_StackNavigator = createStackNavigator({
  Third: {
    screen: Screen6,
    navigationOptions: ({ navigation }) => ({
      title: "Profile",
      headerLeft: <Home navigationProps={navigation} />,
      headerStyle: { backgroundColor: "#008CBA" },
      headerTintColor: "#fff"
    })
  }
});

const Screen7_StackNavigator = createStackNavigator({
  Third: {
    screen: Screen7,
    navigationOptions: ({ navigation }) => ({
      title: "Logout",
      headerLeft: <Home navigationProps={this.function_signout} />,
      headerStyle: { backgroundColor: "#008CBA" },
      headerTintColor: "#fff"
    })
  }
});

const DrawerNavigatorExample = createDrawerNavigator({
  Screen1: {
    screen: FirstActivity_StackNavigator,
    navigationOptions: { drawerLabel: "Transaction" }
  },
  Screen2: {
    screen: Screen2_StackNavigator,
    navigationOptions: { drawerLabel: "POS" }
  },
  Screen3: {
    screen: Screen3_StackNavigator,
    navigationOptions: { drawerLabel: "Card" }
  },
  Screen4: {
    screen: Screen4_StackNavigator,
    navigationOptions: { drawerLabel: "Transfer" }
  },
  Screen5: {
    screen: Screen5_StackNavigator,
    navigationOptions: { drawerLabel: "Pay" }
  },
  Screen6: {
    screen: Screen6_StackNavigator,
    navigationOptions: { drawerLabel: "Profile" }
  },
  Screen7: {
    screen: Screen7_StackNavigator,
    navigationOptions: { drawerLabel: "Logout" }
  }
});

export default createAppContainer(DrawerNavigatorExample);
