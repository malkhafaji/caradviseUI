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
import { signUp } from '../../actions/user';
import cache from '../../utils/cache';
import storage from '../../utils/storage';
import KeyboardHandler from '../../components/keyboardHandler';

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
          email: { name: 'Email', value: '', invalid: false, validators:['_isPresent', '_isEmailValid'] },
          cellPhone: { name: 'Cell Number', value: '', invalid: false, validators:['_isPresent'] },
          password: { name: 'Password', value: '', invalid: false, validators:['_isPresent', '_isPasswordValid'] },
          confirmPassword: { name: 'Confirm Password', value: '', invalid: false, validators:['_isPasswordMatched'] }
        },
        pushid: ''
      };

      storage.get('caradvise:pushid').then(value => {
        if (value) {
          this.state.pushid = value;
        }
      });
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

    componentDidUpdate() {
      if (this.props.isLoggedIn) {
        let [currentRoute] = this.props.navigator.getCurrentRoutes().reverse();
        if (currentRoute.indent === 'AccountDetails') {
          cache.remove('vehicle_id');
          this.props.navigator.resetTo({ indent: 'Main' });
        }
      }
    }

    _focusNextField(nextField) {
        this.refs[nextField].focus()
    }

    render() {
        return (
          <KeyboardHandler ref='kh' offset={30} style={styles.scrollView} keyboardShouldPersistTaps={true} keyboardDismissMode='on-drag'>
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
                  returnKeyType='next'
                  blurOnSubmit={false}
                  onSubmitEditing={() => this._focusNextField('email')}
                  onChangeText={value => this._onFieldChange('lastName', value)} />
              </View>
              <View style={styles.fieldsCol}>
              {this.state.fields.firstName.invalid ?
                <Text style={styles.errorMsg}>First name is required.</Text> : null
              }
              {this.state.fields.lastName.invalid ?
                <Text style={styles.errorMsg}>Last name is required.</Text> : null
              }
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
              {this.state.fields.email.invalid ?
                <Text style={styles.errorMsg}>Email is not valid.</Text> : null
              }
              <PhoneInput
                ref='cellPhone'
                style={[styles.textFld, this.state.fields.cellPhone.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.cellPhone.name}
                value={this.state.fields.cellPhone.value}
                blurOnSubmit={false}
                onFocus={() => this.refs.kh.inputFocused(this, 'cellPhone')}
                onSubmitEditing={() => this._focusNextField('password')}
                onChangeText={value => this._onFieldChange('cellPhone', value)} />
              {this.state.fields.cellPhone.invalid ?
                <Text style={styles.errorMsg}>Cellphone is required.</Text> : null
              }
              <TextInput
                ref='password'
                style={[styles.textFld, this.state.fields.password.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.password.name}
                secureTextEntry
                value={this.state.fields.password.value}
                returnKeyType='next'
                blurOnSubmit={false}
                onFocus={() => this.refs.kh.inputFocused(this, 'password')}
                onSubmitEditing={() => this._focusNextField('confirmPassword')}
                onChangeText={value => this._onFieldChange('password', value)} />
              {this.state.fields.password.invalid ?
                <Text style={styles.errorMsg}>Password should be more than 5 characters.</Text> : null
              }
              <TextInput
                ref='confirmPassword'
                style={[styles.textFld, this.state.fields.confirmPassword.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.confirmPassword.name}
                secureTextEntry
                value={this.state.fields.confirmPassword.value}
                returnKeyType='done'
                onFocus={() => this.refs.kh.inputFocused(this, 'confirmPassword')}
                onChangeText={value => this._onFieldChange('confirmPassword', value)} />
              {this.state.fields.confirmPassword.invalid ?
                <Text style={styles.errorMsg}>Passwords don{"'"}t match.</Text> : null
              }

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
                  onPress={() => this._onClickNext()}>
                  <Image
                    resizeMode='contain'
                    source={require('../../../images/btn-next-med.png')}
                    style={styles.btnNext} />
                </TouchableOpacity>
              </View>
            </View>

          </View>
          </KeyboardHandler>
        );
    }

    _isPresent(value) {
      return !!value;
    }

    _isEmailValid(value) {
      let rx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      return rx.test(value);
    }

    _isPasswordValid(value) {
      return value.length >= 5;
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

    _onClickNext() {
      this._validateFields(() => {
        let vehicle_id = cache.get('vehicle_id');
        if (vehicle_id) {
          this.props.signUp({
            vehicle_id,
            firstName: this.state.fields.firstName.value,
            lastName: this.state.fields.lastName.value,
            email: this.state.fields.email.value,
            cellPhone: this.state.fields.cellPhone.value,
            password: this.state.fields.password.value,
            pushid: this.state.pushid
          });
        } else {
          cache.set('accountDetails-fields', this.state.fields);
          this.props.navigator.push({ indent: 'VehicleDetails' });
        }
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
  errorMsg: {
    color: 'white',
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: fldWidth,
    marginTop: 5,
  }
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    error: user.error
  };
}

module.exports = connect(mapStateToProps, { signUp })(AccountDetails);
