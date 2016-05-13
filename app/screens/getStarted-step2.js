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

class Step2 extends Component {

    render() {
        return (
          <View style={styles.formContainer}>
            <Image
              resizeMode='cover'
              source={require('../../images/img-step-car.png')}
              style={styles.imgStepCar} />
            <View style={styles.fields}>
              <TextInput
                style={styles.textFld}
                placeholder={'Year'} />
              <TextInput
                style={styles.textFld}
                placeholder={'Make'} />
              <TextInput
                style={styles.textFld}
                placeholder={'Model'} />
              <TextInput
                style={styles.textFld}
                placeholder={'Trim'} />
              <TouchableOpacity>
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
  imgStepCar: {
    width: 375,
    height: 300,
  },
  fields: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
  },
  textFld: {
    height: 40,
    marginTop: 15,
    width: 300,
    padding: 5,
    borderWidth: 1,
    borderColor: '#AAA',
  },
  btnNext: {
    width: 100,
    marginTop: 10,
    marginLeft: 100,
  },
});

module.exports = Step2;
