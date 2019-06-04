import React, { Component } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  AsyncStorage,
  View,
  Text,
  Platform,
  TouchableOpacity,
  Linking,
  ScrollView
} from "react-native";
import NfcManager, { Ndef } from "react-native-nfc-manager";
import { ProgressDialog } from "react-native-simple-dialogs";

const styles = StyleSheet.create({
  // Every Form
  container: {
    paddingTop: 60
  },
  heading: {
    marginBottom: 20,
    fontWeight: "bold",
    fontSize: 24,
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
  tagCardView: {
    marginTop: 15,
    marginBottom: 30,
    marginLeft: 100,
    marginRight: 100,
    backgroundColor: "#008CBA",
    paddingTop: 60,
    paddingBottom: 60
  },
  transaction_view: {
    marginLeft: 5
  },
  transaction_table1: {
    marginLeft: 20,
    marginBottom: 10
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

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supported: true,
      enabled: false,
      isWriting: false,
      urlToWrite: "https://www.google.com",
      rtdType: RtdType.URL,
      parsedText: null,
      tag: {}
    };
    this.state = {
      showProgress: false,
      wallet: "",
      password: "",
      showNFC: false,
      msgRespose: ""
    };

    global.tableData = 0;
    global.tableData_1 = [];
    global.tableData_2 = [];
  }

  function_card_submt = async () => {
    const { wallet, password, msgRespose } = this.state;
    if (wallet === undefined) {
      Alert.alert("Error", "Please enter a wallet code.");
    } else if (password === undefined) {
      Alert.alert("Error", "Please enter a password.");
    } else {
      if (wallet.length < 1) {
        Alert.alert("Error", "Please enter a wallet code.");
      } else if (password.length < 1) {
        Alert.alert("Error", "Please enter a password.");
      } else {
        try {
          this.setState({ showProgress: true });
          const token = await AsyncStorage.getItem("session_login_token");
          return fetch("https://tklcloud.com/SGWalletX/api/v1/make_card", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token
            },
            body: JSON.stringify({ wallet, password })
          })
            .then(res => res.json())
            .then(resJson => {
              this.setState({ showProgress: false });
              if (resJson.Msg === "OK") {
                this.setState({
                  showNFC: true,
                  msgRespose: resJson.Msg2,
                  card1: resJson.card1
                });
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

  nfcCardReadFunction = async card_id => {
    AsyncStorage.setItem(card_id + "_wallet", this.state.wallet);
    AsyncStorage.setItem(card_id + "_card", this.state.card1);
    // AsyncStorage.setItem(card_id, this.state.password);
    Alert.alert("Success", this.state.msgRespose);

    this.setState({
      showNFC: false,
      wallet: "",
      password: "",
      card1: "",
      msgRespose: ""
    });
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

  loadViewFunction() {
    const { showNFC } = this.state;
    if (showNFC === true) {
      return (
        <View style={styles.container}>
          <Text style={styles.heading}>You can create a NFC Card</Text>

          <TouchableOpacity
            onPress={this._startDetection}
            style={styles.tagCardView}
          >
            <Text style={styles.submitButtonText}>Tag Card Here</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === "ios" && <View />}
          <Text style={styles.heading}>You can create a NFC Card</Text>
          <Text style={styles.textView}>Wallet Code</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            placeholder="Wallet Code"
            keyboardType="numeric"
            value={this.state.wallet}
            onChangeText={wallet => this.setState({ wallet })}
          />
          <Text style={styles.textView}>Password</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            placeholder="Password"
            secureTextEntry
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
          <TouchableOpacity
            onPress={this.function_card_submt}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}> Submit</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {
    return (
      <ScrollView>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          {this.loadViewFunction()}
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
          // do whatever you want
        }
      })
        .then(sub => {
          this._stateChangedSubscription = sub;
          // remember to call this._stateChangedSubscription.remove()
          // when you don't want to listen to this anymore
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

    this.nfcCardReadFunction(tag.id);
    console.log("Tag Discovered", tag);
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

  _startDetection = () => {
    NfcManager.registerTagEvent(this._onTagDiscovered)
      .then(result => {
        console.log("registerTagEvent OK", result);
      })
      .catch(error => {
        console.warn("registerTagEvent fail", error);
      });
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

export default Card;
