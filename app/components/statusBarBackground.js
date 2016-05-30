'use strict';
import React from 'react';
import {
  Component,
  View,
  StyleSheet
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
    height: 20,
    backgroundColor: '#11325F',
  },
});

module.exports = StatusBarBackground
