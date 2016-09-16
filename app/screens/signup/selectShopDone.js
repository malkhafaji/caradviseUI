'use strict';

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Component
} from 'react-native';
import TopBar from '../../components/main/topBar.js';

var fldWidth = Dimensions.get('window').width - 40;

class SelectShopDone extends Component {
  render() {
    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <View style={styles.formContainer}>
          <Text style={styles.textStep}>Great, a car care professional will be right with you!</Text>
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
    width: fldWidth,
    marginTop: 50,
    color: '#002d5e',
    fontSize: 21,
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

module.exports = SelectShopDone;
