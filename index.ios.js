'use strict';
var StatusBarBackground = require('./app/components/statusBarBackground');
var Main = require('./app/screens/main');
var Approvals = require('./app/screens/approvals');
var GetStarted = require('./app/screens/getStarted');
var Login = require('./app/screens/login');
var Step1 = require('./app/screens/getStarted-step1');
var Step2 = require('./app/screens/getStarted-step2');
var Step3 = require('./app/screens/getStarted-step3');
var AddServices = require('./app/screens/addServices');
var Maintenance = require('./app/screens/maintenance');
var Settings = require('./app/screens/settings');
var Saved = require('./app/screens/saved');
var SideMenu = require('./app/screens/sideMenu');

 import React from 'react';
 import {
     Text,
     AppRegistry,
     View,
     Component,
     Navigator,
     Image,
     StyleSheet,
 } from 'react-native';


class caradviseui extends Component {

  _renderScene(route, navigator) {
    var globalNavigatorProps = {navigator}

    switch(route.indent) {
      case 'GetStarted':
        return (
          <GetStarted {...globalNavigatorProps} />
        )
      case 'Login':
        return (
          <Login {...globalNavigatorProps} />
        )
      case 'Step1':
        return (
          <Step1 {...globalNavigatorProps} />
        )
      case 'Step2':
        return (
          <Step2 {...globalNavigatorProps} />
        )
      case 'Step3':
        return (
          <Step3 {...globalNavigatorProps} />
        )
      case 'Main':
        return (
          <Main {...globalNavigatorProps} />
        )
      case 'Approvals':
        return (
          <Approvals {...globalNavigatorProps} />
        )
      case 'AddServices':
        return (
          <AddServices {...globalNavigatorProps} />
        )
      case 'Maintenance':
        return (
          <Maintenance {...globalNavigatorProps} />
        )
      case 'Settings':
        return (
          <Settings {...globalNavigatorProps} />
        )
      case 'Saved':
        return (
          <Saved {...globalNavigatorProps} />
        )
      case 'SideMenu':
        return (
          <SideMenu {...globalNavigatorProps} />
        )
      default:
        return (
          <Text>EPIC FAIL</Text>
        )
    }
  }

  _configureScene(route) {
    if (route.indent === 'SideMenu')
      return Navigator.SceneConfigs.FloatFromLeft;
    else
      return Navigator.SceneConfigs.PushFromRight;
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBarBackground />
        <Navigator
          ref='appNavigator'
          style={styles.container}
          renderScene={this._renderScene}
          configureScene={this._configureScene}
          initialRoute={{indent: 'Main'}}
          barTintColor='#11325F'
          translucent={false}
          titleTextColor='white'
          />
      </View>
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
});

AppRegistry.registerComponent('caradviseui', () => caradviseui);
