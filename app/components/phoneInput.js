import React from 'react';
import { TextInput, Component } from 'react-native';

export default class PhoneInput extends Component {
  render() {
    return (
      <TextInput { ...this.props }
        keyboardType={'phone-pad'}
        onChangeText={ this.onChangeText }
      />
    );
  }

  onChangeText = value => {
    value = value.replace(/^(\d{3})(\d)/, '($1) $2');
    value = value.replace(/ (\d{3})(\d)/, " $1-$2");
    this.props.onChangeText(value);
  }
}
