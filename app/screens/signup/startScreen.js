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
  ScrollView
} from 'react-native';

class StartScreen extends Component {

    render() {
        return (
          <ScrollView keyboardShouldPersistTaps={true} keyboardDismissMode={'on-drag'}>
          <View style={styles.formContainer}>
            <Image
              resizeMode='cover'
              source={require('../../../images/bg-logo.png')}
              style={styles.bgLogin} />
            <View style={styles.fields}>
              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'AccountDetails' })}>
                <Image
                  resizeMode='contain'
                  source={require('../../../images/btn-getstarted.png')}
                  style={styles.btnGetStarted} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'Login' })}>
                <Image
                  resizeMode='contain'
                  source={require('../../../images/btn-login.png')}
                  style={styles.btnLogin} />
              </TouchableOpacity>
            </View>

          </View>
          </ScrollView>
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
  fields: {
    marginTop: 440,
    marginBottom: 50,
  },
  btnGetStarted: {
    width: 280,
    height: 45
  },
  btnLogin: {
    width: 280,
  },
});

module.exports = StartScreen;
