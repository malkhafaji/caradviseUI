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
  Picker,
  LayoutAnimation,
  Alert
} from 'react-native';
import cache from '../utils/cache';
import { getJSON } from '../utils/fetch';
import sortBy from 'lodash/sortBy';

var fldWidth = Dimensions.get('window').width - 40;

const BY_YEAR_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3001/api/v1/vehicles/makes_by_year';
const BY_YEAR_AND_MAKE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3001/api/v1/vehicles/models_by_year_and_make';
const BY_MODEL_AND_SUB_MODEL_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3001/api/v1/vehicles/engines_by_model_and_sub_model';

class Step3 extends Component {
    constructor(props) {
      super(props);
      this.state = {
        hide_makes: true,
        loading_makes: false,
        makes: cache.get('step3-makes') || [],
        hide_models: true,
        loading_models: false,
        models: cache.get('step3-models') || [],
        hide_engines: true,
        loading_engines: false,
        engines: cache.get('step3-engines') || [],
        fields: Object.assign({
          year: { name: 'Year', value: '', invalid: false, validators: ['_isPresent'] },
          make: { name: 'Make', value: '', invalid: false, validators: ['_isPresent'] },
          model: { name: 'Model', value: '', invalid: false, validators: ['_isPresent'] },
          engine: { name: 'Engine', value: '', invalid: false, validators: ['_isPresent'] }
        }, cache.get('step3-fields') || {})
      };
    }

    render() {
      return (
        <View style={styles.base}>
          <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps={true}>
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
              <Text style={styles.textStep}>Please select your vehicle info below to get started.</Text>
            </View>

            <View style={styles.fields}>
              <TextInput
                ref='year'
                keyboardType='numeric'
                maxLength={4}
                style={[styles.textFld, this.state.fields.year.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.year.name}
                value={this.state.fields.year.value}
                onChangeText={value => this._onFieldChange('year', value)}
                onEndEditing={() => this._fetchMakes()} />

              {this._renderPickerToggle({
                key: 'make',
                value: this.state.fields.make.value || this.state.fields.make.name,
                isDisabled: this.state.loading_makes,
                isInvalid: this.state.fields.make.invalid
              })}

              {this._renderPickerToggle({
                key: 'model',
                value: this.state.fields.model.value || this.state.fields.model.name,
                isDisabled: this.state.loading_models,
                isInvalid: this.state.fields.model.invalid
              })}

              {this._renderPickerToggle({
                key: 'engine',
                value: this.state.fields.engine.value || this.state.fields.engine.name,
                isDisabled: this.state.loading_engines,
                isInvalid: this.state.fields.engine.invalid
              })}

              <View style={styles.btnRow}>
                <TouchableOpacity onPress={() => this.props.navigator.pop()}>
                  <Image
                    resizeMode='contain'
                    source={require('../../images/btn-back-white.png')}
                    style={styles.btnBack} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._onClickNext()}>
                  <Image
                    resizeMode='contain'
                    source={require('../../images/btn-next.png')}
                    style={styles.btnNext} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </ScrollView>

          {this._renderPicker({
            key: 'make',
            value: this.state.fields.make.value,
            items: this.state.makes,
            isHidden: this.state.hide_makes,
            emptyMessage: 'Please enter a year first',
            onClose: () => this._fetchModels()
          })}

          {this._renderPicker({
            key: 'model',
            value: this.state.fields.model.value,
            items: this.state.models,
            isHidden: this.state.hide_models,
            emptyMessage: 'Please select a make first',
            onClose: () => this._fetchEngines()
          })}

          {this._renderPicker({
            key: 'engine',
            value: this.state.fields.engine.value,
            items: this.state.engines,
            isHidden: this.state.hide_engines,
            emptyMessage: 'Please select a model first',
            onClose: () => cache.set('step3-fields', this.state.fields)
          })}
        </View>
      );
    }

    _renderPickerToggle({ key, value, isDisabled, isInvalid }) {
      return (
        <TouchableOpacity
          ref={key}
          key={key}
          disabled={isDisabled}
          style={[styles.selectFld, isInvalid && styles.invalidFld]}
          onPress={() => this._showPicker(key)}>
          <Text style={styles.selectTextFld}>{value}</Text>
          <Text style={styles.selectArrow}>{'>'}</Text>
        </TouchableOpacity>
      );
    }

    _renderPicker({ key, value, items, isHidden, emptyMessage, onClose }) {
      if (items.length === 0)
        items = [{ key: '0', label: emptyMessage, value: '' }];

      return (
        <View key={key} style={[styles.pickerContainer, isHidden && styles.pickerHidden]}>
          <View style={styles.pickerWrapper}>
            <View style={styles.pickerControls}>
              <TouchableOpacity
                style={styles.pickerDone}
                onPress={() => {
                  this._hidePicker(key);
                  onClose && onClose();
                }}>
                <Text>Done</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={value}
              onValueChange={value => this._onFieldChange(key, value)}
              style={styles.picker}>
              {items.map(item => <Picker.Item {...item} />)}
            </Picker>
          </View>
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

    async _fetchMakes() {
      let year = this.state.fields.year.value;
      if (!year) return;

      this.setState({ loading_makes: true });
      let response = await getJSON(BY_YEAR_URL, { year });
      this.setState({ loading_makes: false });

      if (response.error) {
        Alert.alert('Error', response.error);
      } else if (response.result) {
        const makes = response.result.vehicles.map(({ make_id, make }) => {
          return { key: make_id, label: make, value: make };
        });

        makes = sortBy(makes, ({ label }) => label.toLowerCase());
        makes.unshift({ key: '0', label: 'Select make', value: '' });
        cache.set('step3-makes', makes);
        cache.remove('step3-models');

        this.setState({
          makes,
          fields: {
            ...(this.state.fields),
            make: { ...(this.state.fields.make), value: '', invalid: false },
            model: { ...(this.state.fields.model), value: '', invalid: false }
          }
        }, () => cache.set('step3-fields', this.state.fields));
      }
    }

    async _fetchModels() {
      let year = this.state.fields.year.value;
      let make = this.state.fields.make.value;
      if (!year || !make) return;

      make = this.state.makes.find(({ value }) => value === make) || {};
      let make_id = make.key;
      if (!make_id) return;

      this.setState({ loadingModels: true });
      let response = await getJSON(BY_YEAR_AND_MAKE_URL, { year, make_id });
      this.setState({ loadingModels: false });

      if (response.error) {
        Alert.alert('Error', response.error);
      } else if (response.result) {
        const models = response.result.vehicles.map(vehicle => {
          return {
            key: vehicle.model_id,
            subKey: vehicle.sub_model_id,
            label: `${vehicle.model} ${vehicle.sub_model}`,
            value: `${vehicle.model} ${vehicle.sub_model}`,
            originalValue: vehicle.model
          };
        });

        models = sortBy(models, ({ label }) => label.toLowerCase());
        models.unshift({ key: '0', label: 'Select model', value: '' });
        cache.set('step3-models', models);

        this.setState({
          models,
          fields: {
            ...(this.state.fields),
            model: { ...(this.state.fields.model), value: '', invalid: false }
          }
        }, () => cache.set('step3-fields', this.state.fields));
      }
    }

    async _fetchEngines() {
      let year = this.state.fields.year.value;
      let make = this.state.fields.make.value;
      let model = this.state.fields.model.value;
      if (!year || !make || !model) return;

      make = this.state.makes.find(({ value }) => value === make) || {};
      let make_id = make.key;
      if (!make_id) return;

      model = this.state.models.find(({ value }) => value === model) || {};
      let model_id = model.key;
      let sub_model_id = model.subKey;
      if (!model_id || !sub_model_id) return;

      this.setState({ loadingEngines: true });
      let response = await getJSON(BY_MODEL_AND_SUB_MODEL_URL, { year, make_id, model_id, sub_model_id });
      this.setState({ loadingEngines: false });

      if (response.error) {
        Alert.alert('Error', response.error);
      } else if (response.result) {
        const engines = response.result.vehicles.map(({ id, description }) => {
          return { key: id, label: description, value: description };
        });

        engines = sortBy(engines, ({ label }) => label.toLowerCase());
        engines.unshift({ key: '0', label: 'Select engine', value: '' });
        cache.set('step3-engines', engines);

        this.setState({
          engines,
          fields: {
            ...(this.state.fields),
            engine: { ...(this.state.fields.engine), value: '', invalid: false }
          }
        }, () => cache.set('step3-fields', this.state.fields));
      }
    }

    _onClickNext() {
      this._validateFields(() => {
        cache.remove('step2-fields');
        this.props.navigator.push({ indent: 'Step4' });
      });
    }

    _showPicker(type) {
      LayoutAnimation.easeInEaseOut();
      this.setState({ [`hide_${type}s`]: false });
    }

    _hidePicker(type) {
      LayoutAnimation.easeInEaseOut();
      this.setState({ [`hide_${type}s`]: true });
    }
}

var styles = StyleSheet.create({
  base: {
    flex: 1
  },
  scrollContainer: {
    flex: 1
  },
  pickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dimensions.get('window').height,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent'
  },
  pickerHidden: {
    top: Dimensions.get('window').height,
  },
  pickerWrapper: {
    backgroundColor: '#fff'
  },
  pickerControls: {
    alignItems: 'flex-end'
  },
  pickerDone: {
    padding: 10
  },
  picker: {
    width: Dimensions.get('window').width
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
  selectFld: {
    marginTop: 15,
    width: fldWidth,
    paddingVertical: 7.5,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    flexDirection: 'row'
  },
  selectTextFld: {
    flex: 1,
    color: '#666',
    fontSize: 21
  },
  selectArrow: {
    width: 20,
    color: '#666',
    fontSize: 21,
    textAlign: 'center'
  },
  invalidFld: {
    borderWidth: 1,
    borderColor: 'red'
  }
});

module.exports = Step3;
