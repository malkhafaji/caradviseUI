'use strict';
var Approvals = require('../../components/approvals/approvals');

import React from 'react';
import {
    Text,
    AppRegistry,
    View,
    Component,
    NavigatorIOS,
    Image,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';


class approvalRequest extends Component {

  render() {
    return (
      <TouchableHighlight
        underlayColor='#dddddd'>
        <View style={styles.approvalRequest}>
          <Image
            style={styles.alertImg}
            source={require('../../images/icon-alert.png')} />
          <View>
            <Text style={styles.approvalHd}>Approval Request</Text>
            <Text>Tire Rotation, Brake Pads, Air Filter...</Text>
          </View>
          <Image
            style={styles.arrowRed}
            source={require('../../images/arrow-red.png')} />
        </View>
      </TouchableHighlight>
    );
  }

}

var styles = StyleSheet.create({
  approvalRequest: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: '#E0483E',
    backgroundColor: '#FFF',
  },
  alertImg: {
    backgroundColor: '#FFF',
    width: 30,
    height: 30,
    margin: 10,
  },
  approvalHd: {
    color: '#E0483E',
    fontWeight: 'bold',
    marginTop: 10,
  },
  arrowRed: {
    width: 8,
    height: 13,
    marginTop: 20,
    marginLeft: 30,
  },
});

module.exports = approvalRequest;
