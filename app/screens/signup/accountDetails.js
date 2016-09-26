'use strict';
var TopBar = require('../../components/main/topBar');

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
  Alert,
  ScrollView
} from 'react-native';
import CheckBox from 'react-native-checkbox';
import PhoneInput from '../../components/phoneInput';
import { connect } from 'react-redux';
import cache from '../../utils/cache';

var width = Dimensions.get('window').width - 30;
var fldWidth = Dimensions.get('window').width - 30;
var firstNameWidth = fldWidth / 2 - 15;
var lastNameWidth = fldWidth / 2;

class AccountDetails extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fields: {
          firstName: { name: 'First Name', value: '', invalid: false, validators:['_isPresent'] },
          lastName: { name: 'Last Name', value: '', invalid: false, validators:['_isPresent'] },
          email: { name: 'Email', value: '', invalid: false, validators:['_isPresent'] },
          cellPhone: { name: 'Cell Number', value: '', invalid: false, validators:['_isPresent'] },
          password: { name: 'Password', value: '', invalid: false, validators:['_isPresent'] },
          confirmPassword: { name: 'Confirm Password', value: '', invalid: false, validators:['_isPasswordMatched'] }
        }
      };
    }

    componentWillReceiveProps({ error }) {
      if (error) {
        if (typeof error === 'string') {
          Alert.alert('Error', error);
        } else {
          let errorKeys = Object.keys(error);
          let errorMessages = [];
          let errorFields = {};

          errorKeys.forEach(key => {
            let field = this.state.fields[key];
            if (!field) return;

            errorMessages.push(field.name + ' ' + error[key]);
            errorFields[key] = { ...field, invalid: true };
          });

          Alert.alert('Error', errorMessages.join('\n'));
          this.setState({ fields: { ...this.state.fields, ...errorFields } });
        }
      }
    }

    _focusNextField(nextField) {
        this.refs[nextField].focus()
    }

    render() {
        return (
          <ScrollView style={styles.scrollView} keyboardShouldPersistTaps={true} keyboardDismissMode={'on-drag'}>
          <TopBar navigator={this.props.navigator} />
          <View style={styles.formContainer}>

            <View>
              <Text style={styles.textStep}>Enter your account details to get started.</Text>
            </View>

            <View style={styles.fields}>
              <View style={styles.nameRow}>
                <TextInput
                  ref='firstName'
                  style={[styles.firstNameFld, this.state.fields.firstName.invalid && styles.invalidFld]}
                  placeholderTextColor={'#666'}
                  placeholder={this.state.fields.firstName.name}
                  autoCorrect={false}
                  autoFocus
                  value={this.state.fields.firstName.value}
                  returnKeyType='next'
                  blurOnSubmit={false}
                  onSubmitEditing={() => this._focusNextField('lastName')}
                  onChangeText={value => this._onFieldChange('firstName', value)} />
                <TextInput
                  ref='lastName'
                  style={[styles.lastNameFld, this.state.fields.lastName.invalid && styles.invalidFld]}
                  placeholderTextColor={'#666'}
                  placeholder={this.state.fields.lastName.name}
                  autoCorrect={false}
                  value={this.state.fields.lastName.value}
                  blurOnSubmit={false}
                  onSubmitEditing={() => this._focusNextField('email')}
                  onChangeText={value => this._onFieldChange('lastName', value)} />
              </View>
              <View style={styles.fieldsCol}>
              <TextInput
                ref='email'
                style={[styles.textFld, this.state.fields.email.invalid && styles.invalidFld]}
                keyboardType={'email-address'}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.email.name}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.fields.email.value}
                returnKeyType='next'
                blurOnSubmit={false}
                onSubmitEditing={() => this._focusNextField('cellPhone')}
                onChangeText={value => this._onFieldChange('email', value)} />
              <PhoneInput
                ref='cellPhone'
                style={[styles.textFld, this.state.fields.cellPhone.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.cellPhone.name}
                value={this.state.fields.cellPhone.value}
                blurOnSubmit={false}
                onSubmitEditing={() => this._focusNextField('password')}
                onChangeText={value => this._onFieldChange('cellPhone', value)} />
              <TextInput
                ref='password'
                style={[styles.textFld, this.state.fields.password.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.password.name}
                secureTextEntry
                value={this.state.fields.password.value}
                returnKeyType='next'
                blurOnSubmit={false}
                onSubmitEditing={() => this._focusNextField('confirmPassword')}
                onChangeText={value => this._onFieldChange('password', value)} />
              <TextInput
                ref='confirmPassword'
                style={[styles.textFld, this.state.fields.confirmPassword.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.confirmPassword.name}
                secureTextEntry
                value={this.state.fields.confirmPassword.value}
                returnKeyType='done'
                onChangeText={value => this._onFieldChange('confirmPassword', value)} />

              <View style={styles.checkboxContainer}>
                <CheckBox
                  label=''
                  checked={true}
                  checkedImage={require('../../../images/icon-checked-gray.png')}
                  uncheckedImage={require('../../../images/icon-unchecked.png')}
                  onChange={(checked) => console.log('I am checked', checked)}
                />
                <Text style={styles.check}>I agree to the CarAdvise </Text><Text style={styles.privacy} onPress={() => this.props.navigator.push({ indent:'Terms' })}>Terms</Text><Text style={styles.check}> and </Text><Text style={styles.privacy} onPress={() => this.props.navigator.push({ indent:'Privacy' })}>Privacy Policy</Text>
              </View>
              </View>

              <View style={styles.btnRow}>
                <TouchableOpacity
                  onPress={() => {
                    this._validateFields(() => {
                      cache.set('accountDetails-fields', this.state.fields);
                      this.props.navigator.push({ indent: 'VehicleDetails' });
                    });
                  }}>
                  <Image
                    resizeMode='contain'
                    source={require('../../../images/btn-next-med.png')}
                    style={styles.btnNext} />
                </TouchableOpacity>
              </View>
            </View>

          </View>
          </ScrollView>
        );
    }

    _isPresent(value) {
      return !!value;
    }

    _isPasswordMatched(value) {
      return value === this.state.fields.password.value;
    }

    _setAndValidateField(key, value) {
      let field = this.state.fields[key];
      let validators = field.validators || [];
      let invalid = validators.some(validator => !this[validator](value));

      return { ...field, value, invalid };
    }

    _onFieldChange(key, value) {
      this.setState({
        fields: {
          ...(this.state.fields),
          [key]: this._setAndValidateField(key, value)
        }
      });
    }

    _validateFields(callback) {
      let fields = {};
      let firstInvalidKey = null;

      Object.keys(this.state.fields).forEach(key => {
        let field = this.state.fields[key];
        fields[key] = field = this._setAndValidateField(key, field.value);
        if (!firstInvalidKey && field.invalid)
          firstInvalidKey = key;
      });

      this.setState({ fields }, () => {
        if (firstInvalidKey)
          this.refs[firstInvalidKey].focus();
        else if (callback)
          callback();
      });
    }
}

var styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 400,
  },
  textStep: {
    marginTop: 50,
    color: '#002d5e',
    fontSize: 21,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  fields: {
    width: width,
    marginTop: 30,
    alignItems: 'center',
  },
  textFld: {
    height: 40,
    marginTop: 15,
    width: fldWidth,
    padding: 10,
    backgroundColor: '#efefef',
    color: '#666',
    fontSize: 18,
  },
  firstNameFld: {
    height: 40,
    marginTop: 15,
    width: firstNameWidth,
    padding: 10,
    backgroundColor: '#efefef',
    color: '#666',
    fontSize: 18,
    marginRight: 15,
  },
  lastNameFld: {
    height: 40,
    marginTop: 15,
    width: lastNameWidth,
    padding: 10,
    backgroundColor: '#efefef',
    color: '#666',
    fontSize: 18,
  },
  btnNext: {
    width: 190,
    marginTop: 10,
    marginLeft: 5,
  },
  nameRow: {
    flexDirection: 'row',
  },
  fieldsCol: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  invalidFld: {
    borderWidth: 1,
    borderColor: 'red'
  },
  btnRow: {
    flexDirection: 'row',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  check: {
    fontSize: 10,
    color: '#002d5e',
    marginTop: 7,
    backgroundColor: 'transparent',
  },
  privacy: {
    fontSize: 10,
    color: '#002d5e',
    marginTop: 7,
    textDecorationLine: 'underline',
    backgroundColor: 'transparent',
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    error: user.error
  };
}

module.exports = connect(mapStateToProps)(AccountDetails);
