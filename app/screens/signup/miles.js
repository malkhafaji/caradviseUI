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
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { signUp } from '../../actions/user';
import cache from '../../utils/cache';
import storage from '../../utils/storage';

var fldWidth = Dimensions.get('window').width - 40;

class Miles extends Component {
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

    componentDidUpdate() {
      if (this.props.isLoggedIn) {
        cache.remove('accountDetails-fields');
        cache.remove('vehicleDetails-fields');
        cache.remove('vin-fields');
        cache.remove('miles-fields');
        this.props.navigator.resetTo({ indent: 'Main' });
      }
    }

    render() {
        return (
          <View style={styles.base}>
          <ScrollView keyboardShouldPersistTaps={true} keyboardDismissMode={'on-drag'}>
          <TopBar navigator={this.props.navigator} />
          <View style={styles.formContainer}>

            <View>
              <Text style={styles.textStep}>Great! We have a few questions to complete your vehicle profile.</Text>
            </View>

            <View style={styles.fields}>
              <Text style={styles.fieldLbl}>What is your current mileage?</Text>
              <TextInput
                ref='miles'
                keyboardType='numeric'
                style={[styles.textFld, this.state.fields.miles.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                value={this.state.fields.miles.value}
                onChangeText={value => this._onFieldChange('miles', value)} />
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
                <Text style={styles.fieldLbl}>What type of oil does your vehicle take?</Text>
              </View>
              <TextInput
                ref='oil-type'
                keyboardType='numeric'
                style={[styles.textFld, this.state.fields.miles.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'} />
              <View style={styles.btnRow}>
                <TouchableOpacity disabled={this.props.isLoading} onPress={() => this._onClickNext()}>
                  <Image
                    resizeMode='contain'
                    source={require('../../../images/btn-next-med.png')}
                    style={styles.btnNext} />
                </TouchableOpacity>
              </View>
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
          [key]: this._setAndValidateField(key, value.trim())
        }
      }, () => cache.set('miles-fields', this.state.fields));
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
        let accountDetailsFields = cache.get('accountDetails-fields');
        let data = {
          firstName: accountDetailsFields.firstName.value,
          lastName: accountDetailsFields.lastName.value,
          email: accountDetailsFields.email.value,
          cellPhone: accountDetailsFields.cellPhone.value,
          password: accountDetailsFields.password.value,
          miles: this.state.fields.miles.value,
          pushid: this.state.pushid
        };

        let vinFields = cache.get('vin-fields');
        if (vinFields) {
          data.vin = vinFields.vin.value;
        }

        let vehicleDetailsFields = cache.get('vehicleDetails-fields');
        if (vehicleDetailsFields) {
          data.year = vehicleDetailsFields.year.value;
          data.make = vehicleDetailsFields.make.value;

          let models = cache.get('vehicleDetails-models') || [];
          let model = models.find(({ value }) => value === vehicleDetailsFields.model.value) || {};
          data.model_id = model.key;
          data.model = model.originalValue;

          let engines = cache.get('vehicleDetails-engines') || [];
          let engine = engines.find(({ value }) => value === vehicleDetailsFields.engine.value) || {};
          data.vehicle_type_extension_engine_id = engine.key;
        }

        this.props.signUp(data);
      });
    }
}

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#FFF'
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
  btnRow: {
    flexDirection: 'row',
  },
  btnNext: {
    width: 190,
    height: 40,
    marginTop: 10,
    marginLeft: 5,
  },
  invalidFld: {
    borderWidth: 1,
    borderColor: 'red'
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    isLoading: !!user.loading
  };
}

module.exports = connect(mapStateToProps, { signUp })(Miles);
