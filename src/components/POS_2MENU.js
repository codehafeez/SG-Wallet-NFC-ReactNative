import React, { Component } from "react";
import {
  View,
  Text,
  AsyncStorage,
  Platform,
  Linking,
  ScrollView,
  StyleSheet
} from "react-native";
import NfcManager, { Ndef } from "react-native-nfc-manager";
import QRCode from "react-native-qrcode";
import { Button } from "native-base";
const styles = StyleSheet.create({
  homeView: {
    marginTop: 20,
    marginBottom: 40
  },
  container: {
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

const RtdType = {
  URL: 0,
  TEXT: 1
};

function buildUrlPayload(valueToWrite) {
  return Ndef.encodeMessage([Ndef.uriRecord(valueToWrite)]);
}

function buildTextPayload(valueToWrite) {
  return Ndef.encodeMessage([Ndef.textRecord(valueToWrite)]);
}

class POS_2MENU extends Component {
  static navigationOptions = ({ navigation }) => ({ header: null });
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = { tagValue: null, showProgress: false };
    global.amount = navigation.getParam("amount");
    global.token = navigation.getParam("token");

    this.state = {
      supported: true,
      enabled: false,
      isWriting: false,
      urlToWrite: "https://www.google.com",
      rtdType: RtdType.URL,
      parsedText: null,
      tag: {}
    };
  }

  function_send_req = async current_card_id => {
    const amount = global.amount;
    const payer = await AsyncStorage.getItem(current_card_id + "_wallet");
    const card = await AsyncStorage.getItem(current_card_id + "_card");
    if (payer === null || card === null) {
      alert("Sorry! Invalid Card");
    } else {
      try {
        return fetch("https://tklcloud.com/SGWalletX/api/v1/receive", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + global.token
          },
          body: JSON.stringify({ payer, amount, card })
        })
          .then(res => res.json())
          .then(resJson => {
            alert(resJson.Msg2);
            this.setState({ tagValue: resJson.Msg2 });
          });
      } catch (Ex) {
        Alert.alert("Error", Ex);
      }
    }
  };

  componentDidMount() {
    NfcManager.isSupported().then(supported => {
      this.setState({ supported });
      if (supported) {
        this._startNfc();
      }
    });
  }

  componentWillUnmount() {
    if (this._stateChangedSubscription) {
      this._stateChangedSubscription.remove();
    }
  }

  render() {
    return (
      <ScrollView style={styles.homeView}>
        {Platform.OS === "ios" && <View />}

        <View style={styles.container}>
          <Button
            style={styles.image1}
            activeOpacity={0.5}
            onPress={this._startDetection}
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
      </ScrollView>
    );
  }

  _requestFormat = () => {
    let { isWriting } = this.state;
    if (isWriting) {
      return;
    }

    this.setState({ isWriting: true });
    NfcManager.requestNdefWrite(null, { format: true })
      .then(() => console.log("format completed"))
      .catch(err => console.warn(err))
      .then(() => this.setState({ isWriting: false }));
  };

  _startDetection = () => {
    NfcManager.registerTagEvent(this._onTagDiscovered)
      .then(result => {
        console.log("registerTagEvent OK", result);
      })
      .catch(error => {
        console.warn("registerTagEvent fail", error);
      });
  };

  _requestNdefWrite = () => {
    let { isWriting, urlToWrite, rtdType } = this.state;
    if (isWriting) {
      return;
    }

    let bytes;
    if (rtdType === RtdType.URL) {
      bytes = buildUrlPayload(urlToWrite);
    } else if (rtdType === RtdType.TEXT) {
      bytes = buildTextPayload(urlToWrite);
    }

    this.setState({ isWriting: true });
    NfcManager.requestNdefWrite(bytes)
      .then(() => console.log("write completed"))
      .catch(err => console.warn(err))
      .then(() => this.setState({ isWriting: false }));
  };

  _cancelNdefWrite = () => {
    this.setState({ isWriting: false });
    NfcManager.cancelNdefWrite()
      .then(() => console.log("write cancelled"))
      .catch(err => console.warn(err));
  };

  _requestAndroidBeam = () => {
    let { isWriting, urlToWrite, rtdType } = this.state;
    if (isWriting) {
      return;
    }

    let bytes;
    if (rtdType === RtdType.URL) {
      bytes = buildUrlPayload(urlToWrite);
    } else if (rtdType === RtdType.TEXT) {
      bytes = buildTextPayload(urlToWrite);
    }

    this.setState({ isWriting: true });
    NfcManager.setNdefPushMessage(bytes)
      .then(() => console.log("beam request completed"))
      .catch(err => console.warn(err));
  };

  _cancelAndroidBeam = () => {
    this.setState({ isWriting: false });
    NfcManager.setNdefPushMessage(null)
      .then(() => console.log("beam cancelled"))
      .catch(err => console.warn(err));
  };

  _startNfc() {
    NfcManager.start({
      onSessionClosedIOS: () => {
        console.log("ios session closed");
      }
    })
      .then(result => {
        console.log("start OK", result);
      })
      .catch(error => {
        console.warn("start fail", error);
        this.setState({ supported: false });
      });

    if (Platform.OS === "android") {
      NfcManager.getLaunchTagEvent()
        .then(tag => {
          console.log("launch tag", tag);
          if (tag) {
            alert("Tag1 = " + tag);
            this.setState({ tag });
          }
        })
        .catch(err => {
          console.log(err);
        });
      NfcManager.isEnabled()
        .then(enabled => {
          this.setState({ enabled });
        })
        .catch(err => {
          console.log(err);
        });
      NfcManager.onStateChanged(event => {
        if (event.state === "on") {
          this.setState({ enabled: true });
        } else if (event.state === "off") {
          this.setState({ enabled: false });
        } else if (event.state === "turning_on") {
          // do whatever you want
        } else if (event.state === "turning_off") {
        }
      })
        .then(sub => {
          this._stateChangedSubscription = sub;
        })
        .catch(err => {
          console.warn(err);
        });
    }
  }

  _onTagDiscovered = tag => {
    NfcManager.unregisterTagEvent()
      .then(result => {
        console.log("unregisterTagEvent OK", result);
      })
      .catch(error => {
        console.warn("unregisterTagEvent fail", error);
      });

    this.function_send_req(tag.id);
    // alert(JSON.stringify(tag));
    // alert(tag.id);

    this.setState({ tag });
    let url = this._parseUri(tag);
    if (url) {
      Linking.openURL(url).catch(err => {
        console.warn(err);
      });
    }

    let text = this._parseText(tag);
    this.setState({ parsedText: text });
  };

  _clearMessages = () => {
    this.setState({ tag: null });
  };

  _parseUri = tag => {
    try {
      if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
        return Ndef.uri.decodePayload(tag.ndefMessage[0].payload);
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  _parseText = tag => {
    try {
      if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
        return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  };
}

export default POS_2MENU;
