import React, { Component } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  AsyncStorage
} from "react-native";
import { ProgressDialog } from "react-native-simple-dialogs";
export default class POS extends Component {
  constructor() {
    super();
    this.state = {
      showProgress: true,
      name: ""
    };
    this.function_load_data();
  }

  mydata() {
    const state = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Pay to {state.name}</Text>
        <Text style={styles.textView}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          maxLength={9}
          value={this.state.amount}
          onChangeText={amount => this.setState({ amount })}
        />
        <TouchableOpacity
          onPress={() => this.function_pos_openScreen()}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}> Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function_load_data = async () => {
    try {
      const session_name = await AsyncStorage.getItem("session_name");
      this.setState({ showProgress: false, name: session_name });
    } catch (Ex) {
      this.setState({ showProgress: false });
      Alert.alert("Error", Ex);
    }
  };

  function_pos_openScreen = async () => {
    // const session_name = await AsyncStorage.getItem("session_name");
    const token = await AsyncStorage.getItem("session_login_token");
    const { amount } = this.state;
    if (amount !== undefined && amount !== "" && amount !== null) {
      this.props.navigation.navigate("POS_2MENU", {
        amount: amount,
        // Name: session_name,
        token: token
      });
    } else {
      Alert.alert("Error", "Please enter a amount.");
    }
  };

  render() {
    return (
      <View>
        {this.mydata()}
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
  // Every Form
  container: {
    paddingTop: 60
  },
  heading: {
    marginBottom: 20,
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center"
  },
  heading2: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center"
  },
  input: {
    color: "#000",
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
  },
  transaction_view: {
    marginLeft: 5
  },
  transaction_table1: {
    marginLeft: 20,
    marginBottom: 10
  }
});
