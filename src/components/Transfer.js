import React, { Component } from "react";
import {
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  AsyncStorage
} from "react-native";
import { ProgressDialog } from "react-native-simple-dialogs";
export default class Transfer extends Component {
  constructor() {
    super();
    this.state = {
      showProgress: false,
      // Transfer Screen
      password: "",
      amount: ""
    };
  }

  function_transfer_api_submit = async () => {
    const { amount, password } = this.state;
    if (amount === undefined) {
      Alert.alert("Error", "Please enter a amount.");
    } else if (password === undefined) {
      Alert.alert("Error", "Please enter a password.");
    } else {
      if (amount.length < 1) {
        Alert.alert("Error", "Please enter a amount.");
      } else if (password.length < 1) {
        Alert.alert("Error", "Please enter a password.");
      } else {
        const bankacct = await AsyncStorage.getItem("session_bankacct");
        try {
          this.setState({ showProgress: true });
          const token = await AsyncStorage.getItem("session_login_token");
          return fetch("https://tklcloud.com/SGWalletX/api/v1/transfer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token
            },
            body: JSON.stringify({ bankacct, amount, password })
          })
            .then(res => res.json())
            .then(resJson => {
              this.setState({ showProgress: false });
              this.setState({ amount: "", password: "" });
              // alert(JSON.stringify(resJson));
              if (resJson.Msg === "OK") {
                Alert.alert("Success", resJson.Msg2);
              } else {
                Alert.alert("Error", resJson.Msg2);
              }
            });
        } catch (Ex) {
          this.setState({ showProgress: false });
          Alert.alert("Error", Ex);
        }
      }
    }
  };

  function_transfer() {
    return (
      <ScrollView>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <View style={styles.container}>
            <Text style={styles.heading}>Transfer</Text>
            <Text style={styles.textView}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              maxLength={9}
              value={this.state.amount}
              onChangeText={amount => this.setState({ amount })}
            />
            <Text style={styles.textView}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Password"
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={this.function_transfer_api_submit}
            >
              <Text style={styles.submitButtonText}> Submit</Text>
            </TouchableOpacity>
          </View>
          <ProgressDialog
            activityIndicatorColor="#008CBA"
            activityIndicatorSize="large"
            animationType="slide"
            message="Please, wait..."
            visible={this.state.showProgress}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }

  render() {
    return <View>{this.function_transfer()}</View>;
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
