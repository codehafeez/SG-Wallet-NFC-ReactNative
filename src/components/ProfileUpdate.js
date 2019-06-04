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
export default class ProfileUpdate extends Component {
  static navigationOptions = ({ navigation }) => ({ header: null });
  constructor(props) {
    super(props);
    this.state = {
      showProgress: true,
      name: "",
      email: "",
      telephone: "",
      bankacct: ""
    };
    this.function_load_data();
  }

  function_load_data = async () => {
    try {
      const session_name = await AsyncStorage.getItem("session_name");
      const session_bankacct = await AsyncStorage.getItem("session_bankacct");
      const session_email = await AsyncStorage.getItem("session_email");
      const session_telephone = await AsyncStorage.getItem("session_telephone");
      this.setState({
        showProgress: false,
        name: session_name,
        email: session_email,
        telephone: session_telephone,
        bankacct: session_bankacct
      });
    } catch (Ex) {
      this.setState({ showProgress: false });
      Alert.alert("Error", Ex);
    }
  };

  mydata() {
    const state = this.state;
    return (
      <ScrollView>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <View style={styles.container}>
            <Text style={styles.textView}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={state.name}
              onChangeText={name => this.setState({ name })}
            />
            <Text style={styles.textView}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={state.email}
              onChangeText={email => this.setState({ email })}
            />
            <Text style={styles.textView}>Telephone</Text>
            <TextInput
              style={styles.input}
              placeholder="Telephone"
              keyboardType="numeric"
              maxLength={8}
              value={state.telephone}
              onChangeText={telephone => this.setState({ telephone })}
            />
            <Text style={styles.textView}>Bank Account</Text>
            <TextInput
              style={styles.input}
              placeholder="Bank Account"
              value={state.bankacct}
              keyboardType="numeric"
              maxLength={14}
              onChangeText={bankacct => this.setState({ bankacct })}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={this.update_profile_submit}
            >
              <Text style={styles.submitButtonText}> Update Profile </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }

  update_profile_submit = async () => {
    const { name, email, telephone, bankacct } = this.state;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (name.length < 6) {
      Alert.alert("Error", "Sorrry! Name is too short.");
    } else if (reg.test(email) === false) {
      Alert.alert("Error", "Please enter a valid email address");
    } else if (telephone.length < 8) {
      Alert.alert("Error", "Please enter a valid Telephone number");
    } else if (bankacct.length < 14) {
      Alert.alert("Error", "Please enter a valid Bank Account number");
    } else {
      this.setState({ showProgress: true });
      try {
        const token = await AsyncStorage.getItem("session_login_token");
        AsyncStorage.getItem("session_login_password").then(password => {
          return fetch("https://tklcloud.com/SGWalletX/api/v1/update_wallet", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token
            },
            body: JSON.stringify({ name, email, telephone, password, bankacct })
          })
            .then(res => res.json())
            .then(resJson => {
              AsyncStorage.setItem("session_name", name);
              AsyncStorage.setItem("session_email", email);
              AsyncStorage.setItem("session_telephone", telephone);
              AsyncStorage.setItem("session_bankacct", bankacct);
              this.setState({ showProgress: false });
              // alert(JSON.stringify(resJson));
              if (resJson[0].Msg === "OK") {
                Alert.alert("Success", "Successfull Updated");
              } else {
                Alert.alert("Error", "Sorry!, enter a valid data.");
              }
            });
        });
      } catch (Ex) {
        this.setState({ showProgress: false });
        Alert.alert("Error", Ex);
      }
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
  container: {
    paddingTop: 60
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
