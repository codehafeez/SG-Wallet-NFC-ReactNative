import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from "react-native";
import { Spinner, Button, Item, Input, Icon } from "native-base";
export default class ForgotPassword extends Component {
  static navigationOptions = {
    title: "Forgot Password",
    headerStyle: {
      backgroundColor: "#008CBA"
    },
    headerTintColor: "#fff"
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textView}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.submitButton} onPress={() => {}}>
          <Text style={styles.submitButtonText}> Submit </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30
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
