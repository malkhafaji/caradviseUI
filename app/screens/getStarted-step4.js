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
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { signUp } from '../actions/user';
import cache from '../utils/cache';
import storage from '../utils/storage';

var fldWidth = Dimensions.get('window').width - 40;

class Step4 extends Component {
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
        }, cache.get('step4-fields') || {}),
        pushid: ""
      };
    }

    componentDidUpdate() {
      if (this.props.isLoggedIn) {
        cache.remove('step1-fields');
        cache.remove('step2-fields');
        cache.remove('step3-fields');
        cache.remove('step4-fields');
        this.props.navigator.resetTo({ indent: 'Main' });
      }
    }

    render() {
        return (
          <ScrollView keyboardShouldPersistTaps={true}>
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
              <Text style={styles.textStep}>To complete your car profile, we need the current mileage.</Text>
            </View>

            <View style={styles.fields}>
              <TextInput
                ref='miles'
                keyboardType='numeric'
                style={[styles.textFld, this.state.fields.miles.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.miles.name}
                value={this.state.fields.miles.value}
                onChangeText={value => this._onFieldChange('miles', value)} />
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
                <TouchableOpacity disabled={this.props.isLoading} onPress={() => this._onClickNext()}>
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
      }, () => cache.set('step4-fields', this.state.fields));
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
        let step1Fields = cache.get('step1-fields');
        let data = {
          firstName: step1Fields.firstName.value,
          lastName: step1Fields.lastName.value,
          email: step1Fields.email.value,
          cellPhone: step1Fields.cellPhone.value,
          password: step1Fields.password.value,
          miles: this.state.fields.miles.value,
          pushid: this.state.pushid
        };

        let step2Fields = cache.get('step2-fields');
        if (step2Fields) {
          data.vin = step2Fields.vin.value;
        }

        let step3Fields = cache.get('step3-fields');
        if (step3Fields) {
          data.year = step3Fields.year.value;
          data.make = step3Fields.make.value;
          data.model = step3Fields.model.value;

          let models = cache.get('step3-models') || [];
          let model = models.find(({ value }) => value === data.model) || {};
          data.model_id = model.key;
        }

        this.props.signUp(data);
      });
    }
}

var styles = StyleSheet.create({
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
    width: 180,
    height: 29,
    marginTop: 50,
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
    paddingVertical: 0,
  },
  btnRow: {
    flexDirection: 'row',
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

module.exports = connect(mapStateToProps, { signUp })(Step4);
