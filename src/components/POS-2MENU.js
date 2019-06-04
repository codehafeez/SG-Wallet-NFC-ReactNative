import React, { Component } from "react";
import { Alert, View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode";
import { Button } from "native-base";
export default class POS extends Component {
  static navigationOptions = {
    title: "POS",
    headerStyle: { backgroundColor: "#008CBA" },
    headerTintColor: "#fff"
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = { showProgress: false };
    global.payer = navigation.getParam("wallet");
    global.amount = navigation.getParam("amount");
    global.token = navigation.getParam("token");
    global.card = navigation.getParam("card");
  }

  function_send_req() {
    const payer = global.payer;
    const amount = global.amount;
    const card = global.card;
    const token = global.token;

    try {
      return fetch("https://tklcloud.com/SGWalletX/api/v1/receive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ payer, amount, card })
      })
        .then(res => res.json())
        .then(resJson => {
          // Alert.alert(JSON.stringify(resJson));
          alert(resJson.Msg2);
          // AsyncStorage.setItem('session_email', resJson.Email);
        });
    } catch (Ex) {
      Alert.alert("Error", Ex);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          style={styles.image1}
          activeOpacity={0.5}
          onPress={this.function_send_req}
        >
          <Text style={{ color: "#fff", fontSize: 20, marginLeft: "18%" }}>
            Tap Card Here
          </Text>
        </Button>
        <QRCode
          value={global.payer + "," + global.amount}
          size={200}
          bgColor="#000"
          fgColor="#fff"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: "25%",
    marginTop: 60
  },
  image1: {
    backgroundColor: "#008CBA",
    width: 200,
    height: 200,
    marginBottom: 40
  }
});
