'use strict';
var TopBar = require('../components/main/topBar');
var CarBar = require('../components/main/carBar');

import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Component,
  Navigator,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

var width = Dimensions.get('window').width - 20;

var MAINTENANCE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3001/api/v1/services/motor_service_hierarchy';

class AddServices extends Component {

    constructor(props) {
      super(props);
      var category = this.props.navigator._navigationContext._currentRoute.passProps ? this.props.navigator._navigationContext._currentRoute.passProps.category : null;
      var level = this.props.navigator._navigationContext._currentRoute.passProps ? this.props.navigator._navigationContext._currentRoute.passProps.level : null;
      this.state = {
        category: category,
        services:null,
        visible: false,
      };
    }

    componentDidMount() {
      this.getServices();
    }

    filterServices(service)
    {
      return service.parent_id == this.state.category;
    }

    getServices() {
      fetch(MAINTENANCE_URL)
        .then((response) => response.json())
        .then((responseData) => {
          this.setState({
            services: responseData.services.filter(this.filterServices.bind(this)),
          });
        })
        .done();
    }

    render() {
      if (!this.state.services) {
        return this.renderLoadingView();
      }
      var services = this.state.services;
      return this.renderServices(services);
    }

    renderLoadingView() {
      return (
        <View>
          <Spinner visible={true} />
        </View>
      );
    }

    renderServices(services) {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <ScrollView>
            <View style={styles.servicesContainer}>
              <Text style={styles.textHd}>Select Service</Text>
              {services.map(this.createServiceRow)}
            </View>
            </ScrollView>
          </View>
        );
    }

    createServiceRow = (service, i) => <Service key={i} service={service} nav={this.props.navigator}  />;
}

var Service = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },
  render: function() {
    //var indent = this.props.level != 4 ? 'AddServices' : 'ServiceDetail';
    return (
      <TouchableOpacity
        style={styles.servicesList}
        onPress={() => this.props.nav.push({ indent:'ServiceDetail',
          passProps:{
            category:this.props.service.system_description,
            name:this.props.service.literal_name,
            whatIsIt:this.props.service.what_is_it,
            whatIf:this.props.service.what_if_decline,
            whyDoThis:this.props.service.why_do_this,
            factors:this.props.service.factors_to_consider,
          }})}>
        <Text style={styles.servicesItem}>{this.props.service.literal_name}</Text>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>
            <Image
              resizeMode="contain"
              source={require('../../images/arrow-blue.png')}
              style={styles.arrowBlue} />
          </Text>
        </View>
      </TouchableOpacity>

    );
  }
});

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  servicesContainer: {
    alignItems: 'center',
  },
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#006699',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center'
  },
  servicesList: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    width: width,
    padding: 15,
    marginBottom: 2,
  },
  servicesItem: {
    flex: 3,
    color: '#006699',
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrowContainer: {
    flex: 1,
  },
  arrow: {
    textAlign: 'right',
    paddingTop: 5,
  },
  arrowBlue: {
    width: 8,
    height: 13,
  },
});

module.exports = AddServices;
