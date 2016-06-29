'use strict';
import React from 'react';
import {
  Component,
  View,
  StyleSheet,
  Platform
} from 'react-native'

class StatusBarBackground extends Component {
  render() {
    return (
      <View style={styles.statusBarBackground}></View>
    )
  }
}

var styles = StyleSheet.create({
  statusBarBackground: {
    height: (Platform.OS === 'ios') ? 20 : 0,
    backgroundColor: '#006699',
  },
});

module.exports = StatusBarBackground
