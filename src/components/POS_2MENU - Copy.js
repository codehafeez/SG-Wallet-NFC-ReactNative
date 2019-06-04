import React, { Component } from "react";
import { ScrollView, Alert, View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode";
import { Button } from "native-base";
export default class POS_2MENU extends Component {

  static navigationOptions = ({ navigation }) => ({ header: null });
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = { tagValue: null, showProgress: false };
    global.payer = navigation.getParam("wallet");
    global.amount = navigation.getParam("amount");
    global.token = navigation.getParam("token");
    global.card = navigation.getParam("card");
  }

  function_send_req() 
  {
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
          alert(resJson.Msg2);
          this.setState({ tagValue: resJson.Msg2 });
        });
    } catch (Ex) { Alert.alert("Error", Ex); }
  }

  render() {
    return (
      <ScrollView style={styles.homeView}>
        {this.state.tagValue ? (
          <Text style={styles.tagValue}>{this.state.tagValue}</Text>
        ) : null}

        <View style={styles.container}>
          <Button style={styles.image1} activeOpacity={0.5} onPress={this.function_send_req}>
            <Text style={{ color: "#fff", fontSize: 20, marginLeft: "18%" }}>Tap Card Here</Text>
          </Button>
          <QRCode
            value={global.payer + "," + global.amount}
            size={200}
            bgColor="#000"
            fgColor="#fff"
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  homeView: {
    marginTop: 20,
    marginBottom: 40
  },
  container: {
    marginTop: 40,
    marginLeft: "25%"
  },
  image1: {
    backgroundColor: "#008CBA",
    width: 200,
    height: 200,
    marginBottom: 40
  },
  tagValue: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    textAlign: "center"
  }
});
