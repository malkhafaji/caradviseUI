'use strict';

import React from 'react';
import {
  Component,
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet
} from 'react-native';

class SideMenu extends Component {
  render() {
    return (
      <View style={styles.base}>
        <View style={styles.menu}>
          {this._renderItem({ text: 'SETTINGS', indent: 'Settings' })}
          {this._renderItem({ text: 'SAVED MAINTENANCE', indent:  'Saved' })}
          {this._renderItem({ text: 'VIEW INTRO', indent: 'Intro' })}
        </View>
        <TouchableOpacity style={styles.toggle} onPress={() => this.props.navigator.pop()}>
          <Image
            resizeMode="contain"
            source={require('../../images/icon-burger.png')}
            style={styles.burger} />
        </TouchableOpacity>
      </View>
    );
  }

  _renderItem({ text, indent }) {
    return (
      <TouchableOpacity style={styles.item} onPress={() => this.props.navigator.push({ indent })}>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({
  base: {
    flex: 1,
    flexDirection: 'row'
  },
  menu: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: '#fff'
  },
  item: {
    marginTop: -1,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderColor: '#999',
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  text: {
    fontSize: 16,
    letterSpacing: 1,
    color: '#555'
  },
  toggle: {
    backgroundColor: '#11325F'
  },
  burger: {
    width: 15,
    margin: 20,
    marginTop: 15
  }
});

module.exports = SideMenu;
