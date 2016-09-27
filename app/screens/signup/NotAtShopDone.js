'use strict';

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  LayoutAnimation,
  Component,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import TopBar from '../../components/main/topBar.js';
import cache from '../../utils/cache';
import { putJSON } from '../../utils/fetch';

var { width, height } = Dimensions.get('window');
var fldWidth = width - 40;

var UPDATE_VEHICLE_PROPERTIES_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/owner_vehicles/update_owner_vehicle_properties';

class NotAtShopDone extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hide_type_of_driving: true,
      types_of_driving: [{ label: 'Highway', value: 'Highway' }, { label: 'City', value: 'City' }, { label: 'Both', value: 'Both' }],
      hide_used_or_new: true,
      types_of_car: [{ label: 'Used', value: 'Used' }, { label: 'New', value: 'New' }],
      fields: Object.assign({
        miles_per_month: { name: '', value: '', invalid: false, validators: ['_isPresent'] },
        type_of_driving: { name: '', value: 'Select', invalid: false, validators: ['_isPresent'] },
        used_or_new: { name: '', value: 'Select', invalid: false, validators: ['_isPresent'] }
      }, cache.get('notAtShopDone-fields') || {})
    };
  }

  render() {
    return (
      <View style={styles.base}>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps={true} keyboardDismissMode={'on-drag'}>
        <TopBar navigator={this.props.navigator} />
        <View style={styles.formContainer}>
          <Text style={styles.textHd1}>Great, we have a few additional questions to complete your vehicle profile.</Text>

          <View style={styles.fields}>
            <Text style={styles.fieldLbl}>How many miles do you drive per month?</Text>
            <TextInput
              ref='miles_per_month'
              keyboardType='numeric'
              style={[styles.textFld, this.state.fields.miles_per_month.invalid && styles.invalidFld]}
              placeholderTextColor={'#666'}
              placeholder={this.state.fields.miles_per_month.name}
              value={this.state.fields.miles_per_month.value}
              onChangeText={value => this._onFieldChange('miles_per_month', value)} />
            <Text style={styles.fieldLbl}>What type of driving do you do the most?</Text>
            {this._renderPickerToggle({
              key: 'type_of_driving',
              value: this.state.fields.type_of_driving.value || this.state.fields.type_of_driving.name,
              isInvalid: this.state.fields.type_of_driving.invalid
            })}
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLbl}>Did you purchase your car new or used?</Text>
            </View>
            {this._renderPickerToggle({
              key: 'used_or_new',
              value: this.state.fields.used_or_new.value || this.state.fields.used_or_new.name,
              isInvalid: this.state.fields.used_or_new.invalid
            })}
            <View style={styles.btnRow}>
              <TouchableOpacity onPress={() => this._onClickSubmit()}>
                <Image
                  resizeMode='contain'
                  source={require('../../../images/btn-submit.png')}
                  style={styles.btnNext} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {this._renderPicker({
          key: 'type_of_driving',
          items: this.state.types_of_driving,
          isHidden: this.state.hide_type_of_driving
        })}

        {this._renderPicker({
          key: 'used_or_new',
          items: this.state.types_of_car,
          isHidden: this.state.hide_used_or_new
        })}

      </ScrollView>
      </View>
    );
  }

  _renderPickerToggle({ key, value, isInvalid }) {
    return (
      <TouchableOpacity
        ref={key}
        key={key}
        style={[styles.selectFld, isInvalid && styles.invalidFld]}
        onPress={() => this._showPicker(key)}>
        <Text style={styles.selectTextFld}>{value}</Text>
        <Text style={styles.selectArrow}>{'>'}</Text>
      </TouchableOpacity>
    );
  }

  _renderPicker({ key, items, isHidden }) {
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
                key={item.value}
                style={styles.pickerItem}
                onPress={() => {
                  this._onFieldChange(key, item.value);
                  this._hidePicker(key);
                }}>
                <Text style={styles.pickerItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  _showPicker(type) {
    LayoutAnimation.easeInEaseOut();
    this.setState({ [`hide_${type}`]: false });
  }

  _hidePicker(type) {
    LayoutAnimation.easeInEaseOut();
    this.setState({ [`hide_${type}`]: true });
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

  _onClickSubmit() {
    this._validateFields(() => {
      if (!this.props.isLoggedIn) return;

      putJSON(
        UPDATE_VEHICLE_PROPERTIES_URL,
        {
          vehicle_id: this.props.vehicleId,
          miles_per_month: this.state.fields.miles_per_month.value,
          type_of_driving: this.state.fields.type_of_driving.value,
          used_or_new: this.state.fields.used_or_new.value
        },
        { 'Authorization': this.props.authentication_token }
      );

      cache.remove('notAtShopDone-fields');
      this.props.navigator.pop();
    });
  }
}

var styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
  },
  base: {
    flex: 1,
    backgroundColor: 'white'
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  textHd1: {
    marginTop: 50,
    color: '#002d5e',
    fontSize: 21,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center'
  },
  textHd2: {
    color: '#002d5e',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
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
  btnNext: {
    width: 190,
    height: 40,
    marginTop: 10,
    marginLeft: 5,
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
  selectFld: {
    marginTop: 5,
    marginBottom: 15,
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
    authentication_token: user.authentication_token,
    isLoggedIn: !!user.authentication_token,
    vehicleId: user.vehicles && user.vehicles[0] ? user.vehicles[0].id : null
  };
}

module.exports = connect(mapStateToProps)(NotAtShopDone);
