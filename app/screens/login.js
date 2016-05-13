'use strict';

import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Component,
  TouchableOpacity,
  TextInput
} from 'react-native';

class Login extends Component {

    render() {
        return (
          <View style={styles.formContainer}>
            <Image
              resizeMode='cover'
              source={require('../../images/bg-login.png')}
              style={styles.bgLogin} />
            <View>
              <Image
                resizeMode='cover'
                source={require('../../images/logo.png')}
                style={styles.logo} />
            </View>
            <View style={styles.loginContainer}>
              <TextInput
                style={styles.textFld}
                placeholder={'Email'} />
              <TextInput
                style={styles.textFld}
                placeholder={'Password'} />
              <TouchableOpacity>
                <Image
                  resizeMode='contain'
                  source={require('../../images/btn-submit-login.png')}
                  style={styles.btnLogin} />
              </TouchableOpacity>
            </View>

          </View>
        );
    }
}

var styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  bgLogin: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 375,
    height: 750,
  },
  logo: {
    width: 168,
    height: 150,
    marginTop: 60,
    marginBottom: 125,
  },
  loginContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 375,
    backgroundColor: '#FFF'

  },
  textFld: {
    height: 40,
    marginTop: 30,
    marginLeft: 30,
    width: 300,
    padding: 5,
    borderWidth: 1,
    borderColor: '#AAA',
  },
  btnLogin: {
    width: 375,
  },
});

module.exports = Login;
