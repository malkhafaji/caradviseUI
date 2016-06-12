'use strict';
var StatusBarBackground = require('./app/components/statusBarBackground');
var Main = require('./app/screens/main');
var Intro = require('./app/screens/intro');
var Approvals = require('./app/screens/approvals');
var GetStarted = require('./app/screens/getStarted');
var Login = require('./app/screens/login');
var Step1 = require('./app/screens/getStarted-step1');
var Step2 = require('./app/screens/getStarted-step2');
var Step3 = require('./app/screens/getStarted-step3');
var Step4 = require('./app/screens/getStarted-step4');
var AddServices = require('./app/screens/addServices');
var ServiceDetail = require('./app/screens/serviceDetail');
var Maintenance = require('./app/screens/maintenance');
var Settings = require('./app/screens/settings');
var Saved = require('./app/screens/saved');
var Privacy = require('./app/screens/privacy');
var Terms = require('./app/screens/terms');
var SideMenu = require('./app/screens/sideMenu');
var Billing = require('./app/screens/payment-billing');
var CreditCard = require('./app/screens/payment-cc');
var PaymentConfirm = require('./app/screens/payment-confirm');
var PaymentThanks = require('./app/screens/payment-thanks');

 import React from 'react';
 import {
     Text,
     AppRegistry,
     View,
     Component,
     Navigator,
     Image,
     StyleSheet
 } from 'react-native';
 import codePush from 'react-native-code-push';
 import { Provider } from 'react-redux';
 import configureStore from './app/utils/configureStore';
 import { loadState } from './app/actions';
 import storage from './app/utils/storage';

const store = configureStore();

class caradviseui extends Component {
  componentDidMount() {
    codePush.sync({ updateDialog: false, installMode: codePush.InstallMode.IMMEDIATE });
    storage.get('caradvise:state').then(state => {
      if (state) {
        store.dispatch(loadState(state));
        if (state.user && state.user.authentication_token) {
          this.refs.appNavigator.resetTo({ indent: 'Main' });
        }
      }
    });

    storage.get('caradvise:opened').then(value => {
      if (!value) {
        storage.set('caradvise:opened', true);
        this.refs.appNavigator.push({ indent: 'Intro' });
      }
    });

    if(this.props.oneSignalId != undefined)
    {
      storage.set('caradvise:pushid', this.props.oneSignalId);
    }
  }

  _renderScene(route, navigator) {
    var globalNavigatorProps = {navigator}

    switch(route.indent) {
      case 'Intro':
        return (
          <Intro {...globalNavigatorProps} />
        )
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
      case 'Step4':
        return (
          <Step4 {...globalNavigatorProps} />
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
      case 'ServiceDetail':
        return (
          <ServiceDetail {...globalNavigatorProps} />
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
      case 'Privacy':
        return (
          <Privacy {...globalNavigatorProps} />
        )
      case 'Terms':
        return (
          <Terms {...globalNavigatorProps} />
        )
      case 'Billing':
        return (
          <Billing {...globalNavigatorProps} />
        )
      case 'CreditCard':
        return (
          <CreditCard {...globalNavigatorProps} />
        )
      case 'PaymentConfirm':
        return (
          <PaymentConfirm {...globalNavigatorProps} />
        )
      case 'PaymentThanks':
        return (
          <PaymentThanks {...globalNavigatorProps} />
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
    switch(route.indent) {
      case 'SideMenu': return Navigator.SceneConfigs.FloatFromLeft;
      case 'Intro': return Navigator.SceneConfigs.FloatFromBottom;
      default: return Navigator.SceneConfigs.PushFromRight;
    }
  }

  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <StatusBarBackground />
          <Navigator
            ref='appNavigator'
            style={styles.container}
            renderScene={this._renderScene}
            configureScene={this._configureScene}
            initialRoute={{indent: 'GetStarted'}}
            barTintColor='#11325F'
            translucent={false}
            titleTextColor='white'
            />
        </View>
      </Provider>
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
