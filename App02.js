import React, { Component } from "react";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Linking,
  ScrollView
} from "react-native";
import NfcManager, { Ndef } from "react-native-nfc-manager";

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

class App extends Component {
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
  }

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
    let {
      supported,
      enabled,
      tag,
      isWriting,
      urlToWrite,
      parsedText,
      rtdType
    } = this.state;
    return (
      <ScrollView style={{ flex: 1 }}>
        {Platform.OS === "ios" && <View style={{ height: 60 }} />}

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 40,
            marginLeft: 10,
            marginRight: 10
          }}
        >
          <Text>{`NFC supported = ${supported}`}</Text>
          <Text>{`NFC enabled = ${enabled}`}</Text>

          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={this._startDetection}
          >
            <Text style={{ color: "blue" }}>Start Tag Detection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={this._clearMessages}
          >
            <Text>Clear</Text>
          </TouchableOpacity>
          <Text style={{ marginTop: 20 }}>{`Current tag JSON: ${JSON.stringify(
            tag
          )}`}</Text>
          {parsedText && (
            <Text
              style={{ marginTop: 10, marginBottom: 20, fontSize: 18 }}
            >{`Parsed Text: ${parsedText}`}</Text>
          )}
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

export default App;
