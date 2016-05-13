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

class GetStarted extends Component {

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
            <View style={styles.fields}>
              <TouchableOpacity>
                <Image
                  resizeMode='contain'
                  source={require('../../images/btn-getstarted.png')}
                  style={styles.btnGetStarted} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  resizeMode='contain'
                  source={require('../../images/btn-login.png')}
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
    marginTop: 100,
    marginBottom: 180,
  },
  btnGetStarted: {
    width: 200,
  },
  btnLogin: {
    width: 200,
  },
});

module.exports = GetStarted;
