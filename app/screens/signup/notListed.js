'use strict';

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Component
} from 'react-native';
import TopBar from '../../components/main/topBar.js';

class NotListed extends Component {
  render() {
    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <View style={styles.formContainer}>
          <Text style={styles.textStep}>Sit tight, the shop will send you a notification shortly.</Text>
          <View style={styles.btnCol}>
            <TouchableOpacity onPress={() => this.props.navigator.push({ indent: 'Main' })}>
              <Image
                resizeMode='contain'
                source={require('../../../images/btn-done-med.png')}
                style={styles.btn} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: 'white'
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  textStep: {
    marginTop: 50,
    color: '#002d5e',
    fontSize: 21,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center'
  },
  btnCol: {
    marginTop: 30
  },
  btn: {
    width: 190,
    height: 60
  }
});

module.exports = NotListed;
