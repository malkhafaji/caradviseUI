'use strict';
var TopBar = require('../components/main/topBar');

import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Component,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { updateInfo } from '../actions/user';

var width = Dimensions.get('window').width - 20;

class Settings extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fields: {
          firstName: { name: 'First Name', value: props.firstName, invalid: false, validators:['_isPresent'] },
          lastName: { name: 'Last Name', value: props.lastName, invalid: false, validators:['_isPresent'] },
          cellPhone: { name: 'Phone Number', value: props.cellPhone, invalid: false, validators:['_isPresent'] },
          miles: { name: 'Mileage', value: props.miles, invalid: false, validators:['_isPresent'] },
          password: { name: 'Password', value: '', invalid: false }
        }
      };
    }

    componentWillReceiveProps({ isLoading, error }) {
      if (error)
        Alert.alert('Error', error);
      else if (!isLoading)
        this.props.navigator.pop();
    }

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <ScrollView>
            <View style={styles.settingsContainer}>
              <Text style={styles.textHd}>Settings</Text>

              <View style={styles.vehicleNumber}>
                <Text style={styles.vehicleNumberText}>VEHICLE NUMBER:  {this.props.vehicleNumber}</Text>
              </View>

              <View style={[styles.settingsRow, this.state.fields.firstName.invalid && styles.invalidFld]}>
                <Text style={styles.fldName}>FIRST NAME</Text>
                <TextInput
                  ref='firstName'
                  style={styles.textFld}
                  selectTextOnFocus={true}
                  autoCorrect={false}
                  value={this.state.fields.firstName.value}
                  onChangeText={value => this._onFieldChange('firstName', value)} />
              </View>
              <View style={[styles.settingsRow, this.state.fields.lastName.invalid && styles.invalidFld]}>
                <Text style={styles.fldName}>LAST NAME</Text>
                <TextInput
                  ref='lastName'
                  style={styles.textFld}
                  selectTextOnFocus={true}
                  autoCorrect={false}
                  value={this.state.fields.lastName.value}
                  onChangeText={value => this._onFieldChange('lastName', value)} />
              </View>
              <View style={[styles.settingsRow, this.state.fields.cellPhone.invalid && styles.invalidFld]}>
                <Text style={styles.fldName}>PHONE #</Text>
                <TextInput
                  ref='cellPhone'
                  style={styles.textFld}
                  selectTextOnFocus={true}
                  keyboardType={'phone-pad'}
                  value={this.state.fields.cellPhone.value}
                  onChangeText={value => this._onFieldChange('cellPhone', value)} />
              </View>
              <View style={[styles.settingsRow, this.state.fields.miles.invalid && styles.invalidFld]}>
                <Text style={styles.fldName}>MILEAGE</Text>
                <TextInput
                  ref='miles'
                  style={styles.textFld}
                  selectTextOnFocus={true}
                  keyboardType={'phone-pad'}
                  value={this.state.fields.miles.value}
                  onChangeText={value => this._onFieldChange('miles', value)} />
              </View>
              <View style={[styles.settingsRow, this.state.fields.password.invalid && styles.invalidFld]}>
                <Text style={styles.fldName}>PASSWORD</Text>
                <TextInput
                  ref='password'
                  style={styles.textFld}
                  selectTextOnFocus={true}
                  secureTextEntry
                  value={this.state.fields.password.value}
                  onChangeText={value => this._onFieldChange('password', value)} />
              </View>

              <View>
                <TouchableOpacity
                  disabled={this.props.isLoading}
                  onPress={() => {
                    this._validateFields(() => this.props.updateInfo({
                      firstName: this.state.fields.firstName.value,
                      lastName: this.state.fields.lastName.value,
                      cellPhone: this.state.fields.cellPhone.value,
                      miles: this.state.fields.miles.value,
                      password: this.state.fields.password.value || undefined
                    }));
                  }}>
                  <Image
                    source={require('../../images/btn-save-blue.png')}
                    style={styles.btnSave} />
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
          </View>
        );
    }

    _isPresent(value) {
      return !!value;
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
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  settingsContainer: {
    alignItems: 'center',
    marginBottom: 200,
    marginLeft: 10,
    marginRight: 10,
  },
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#006699',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center',
  },
  vehicleNumber: {
    width: width,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#0099FF',
  },
  vehicleNumberText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
    margin: 20,
    fontSize: 16,
  },
  settingsRow: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    marginBottom: 3,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#F4F4F4',
  },
  fldName: {
    flex: 1,
    color: '#006699',
    fontSize: 12,
    fontWeight: 'bold',
  },
  textFld: {
    flex: 3,
    textAlign: 'right',
    color: '#006699',
    fontWeight: 'bold',
    fontSize: 18,
  },
  btnSave: {
    width: 171,
    height: 38,
    marginTop: 15,
  },
  invalidFld: {
    borderWidth: 1,
    borderColor: 'red'
  }
});

function mapStateToProps(state) {
  let user = state.user || {};
  let vehicle = user.vehicles && user.vehicles[0] || {};
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    cellPhone: user.cellPhone,
    isLoading: !!user.loading,
    error: user.error,
    miles: String(vehicle.miles),
    vehicleNumber: vehicle.vehicleNumber
  };
}

module.exports = connect(mapStateToProps, { updateInfo })(Settings);
