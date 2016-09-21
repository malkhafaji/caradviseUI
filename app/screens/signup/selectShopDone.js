'use strict';

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Component
} from 'react-native';
import TopBar from '../../components/main/topBar.js';
import cache from '../../utils/cache';
import storage from '../../utils/storage';

var fldWidth = Dimensions.get('window').width - 40;

class SelectShopDone extends Component {

  constructor(props) {
    super(props);

    storage.get('caradvise:pushid').then(value => {
      if (value) {
        this.state.pushid = value;
      }
    });

    this.state = {
      fields: Object.assign({
        miles: { name: 'Mileage', value: '', invalid: false, validators: ['_isPresent'] }
      }, cache.get('miles-fields') || {}),
      pushid: ""
    };
  }

  render() {
    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <View style={styles.formContainer}>
          <Text style={styles.textHd1}>Hang tight! The shop will send you a notification shortly.</Text>
          <Text style={styles.textHd2}>In the meantime, we have a few questions to complete your vehicle profile.</Text>

          <View style={styles.fields}>
            <Text style={styles.fieldLbl}>How many miles do you drive per month?</Text>
            <TextInput
              ref='miles-per-month'
              keyboardType='numeric'
              style={[styles.textFld, this.state.fields.miles.invalid && styles.invalidFld]}
              placeholderTextColor={'#666'} />
            <Text style={styles.fieldLbl}>What type of driving do you do the most?</Text>
            <TextInput
              ref='driving-type'
              keyboardType='numeric'
              style={[styles.textFld, this.state.fields.miles.invalid && styles.invalidFld]}
              placeholderTextColor={'#666'} />
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLbl}>Did you purchase your car new or used?</Text>
            </View>
            <TextInput
              ref='oil-type'
              keyboardType='numeric'
              style={[styles.textFld, this.state.fields.miles.invalid && styles.invalidFld]}
              placeholderTextColor={'#666'} />
            <View style={styles.btnRow}>
              <TouchableOpacity>
                <Image
                  resizeMode='contain'
                  source={require('../../../images/btn-submit.png')}
                  style={styles.btnNext} />
              </TouchableOpacity>
            </View>
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
  textHd1: {
    marginTop: 50,
    color: '#002d5e',
    fontSize: 21,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center'
  },
  textHd2: {
    color: '#002d5e',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    textAlign: 'center'
  },
  fields: {
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    alignItems: 'center'
  },
  fieldLbl: {
    color: '#002d5e',
    width: fldWidth,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left'
  },
  textFld: {
    height: 40,
    marginTop: 5,
    marginBottom: 15,
    width: fldWidth,
    padding: 10,
    backgroundColor: '#efefef',
    color: '#666',
    fontSize: 21,
    paddingVertical: 0,
  },
  btnNext: {
    width: 190,
    height: 40,
    marginTop: 10,
    marginLeft: 5,
  }
});

module.exports = SelectShopDone;
