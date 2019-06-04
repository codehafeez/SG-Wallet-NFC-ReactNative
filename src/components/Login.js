import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  AsyncStorage
} from "react-native";
import { ProgressDialog } from "react-native-simple-dialogs";
export default class Login extends Component {
  static navigationOptions = {
    title: "SG Wallet",
    headerStyle: { backgroundColor: "#008CBA" },
    headerTintColor: "#fff"
  };

  constructor() {
    super();
    this.state = {
      wallet1: "",
      password1: "",
      error_msg_text: "",
      error_msg: false,
      showProgress: false
    };
  }

  function_load_data_profile_api = () => {
    AsyncStorage.getItem("session_login_token").then(token => {
      return fetch("https://tklcloud.com/SGWalletX/api/v1/account", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
        .then(res => res.json())
        .then(resJson => {
          // Alert.alert(JSON.stringify(resJson));
          AsyncStorage.setItem("session_name", resJson.Name);
          AsyncStorage.setItem("session_email", resJson.Email);
          AsyncStorage.setItem("session_telephone", resJson.Telephone);
          AsyncStorage.setItem("session_balance", "$" + resJson.Balance);
          AsyncStorage.setItem("session_bankacct", resJson.Bankacct);
          AsyncStorage.setItem("session_wallet", resJson.Wallet);
          AsyncStorage.setItem("session_card", "test_abc");
          this.setState({ showProgress: false });
          this.props.navigation.navigate("Home");
        });
    });
  };

  renderErrorMsgFunction() {
    if (this.state.error_msg === true) {
      return (
        <View>
          <Text style={styles.error_msg_style}>
            {this.state.error_msg_text}
          </Text>
        </View>
      );
    }
  }

  login = () => {
    const { wallet1, password1 } = this.state;
    if (wallet1.length < 1) {
      this.setState({ error_msg: true });
      this.setState({ error_msg_text: "Please enter a valid User ID." });
    } else if (password1.length < 1) {
      this.setState({ error_msg: true });
      this.setState({ error_msg_text: "Please enter a password." });
    } else {
      this.setState({ showProgress: true });
      this.setState({ error_msg: false });
      this.login_api(wallet1, password1);
    }
  };

  login_api(wallet1, password1) {
    return fetch("https://tklcloud.com/SGWalletX/api/v1/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ wallet1, password1 })
    })
      .then(res => res.json())
      .then(resJson => {
        if (
          resJson.Msg === "OK" &&
          resJson.name !== null &&
          resJson.name !== undefined
        ) {
          AsyncStorage.setItem("session_login_id", wallet1);
          AsyncStorage.setItem("session_login_password", password1);
          AsyncStorage.setItem("session_login_token", resJson.key);
          this.function_load_data_profile_api();
        } else {
          this.setState({ showProgress: false });
          Alert.alert("Error", "User ID or Password is Incorrect!");
        }
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Sign In</Text>
        <Text style={styles.textView}>User ID</Text>
        <TextInput
          style={styles.input}
          placeholder="User ID"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={wallet1 => this.setState({ wallet1 })}
        />
        <Text style={styles.textView}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={password1 => this.setState({ password1 })}
        />
        {this.renderErrorMsgFunction()}
        <TouchableOpacity style={styles.submitButton} onPress={this.login}>
          <Text style={styles.submitButtonText}> Sign In </Text>
        </TouchableOpacity>
        <Text
          onPress={() => this.props.navigation.navigate("ForgotPassword")}
          style={styles.forgot_password}
        >
          Forgot Password
        </Text>
        <ProgressDialog
          activityIndicatorColor="#008CBA"
          activityIndicatorSize="large"
          animationType="slide"
          message="Please, wait..."
          visible={this.state.showProgress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  error_msg_style: {
    color: "#000",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16
  },
  container: {
    paddingTop: 60
  },
  heading: {
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center"
  },
  forgot_password: {
    color: "#008CBA",
    fontSize: 18,
    marginTop: 5,
    marginRight: 25,
    textAlign: "right"
  },
  input: {
    backgroundColor: "#fff",
    paddingLeft: 10,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 5,
    height: 40,
    borderColor: "#000",
    borderWidth: 1
  },
  textView: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10
  },
  submitButton: {
    marginTop: 15,
    backgroundColor: "#008CBA",
    marginLeft: 25,
    marginRight: 25,
    height: 40
  },
  submitButtonText: {
    paddingTop: 10,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: "white"
  }
});
