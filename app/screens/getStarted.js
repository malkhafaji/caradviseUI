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
              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'Step1' })}>
                <Image
                  resizeMode='contain'
                  source={require('../../images/btn-getstarted.png')}
                  style={styles.btnGetStarted} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'Login' })}>
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
    width: Dimensions.get('window').width,
    height: 750,
  },
  logo: {
    width: 180,
    height: 35,
    marginTop: 130,
    marginBottom: 200,
  },
  btnGetStarted: {
    width: 200,
  },
  btnLogin: {
    width: 200,
  },
});

module.exports = GetStarted;
