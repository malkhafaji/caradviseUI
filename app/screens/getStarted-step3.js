'use strict';

import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Component,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';

var fldWidth = Dimensions.get('window').width - 40;

class Step3 extends Component {

    render() {
        return (
          <View style={styles.formContainer}>
            <Image
              resizeMode='cover'
              source={require('../../images/bg-login.png')}
              style={styles.bgSteps} />

            <View>
              <Image
                resizeMode="contain"
                source={require('../../images/logo.png')}
                style={styles.logo} />
            </View>

            <View>
              <Text style={styles.textStep}>Please select your vehicle info below to get started.</Text>
            </View>

            <View style={styles.fields}>
              <TextInput
                style={styles.textFld}
                placeholderTextColor={'#666'}
                placeholder={'Year'} />
              <TextInput
                style={styles.textFld}
                placeholderTextColor={'#666'}
                placeholder={'Make'} />
              <TextInput
                style={styles.textFld}
                placeholderTextColor={'#666'}
                placeholder={'Model'} />
              <TextInput
                style={styles.textFld}
                placeholderTextColor={'#666'}
                placeholder={'Trim'} />
              <TouchableOpacity onPress={() => this.props.navigator.push({ indent:'Step4' })}>
                <Image
                  resizeMode='contain'
                  source={require('../../images/btn-next.png')}
                  style={styles.btnNext} />
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
  bgSteps: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: Dimensions.get('window').width,
    height: 750,
  },
  logo: {
    width: 80,
    marginTop: 30,
  },
  textStep: {
    marginTop: 50,
    color: '#FFF',
    fontSize: 21,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center'
  },
  fields: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    alignItems: 'center',
  },
  textFld: {
    height: 40,
    marginTop: 15,
    width: fldWidth,
    padding: 10,
    backgroundColor: '#FFF',
    color: '#666',
    fontSize: 21,
  },
  btnNext: {
    width: 120,
    marginTop: 10,
  },
});

module.exports = Step3;
