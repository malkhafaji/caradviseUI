'use strict';

import React from 'react';
import {
    Text,
    View,
    Component,
    Image,
    StyleSheet,
} from 'react-native';

class carBar extends Component {
  render() {
    return (
      <View style={styles.carType}>
        <Text style={styles.carTypeText}>2014 FORD EXPLORER</Text>
      </View>
      );
  }
}

var styles = StyleSheet.create({
  carType: {
    backgroundColor: '#0352A0',
    marginTop: 2,
  },
  carTypeText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },
});

module.exports = carBar;
