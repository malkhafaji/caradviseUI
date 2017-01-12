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
  ScrollView,
  LayoutAnimation,
  Alert
} from 'react-native';
import cache from '../../utils/cache';
import { getJSON } from '../../utils/fetch';
import { sortBy, range, uniqBy } from 'lodash';
import { connect } from 'react-redux';
import { signUp } from '../../actions/user';
import Spinner from 'react-native-loading-spinner-overlay';

var { width, height } = Dimensions.get('window');
var fldWidth = width - 40;

const BY_YEAR_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/vehicles/makes_by_year';
const BY_YEAR_AND_MAKE_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/vehicles/models_by_year_and_make';
const BY_MODEL_AND_SUB_MODEL_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/vehicles/engines_by_model_and_sub_model';

class VehicleDetails extends Component {
    constructor(props) {
      super(props);
      this.state = {
        hide_years: true,
        years: range(2017, 1989, -1).map(n => n.toString()).map(value => ({ value, label: value, key: value })),
        hide_makes: true,
        loading_makes: false,
        makes: cache.get('vehicleDetails-makes') || [],
        hide_models: true,
        loading_models: false,
        models: cache.get('vehicleDetails-models') || [],
        hide_sub_models: true,
        sub_models: cache.get('vehicleDetails-sub_models') || [],
        hide_engines: true,
        loading_engines: false,
        engines: cache.get('vehicleDetails-engines') || [],
        fields: Object.assign({
          year: { name: 'Select Year', value: '', invalid: false, validators: ['_isPresent'] },
          make: { name: 'Select Make', value: '', invalid: false, validators: ['_isPresent'] },
          model: { name: 'Select Model', value: '', invalid: false, validators: ['_isPresent'] },
          sub_model: { name: 'Select Sub Model', value: '', invalid: false, validators: ['_isPresent'] },
          engine: { name: 'Select Engine', value: '', invalid: false, validators: ['_isPresent'] },
          miles: { name: 'How many miles?', value: '', invalid: false, validators: ['_isPresent'] }
        }, cache.get('vehicleDetails-fields') || {})
      };
    }

    componentDidUpdate() {
      if (this.props.isLoggedIn) {
        let [currentRoute] = this.props.navigator.getCurrentRoutes().reverse();
        if (currentRoute.indent === 'VehicleDetails') {
          cache.remove('accountDetails-fields');
          cache.remove('vehicleDetails-fields');
          cache.remove('vin-fields');

          this.props.navigator.immediatelyResetRouteStack([
            { indent: 'Main' },
            { indent: 'SelectMaintenance' }
          ]);
        }
      }
    }

    render() {
      if (this.props.isLoading)
        return <Spinner visible={true} />;

      return (
        <View style={styles.base}>
          <ScrollView style={styles.scrollContainer} keyboardDismissMode='on-drag'>
          <TopBar navigator={this.props.navigator} />
          <View style={styles.formContainer}>

            <View>
              <Text style={styles.textStep}>Please select your vehicle info below to get started.</Text>
            </View>

            <View style={styles.fields}>

              {this._renderPickerToggle({
                key: 'year',
                value: this.state.fields.year.value || this.state.fields.year.name,
                isInvalid: this.state.fields.year.invalid
              })}

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
                key: 'sub_model',
                value: this.state.fields.sub_model.value || this.state.fields.sub_model.name,
                isDisabled: false,
                isInvalid: this.state.fields.sub_model.invalid
              })}

              {this._renderPickerToggle({
                key: 'engine',
                value: this.state.fields.engine.value || this.state.fields.engine.name,
                isDisabled: this.state.loading_engines,
                isInvalid: this.state.fields.engine.invalid
              })}

              <TextInput
                ref='miles'
                keyboardType='numeric'
                style={[styles.textFld, this.state.fields.miles.invalid && styles.invalidFld]}
                placeholderTextColor={'#666'}
                placeholder={this.state.fields.miles.name}
                value={this.state.fields.miles.value}
                onChangeText={value => this._onFieldChange('miles', value)}
                onEndEditing={() => cache.set('vehicleDetails-fields', this.state.fields)} />

              <View style={styles.btnCol}>
                <TouchableOpacity onPress={() => this._onClickNext()}>
                  <Image
                    resizeMode='contain'
                    source={require('../../../images/btn-next-med.png')}
                    style={styles.btnNext} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigator.push({ indent: 'Vin' })}>
                  <Image
                    resizeMode='contain'
                    source={require('../../../images/btn-enterVin.png')}
                    style={styles.btnNext} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </ScrollView>

          {this._renderPicker({
            key: 'year',
            value: this.state.fields.year.value,
            items: this.state.years,
            isHidden: this.state.hide_years,
            onClose: () => this._fetchMakes()
          })}

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
            onClose: () => this.setState({
              engines: [],
              fields: {
                ...this.state.fields,
                sub_model: { ...this.state.fields.sub_model, value: '', invalid: false },
                engine: { ...this.state.fields.engine, value: '', invalid: false }
              }
            }, () => cache.set('vehicleDetails-fields', this.state.fields))
          })}

          {this._renderPicker({
            key: 'sub_model',
            value: this.state.fields.sub_model.value,
            items: this.state.sub_models.filter(a => a.model === this.state.fields.model.value),
            isHidden: this.state.hide_sub_models,
            emptyMessage: 'Please select a model first',
            onClose: () => this._fetchEngines()
          })}

          {this._renderPicker({
            key: 'engine',
            value: this.state.fields.engine.value,
            items: this.state.engines,
            isHidden: this.state.hide_engines,
            emptyMessage: 'Please select a model first',
            onClose: () => cache.set('vehicleDetails-fields', this.state.fields)
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
                onPress={() => this._hidePicker(key)}>
                <Text>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.picker} contentContainerStyle={styles.pickerContainerStyle}>
              {items.map(item => (
                <TouchableOpacity
                  key={`${item.key}-${item.subKey}`}
                  style={styles.pickerItem}
                  onPress={() => {
                    this._onFieldChange(key, item.value);
                    this._hidePicker(key);
                    onClose && onClose();
                  }}>
                  <Text style={styles.pickerItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
        cache.set('vehicleDetails-makes', makes);
        cache.remove('vehicleDetails-models');
        cache.remove('vehicleDetails-sub_models');
        cache.remove('vehicleDetails-engines');

        this.setState({
          makes,
          models: [],
          sub_models: [],
          engines: [],
          fields: {
            ...(this.state.fields),
            make: { ...(this.state.fields.make), value: '', invalid: false },
            model: { ...(this.state.fields.model), value: '', invalid: false },
            sub_model: { ...(this.state.fields.sub_model), value: '', invalid: false },
            engine: { ...(this.state.fields.engine), value: '', invalid: false }
          }
        }, () => cache.set('vehicleDetails-fields', this.state.fields));
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
        const models = response.result.vehicles.map(vehicle => ({
          key: vehicle.model_id,
          label: vehicle.model,
          value: vehicle.model
        }));
        const sub_models = response.result.vehicles.map(vehicle => ({
          key: vehicle.sub_model_id,
          label: vehicle.sub_model,
          value: vehicle.sub_model,
          model: vehicle.model
        }));

        models = uniqBy(models, 'key');
        models = sortBy(models, ({ label }) => label.toLowerCase());
        sub_models = sortBy(sub_models, ({ label }) => label.toLowerCase());
        models.unshift({ key: '0', label: 'Select model', value: '' });
        cache.set('vehicleDetails-models', models);
        cache.set('vehicleDetails-sub_models', sub_models);
        cache.remove('vehicleDetails-engines');

        this.setState({
          models,
          sub_models,
          engines: [],
          fields: {
            ...(this.state.fields),
            model: { ...(this.state.fields.model), value: '', invalid: false },
            sub_model: { ...(this.state.fields.sub_model), value: '', invalid: false },
            engine: { ...(this.state.fields.engine), value: '', invalid: false }
          }
        }, () => cache.set('vehicleDetails-fields', this.state.fields));
      }
    }

    async _fetchEngines() {
      let year = this.state.fields.year.value;
      let make = this.state.fields.make.value;
      let model = this.state.fields.model.value;
      let sub_model = this.state.fields.sub_model.value;
      if (!year || !make || !model || !sub_model) return;

      make = this.state.makes.find(({ value }) => value === make) || {};
      let make_id = make.key;
      if (!make_id) return;

      sub_model = this.state.sub_models.find(a => a.value === sub_model && a.model === model) || {};
      let sub_model_id = sub_model.key;
      if (!sub_model_id) return;

      model = this.state.models.find(({ value }) => value === model) || {};
      let model_id = model.key;
      if (!model_id) return;

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
        cache.set('vehicleDetails-engines', engines);

        this.setState({
          engines,
          fields: {
            ...(this.state.fields),
            engine: {
              ...(this.state.fields.engine),
              value: engines[1] ? engines[1].value : '',
              invalid: false
            }
          }
        }, () => cache.set('vehicleDetails-fields', this.state.fields));
      }
    }

    _onClickNext() {
      this._validateFields(() => {
        cache.remove('vin-fields');
        const { shop } = cache.get('selectShop-fields') || {};
        if (shop)
          this.signUp();
        else
          this.props.navigator.push({ indent: 'AtShop' });
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

    signUp() {
      let accountDetailsFields = cache.get('accountDetails-fields');
      let vehicleDetailsFields = cache.get('vehicleDetails-fields');
      let data = {
        firstName: accountDetailsFields.firstName.value,
        lastName: accountDetailsFields.lastName.value,
        email: accountDetailsFields.email.value,
        cellPhone: accountDetailsFields.cellPhone.value,
        password: accountDetailsFields.password.value,
        miles: vehicleDetailsFields.miles.value,
        year: vehicleDetailsFields.year.value,
        make: vehicleDetailsFields.make.value,
        pushid: this.state.pushid
      };

      let models = cache.get('vehicleDetails-models') || [];
      let model = models.find(({ value }) => value === vehicleDetailsFields.model.value) || {};
      data.model_id = model.key;
      data.model = model.value;

      let engines = cache.get('vehicleDetails-engines') || [];
      let engine = engines.find(({ value }) => value === vehicleDetailsFields.engine.value) || {};
      data.vehicle_type_extension_engine_id = engine.key;

      this.props.signUp(data);
    }
}

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  scrollContainer: {
    flex: 1
  },
  pickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent'
  },
  pickerHidden: {
    top: height,
  },
  pickerWrapper: {
    backgroundColor: '#efefef'
  },
  pickerControls: {
    alignItems: 'flex-end'
  },
  pickerDone: {
    padding: 10
  },
  picker: {
    width,
    height: 200
  },
  pickerContainerStyle: {
    paddingBottom: 20
  },
  pickerItem: {
    paddingVertical: 7.5,
    paddingHorizontal: 10,
    backgroundColor: '#efefef'
  },
  pickerItemText: {
    fontSize: 21,
    textAlign: 'center'
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
    backgroundColor: '#efefef',
    color: '#666',
    fontSize: 21,
    paddingVertical: 0,
  },
  btnCol: {
    marginTop: 20
  },
  btnNext: {
    width: 190,
    height: 60
  },
  selectFld: {
    marginTop: 15,
    width: fldWidth,
    paddingVertical: 7.5,
    paddingHorizontal: 10,
    backgroundColor: '#efefef',
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

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    isLoading: !!user.loading
  };
}

module.exports = connect(mapStateToProps, { signUp })(VehicleDetails);
