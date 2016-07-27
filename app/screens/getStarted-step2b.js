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
import cache from '../utils/cache';
import { getJSON } from '../utils/fetch';
import storage from '../utils/storage';

var fldWidth = Dimensions.get('window').width - 40;
const VIN_LOOKUP_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3001/api/v1/vehicles/search_by_vin';

class Step2b extends Component {
    constructor(props) {
      super(props);

      this.state = {
        isLoading: false,
        fields: Object.assign({
          vin: { name: 'VIN', value: '', invalid: false }
        }, cache.get('step2b-fields') || {})
      };
    }

    render() {
        return (
          <ScrollView keyboardShouldPersistTaps={true} keyboardDismissMode={'on-drag'}>
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
              <Text style={styles.textStep}>Enter your VIN below. If you don{"'"}t know it then proceed to the next step.</Text>
            </View>

            <View style={styles.fields}>
              <TextInput
                autoCorrect={false}
                autoCapitalize="characters"
                style={[styles.textFld, this.state.fields.vin.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.vin.name}
                value={this.state.fields.vin.value}
                onChangeText={value => this._onFieldChange('vin', value)} />
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
                <TouchableOpacity disabled={this.state.isLoading} onPress={() => this._onClickNext()}>
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

    _onFieldChange(key, value) {
      let field = this.state.fields[key];
      this.setState({
        fields: {
          ...(this.state.fields),
          [key]: { ...field, value: value.trim(), invalid: false }
        }
      }, () => cache.set('step2b-fields', this.state.fields));
    }

    _onClickNext() {
      if (this.state.fields.vin.value) {
        this._verifyVIN(() => {
          cache.remove('step2a-fields');
          cache.remove('step3-fields');
          this.props.navigator.push({ indent: 'Step4' });
        });
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
    paddingVertical: 0,
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
  btnRow: {
    flexDirection: 'row',
  }
});

module.exports = Step2b;