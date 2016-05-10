'use strict';

var Main = require('./components/main/main');

 import React from 'react';
 import {
     Text,
     AppRegistry,
     View,
     Component,
     NavigatorIOS,
     Image,
     StyleSheet,
 } from 'react-native';


class caradviseui extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'CarAdvise',
          component: Main,
        }}
        barTintColor='#11325F'
        translucent={false}
        titleTextColor='white'
      />
    );
  }
}

var styles = StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80,
    fontFamily: 'Roboto',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  homeContainer: {
    flex: 1,
    backgroundColor: 'white',
  },

});

AppRegistry.registerComponent('caradviseui', () => caradviseui);
