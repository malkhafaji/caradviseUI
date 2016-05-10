'use strict';
var CarBar = require('../../components/main/carBar');

import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Component,
} from 'react-native';

class Approvals extends Component {
    render() {
        return (
          <View>
            <CarBar />
            <View>
              <Text>APPROVALS</Text>
            </View>
          </View>
        );
    }
}

var styles = StyleSheet.create({

});

module.exports = Approvals;
