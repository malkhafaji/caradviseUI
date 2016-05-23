'use strict';

import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Component,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';

var fldWidth = Dimensions.get('window').width - 40;

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
                style={styles.fldEmail}
                placeholderTextColor={'#666'}
                placeholder={'Email'} />
            </View>
            <View style={styles.loginContainer}>
              <TextInput
                style={styles.fldPwd}
                placeholderTextColor={'#666'}
                placeholder={'Password'} />
            </View>
            <TouchableOpacity>
              <Image
                resizeMode='stretch'
                source={require('../../images/btn-submit-login.png')}
                style={styles.btnLogin} />
            </TouchableOpacity>

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
    width: Dimensions.get('window').width,
    height: 750,
  },
  logo: {
    width: 180,
    height: 35,
    marginTop: 130,
    marginBottom: 150,
  },
  loginContainer: {
    width: Dimensions.get('window').width,
    backgroundColor: '#FFF',
  },
  fldEmail: {
    height: 40,
    marginTop: 30,
    marginLeft: 20,
    width: fldWidth,
    padding: 5,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  fldPwd: {
    height: 40,
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 20,
    width: fldWidth,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  btnLogin: {
    width: Dimensions.get('window').width,
    height: 60,
  },
});

module.exports = Login;
