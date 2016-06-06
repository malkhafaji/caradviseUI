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
  ScrollView,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { signUp } from '../actions/user';
import cache from '../utils/cache';
import { getJSON } from '../utils/fetch';

var fldWidth = Dimensions.get('window').width - 40;
const VIN_LOOKUP_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/vehicles/search_by_vin';

class Step2 extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        fields: Object.assign({
          vehicleNumber: { name: 'Vehicle Number', value: '', invalid: false },
          vin: { name: 'VIN', value: '', invalid: false }
        }, cache.get('step2-fields') || {})
      };
    }

    componentDidUpdate() {
      if (this.props.isLoggedIn) {
        cache.remove('step1-fields');
        cache.remove('step2-fields');
        cache.remove('step4-fields');
        this.props.navigator.resetTo({ indent: 'Main' });
      }
    }

    render() {
        return (
          <ScrollView>
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
              <Text style={styles.textStep}>Enter your vehicle number or VIN below. If you don{"'"}t have them then proceed to the next step.</Text>
            </View>

            <View style={styles.fields}>
              <TextInput
                autoCapitalize='characters'
                autoCorrect={false}
                style={[styles.textFld, this.state.fields.vehicleNumber.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.vehicleNumber.name}
                value={this.state.fields.vehicleNumber.value}
                onChangeText={value => this._onFieldChange('vehicleNumber', value)} />
              <Text style={styles.textOr}>OR</Text>
              <TextInput
                autoCapitalize='none'
                autoCorrect={false}
                style={[styles.textFld, this.state.fields.vin.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.vin.name}
                value={this.state.fields.vin.value}
                onChangeText={value => this._onFieldChange('vin', value)} />
              <TouchableOpacity disabled={this.props.isLoading || this.state.isLoading} onPress={() => this._onClickNext()}>
                <Image
                  resizeMode='contain'
                  source={require('../../images/btn-next.png')}
                  style={styles.btnNext} />
              </TouchableOpacity>
            </View>

          </View>
          </ScrollView>
        );
    }

    _onFieldChange(key, value) {
      let field = this.state.fields[key];
      this.setState({
        fields: {
          ...(this.state.fields),
          [key]: { ...field, value: value.trim(), invalid: false }
        }
      }, () => cache.set('step2-fields', this.state.fields));
    }

    _onClickNext() {
      if (this.state.fields.vehicleNumber.value) {
        let step1Fields = cache.get('step1-fields');
        this.props.signUp({
          firstName: step1Fields.firstName.value,
          lastName: step1Fields.lastName.value,
          email: step1Fields.email.value,
          cellPhone: step1Fields.cellPhone.value,
          password: step1Fields.password.value,
          vehicleNumber: this.state.fields.vehicleNumber.value
        });
      } else if (this.state.fields.vin.value) {
        this._verifyVIN(() => this.props.navigator.push({ indent: 'Step4' }));
      } else {
        this.props.navigator.push({ indent: 'Step3' });
      }
    }

    async _verifyVIN(callback) {
      this.setState({ isLoading: true });
      let response = await getJSON(VIN_LOOKUP_URL, { vin: this.state.fields.vin.value });
      this.setState({ isLoading: false });

      if (response.error) {
        Alert.alert('Error', response.error);
      } else if (callback) {
        callback();
      }
    }
}

var styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 50,
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
  textOr: {
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 15,
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
  invalidFld: {
    borderWidth: 1,
    borderColor: 'red'
  }
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    isLoading: !!user.loading
  };
}

module.exports = connect(mapStateToProps, { signUp })(Step2);
