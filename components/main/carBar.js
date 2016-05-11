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
      <View style={styles.carContainer}>
        <View style={styles.carType}>
          <Text style={styles.carMake}>2014 </Text>
          <Text style={styles.carModel}>FORD EXPLORER</Text>
        </View>
      </View>
      );
  }
}

var styles = StyleSheet.create({
  carContainer: {
    marginTop: 2,
    backgroundColor: '#0352A0',
    alignItems: 'center',
  },
  carType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carMake: {
    color: 'white',
    fontSize: 18,
    paddingTop: 15,
    paddingBottom: 15,
  },
  carModel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 15,
    paddingBottom: 15,
  },
});

module.exports = carBar;
