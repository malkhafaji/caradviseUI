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
} from 'react-native';

class Settings extends Component {

    render() {
        return (
          <View>
            <TopBar />
            <View style={styles.settingsContainer}>
              <Text style={styles.textHd}>Settings</Text>

              <View style={styles.settingsRow}>
                <Text style={styles.fldName}>FIRST NAME</Text>
                <TextInput
                  style={styles.textFld}
                  placeholderTextColor={'#11325F'}
                  placeholder={'Jane'} />
              </View>
              <View style={styles.settingsRow}>
                <Text style={styles.fldName}>LAST NAME</Text>
                <TextInput
                  style={styles.textFld}
                  placeholderTextColor={'#11325F'}
                  placeholder={'Doe'} />
              </View>
              <View style={styles.settingsRow}>
                <Text style={styles.fldName}>EMAIL</Text>
                <TextInput
                  style={styles.textFld}
                  placeholderTextColor={'#11325F'}
                  placeholder={'jane.doe@gmail.com'} />
              </View>
              <View style={styles.settingsRow}>
                <Text style={styles.fldName}>PASSWORD</Text>
                <TextInput
                  style={styles.textFld}
                  placeholderTextColor={'#11325F'}
                  placeholder={'XXXXXX'} />
              </View>

              <View>
                <TouchableOpacity>
                  <Image
                    source={require('../../images/btn-save-blue.png')}
                    style={styles.btnSave} />
                </TouchableOpacity>
              </View>

            </View>
          </View>
        );
    }
}

var styles = StyleSheet.create({
  settingsContainer: {
    alignItems: 'center',
    marginBottom: 200,
  },
  textHd: {
    fontSize: 17,
    marginTop: 15,
    marginBottom: 8,
    color: '#666666',
  },
  settingsRow: {
    flexDirection: 'row',
    width: 360,
    marginBottom: 3,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 15,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#F4F4F4',
  },
  fldName: {
    width: 100,
    color: '#11325F',
    fontSize: 12,
  },
  textFld: {
    width: 230,
    height: 16,
    textAlign: 'right',
    color: '#11325F',
    fontWeight: 'bold',
  },
  btnSave: {
    width: 169,
    height: 34,
    marginTop: 15,
  },
});

module.exports = Settings;
