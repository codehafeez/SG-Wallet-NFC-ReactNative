import React, { Component } from "react";
import {
  Alert,
  ScrollView,
  View,
  Text,
  StyleSheet,
  AsyncStorage
} from "react-native";
import { Table, Row } from "react-native-table-component";
import { ProgressDialog } from "react-native-simple-dialogs";
export default class Transaction extends Component {
  constructor() {
    super();
    this.state = {
      showProgress: true,
      // Transaction
      widthArr_table1: [100, 230],
      widthArr_table2: [380],
      tableHead: ["Please wait data is processing."]
    };

    global.tableData = 0;
    global.tableData_1 = [];
    global.tableData_2 = [];

    this.function_load_data_profile_api();
    this.load_table2_function();
    this.load_table2_function();
  }

  function_transaction() {
    const state = this.state;
    row_table1_index = [];
    row_table1_index.push("1");
    row_table1_index.push("2");
    row_table2_index = [];
    row_table2_index.push("1");
    row_table2_index.push("2");
    row_table2_index.push("3");
    row_table2_index.push("4");

    return (
      <ScrollView>
        <View style={styles.transaction_view}>
          <Text style={styles.heading2}>Wallet Details</Text>
          <View style={styles.transaction_table1}>
            <ScrollView horizontal={true}>
              <Table borderStyle={{ borderColor: "#FFFFFF" }}>
                {global.tableData_1.map((row_table1_index, index) => (
                  <Row
                    key={index}
                    data={row_table1_index}
                    widthArr={state.widthArr_table1}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
          <ScrollView horizontal={true}>
            <View style={styles.transaction_table2}>
              <Table borderStyle={{ borderColor: "#C1C0B9" }}>
                <Row
                  data={state.tableHead}
                  widthArr={state.widthArr_table2}
                  style={styles.head}
                  textStyle={styles.text2}
                />
              </Table>
              <ScrollView>
                <Table borderStyle={{ borderColor: "#C1C0B9" }}>
                  {tableData_2.map((row_table2_index, index) => (
                    <Row
                      style={styles.row}
                      key={index}
                      data={row_table2_index}
                      widthArr={state.widthArr_table2}
                      textStyle={styles.text}
                    />
                  ))}
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    );
  }

  load_table2_function = async () => {
    global.tableData = 1;
    if (global.tableData === 1) {
      global.tableData = global.tableData + 1;
      try {
        const token = await AsyncStorage.getItem("session_login_token");
        return fetch("https://tklcloud.com/SGWalletX/api/v1/transactions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        })
          .then(res => res.json())
          .then(resJson => {
            this.setState({
              widthArr_table2: [100, 135, 70, 75],
              tableHead: ["Timestamp", "Party", "Amount", "Balance"]
            });

            resJson.map(value => {
              rowData = [];
              rowData.push(value.Time);
              rowData.push(value.Party);
              rowData.push(value.Amount);
              rowData.push(value.Balance);
              global.tableData_2.push(rowData);
            });

            this.setState({ showProgress: false });
          });
      } catch (Ex) {
        this.setState({ showProgress: false });
        Alert.alert("Error", Ex);
      }
    }
  };

  function_load_data_profile_api = async () => {
    try {
      const session_name = await AsyncStorage.getItem("session_name");
      const session_bankacct = await AsyncStorage.getItem("session_bankacct");
      const session_wallet = await AsyncStorage.getItem("session_wallet");
      const session_balance = await AsyncStorage.getItem("session_balance");

      // table - 01
      rowData_1 = [];
      rowData_2 = [];
      rowData_3 = [];
      rowData_4 = [];
      rowData_1.push("Wallet");
      rowData_1.push(session_wallet);
      global.tableData_1.push(rowData_1);
      rowData_2.push("Name");
      rowData_2.push(session_name);
      global.tableData_1.push(rowData_2);
      rowData_3.push("Balance");
      rowData_3.push(session_balance);
      global.tableData_1.push(rowData_3);
      rowData_4.push("Bank Account");
      rowData_4.push(session_bankacct);
      global.tableData_1.push(rowData_4);
    } catch (Ex) {
      this.setState({ showProgress: false });
      Alert.alert("Error", Ex);
    }
  };

  render() {
    return (
      <View style={styles.home_screen}>
        {this.function_transaction()}
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
  home_screen: {
    paddingBottom: 40
  },
  // Top Tab
  tabBarTextStyle: {
    color: "#008CBA",
    fontSize: 14,
    fontWeight: "normal"
  },
  underlineStyle: {
    height: 2,
    backgroundColor: "#008CBA"
  },

  // Transaction
  head: { height: 30, backgroundColor: "#008CBA" },
  wrapper: { flexDirection: "row" },
  row: { height: 28 },
  text: { textAlign: "center" },
  text2: { textAlign: "center", color: "#fff" },
  table2: { marginBottom: 20, marginLeft: 20 },
  table1: { marginLeft: 10 },
  transaction_table2: { marginLeft: 10 },

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
