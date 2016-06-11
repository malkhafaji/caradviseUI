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
  Alert,
  ScrollView
} from 'react-native';
import CheckBox from 'react-native-checkbox';
import { connect } from 'react-redux';
import cache from '../utils/cache';

var fldWidth = Dimensions.get('window').width - 40;
var firstNameWidth = fldWidth / 2 - 15;
var lastNameWidth = fldWidth / 2;

class GetStarted extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fields: {
          firstName: { name: 'First Name', value: '', invalid: false, validators:['_isPresent'] },
          lastName: { name: 'Last Name', value: '', invalid: false, validators:['_isPresent'] },
          email: { name: 'Email', value: '', invalid: false, validators:['_isPresent'] },
          cellPhone: { name: 'Phone Number', value: '', invalid: false, validators:['_isPresent'] },
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

    render() {
        return (
          <ScrollView style={styles.scrollView}>
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
                  onChangeText={value => this._onFieldChange('firstName', value)} />
                <TextInput
                  ref='lastName'
                  style={[styles.lastNameFld, this.state.fields.lastName.invalid && styles.invalidFld]}
                  placeholderTextColor={'#666'}
                  placeholder={this.state.fields.lastName.name}
                  autoCorrect={false}
                  value={this.state.fields.lastName.value}
                  onChangeText={value => this._onFieldChange('lastName', value)} />
              </View>
              <TextInput
                ref='email'
                style={[styles.textFld, this.state.fields.email.invalid && styles.invalidFld]}
                keyboardType={'email-address'}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.email.name}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.fields.email.value}
                onChangeText={value => this._onFieldChange('email', value)} />
              <TextInput
                ref='cellPhone'
                style={[styles.textFld, this.state.fields.cellPhone.invalid && styles.invalidFld]}
                keyboardType={'phone-pad'}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.cellPhone.name}
                value={this.state.fields.cellPhone.value}
                onChangeText={value => this._onFieldChange('cellPhone', value)} />
              <TextInput
                ref='password'
                style={[styles.textFld, this.state.fields.password.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.password.name}
                secureTextEntry
                value={this.state.fields.password.value}
                onChangeText={value => this._onFieldChange('password', value)} />
              <TextInput
                ref='confirmPassword'
                style={[styles.textFld, this.state.fields.confirmPassword.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.confirmPassword.name}
                secureTextEntry
                value={this.state.fields.confirmPassword.value}
                onChangeText={value => this._onFieldChange('confirmPassword', value)} />

              <View style={styles.checkboxContainer}>
                <CheckBox
                  label='I Agree to the CarAdvise Terms and Privacy Policy'
                  checked={true}
                  checkedImage={require('../../images/icon-checked.png')}
                  uncheckedImage={require('../../images/icon-unchecked.png')}
                  labelStyle={styles.check}
                  onChange={(checked) => console.log('I am checked', checked)}
                />
              </View>

              <View style={styles.btnRow}>
                <TouchableOpacity
                  onPress={() => {
                      this.props.navigator.pop();
                  }}>
                  <Image
                    resizeMode='contain'
                    source={require('../../images/btn-back-white.png')}
                    style={styles.btnBack} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this._validateFields(() => {
                      cache.set('step1-fields', this.state.fields);
                      this.props.navigator.push({ indent: 'Step2' });
                    });
                  }}>
                  <Image
                    resizeMode='contain'
                    source={require('../../images/btn-next.png')}
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
    backgroundColor: '#000',
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 400,
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
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  fields: {
    marginTop: 30,
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
  firstNameFld: {
    height: 40,
    marginTop: 15,
    width: firstNameWidth,
    padding: 10,
    backgroundColor: '#FFF',
    color: '#666',
    fontSize: 21,
    marginRight: 15,
  },
  lastNameFld: {
    height: 40,
    marginTop: 15,
    width: lastNameWidth,
    padding: 10,
    backgroundColor: '#FFF',
    color: '#666',
    fontSize: 21,
  },
  btnBack: {
    width: 120,
    marginTop: 10,
    marginRight: 5,
  },
  btnNext: {
    width: 120,
    marginTop: 10,
    marginLeft: 5,
  },
  nameRow: {
    flexDirection: 'row',
  },
  invalidFld: {
    borderWidth: 1,
    borderColor: 'red'
  },
  btnRow: {
    flexDirection: 'row',
  },
  checkboxContainer: {
    marginTop: 20,
  },
  check: {
    fontSize: 9,
    color: '#FFF',
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    error: user.error
  };
}

module.exports = connect(mapStateToProps)(GetStarted);
