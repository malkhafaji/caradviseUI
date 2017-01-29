'use strict';
var TopBar = require('../components/main/topBar');
var CarBar = require('../components/main/carBar');

import React from 'react';
import {
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  Component,
  Navigator,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import cache from '../utils/cache';
import { chain, includes, flatMap, uniqBy } from 'lodash';

var width = Dimensions.get('window').width - 20;

var MAINTENANCE_URL = 'http://ec2-35-167-170-216.us-west-2.compute.amazonaws.com:3000/api/v2/services/app_service_hierarchy';

class AddServices extends Component {

    constructor(props) {
      super(props);
      var passProps = this.props.navigator._navigationContext._currentRoute.passProps || {};
      this.state = {
        services: passProps.services || null,
        searchText: ''
      };

      if (passProps.returnTo) {
        cache.set('addServices-returnTo', passProps.returnTo);
      }

      this.originalServices = passProps.services || [];
    }

    componentDidMount() {
      if (!this.state.services)
        this.getServices();
    }

    isAlreadyAdded(service) {
      if (!this.addedServiceIds) {
        if (cache.get('serviceRequest-fields')) {
          this.addedServiceIds = (cache.get('serviceRequest-fields') || {}).services || [];
        } else if (cache.get('selectMaintenance-addedServices')) {
          this.addedServiceIds = cache.get('selectMaintenance-addedServices') || [];
        } else {
          this.addedServiceIds = []
        }

        this.addedServiceIds = this.addedServiceIds.filter(({ status }) => status === 'ADDED')
                                                   .map(({ id }) => id);
      }

      return includes(this.addedServiceIds, service.id);
    }

    groupServices(services) {
      return chain(services)
        .filter(({ app_services }) => app_services && app_services.length > 0)
        .sortBy(service => (service.name || '').toLowerCase())
        .groupBy('first_level')
        .map((services, name) => ({
          name,
          services: services.filter(service => !this.isAlreadyAdded(service))
        }))
        .value();
    }

    getServices() {
      fetch(MAINTENANCE_URL)
        .then((response) => response.json())
        .then((responseData) => {
          this.originalServices = this.groupServices(responseData.services);
          this.setState({
            services: this.originalServices
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
              <TextInput
                returnKeyType='search'
                placeholder='Search'
                placeholderTextColor={'#666'}
                selectTextOnFocus={true}
                style={styles.searchFld}
                value={this.state.searchText}
                onChangeText={searchText => this.setState({ searchText })}
                onSubmitEditing={() => this.searchServices()}
              />
              {services.map(this.createServiceRow)}
            </View>
            </ScrollView>
          </View>
        );
    }

    createServiceRow = (service, i) => <Service key={`${service.name}-${i}`} service={service} nav={this.props.navigator} oilType={this.props.oilType || ''} />;

    searchServices() {
      const searchText = this.state.searchText.toLowerCase();

      if (searchText) {
        const services = [];

        this.originalServices.forEach(service => {
          if (service.name.toLowerCase().indexOf(searchText) >= 0) {
            services.push(service);
          }

          if (service.services) {
            services.push(...(service.services.filter(service => {
              return service.name.toLowerCase().indexOf(searchText) >= 0;
            })));
          }
        });

        this.setState({ services: uniqBy(services, 'name') });
      } else {
        this.setState({ services: this.originalServices });
      }
    }
}

var Service = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },
  render: function() {
    return (
      <TouchableOpacity
        style={styles.servicesList}
        onPress={() => {
          if (this.props.service.services) {
            this.props.nav.push({
              indent: 'AddServices',
              passProps: {
                services: this.props.service.services
              }
            });
          } else {
            let service = this.props.service.app_services[0];
            let options = flatMap(service.service.service_options, option => {
              let options = [];

              if ((option.positions || []).length) {
                options.push({
                  option_id: option.id,
                  key: 'position',
                  selected: null,
                  values: option.positions.map(label => ({ label, value: label }))
                });
              }

              if ((option.service_option_items || []).length) {
                options.push({
                  option_id: option.id,
                  key: 'service_option_item_id',
                  selected: null,
                  values: option.service_option_items.map(a => ({
                    label: a.name,
                    value: a.id,
                    subLabel: this.getPartsSubLabel(option, a)
                  }))
                });
              }

              return options;
            });

            if (options.length) {
              this.props.nav.push({
                indent: 'ServiceOptions',
                passProps: {
                  service: this.props.service,
                  optionIndex: 0,
                  options
                }
              });
            } else {
              this.props.nav.push({
                indent: 'ServiceDetail',
                passProps: {
                  name: this.props.service.name,
                  whatIsIt: this.props.service.what_is_this,
                  whatIf: this.props.service.what_if_decline,
                  whyDoThis: this.props.service.why_do_this,
                  factors: this.props.service.factors_to_consider,
                  service: this.props.service
                }
              });
            }
          }
        }}>
        <Text style={styles.servicesItem}>{this.props.service.name}</Text>
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
  },
  getPartsSubLabel(option, option_item) {
    const optionItemName = option_item.name.toLowerCase();

    if (SUB_LABELS[optionItemName])
      return SUB_LABELS[optionItemName];

    if (option.option_type !== 1) return null;
    if (optionItemName !== this.props.oilType.toLowerCase()) return null;
    return '(This is your manufacturer recommended oil type)';
  }
});

const SUB_LABELS = {
  'aftermarket': 'Aftermarket parts are not made by your vehicle\'s manufacturer and are usually less expensive.',
  'oem': 'OEM parts are made by your vehicle\'s manufacturer.'
};

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
    color: '#002d5e',
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
    color: '#002d5e',
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
  searchFld: {
    alignSelf: 'center',
    flex: 1,
    width,
    height: 40,
    paddingHorizontal: 15,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#aaa',
    backgroundColor: '#fff',
  },
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    oilType: user.vehicles ? user.vehicles[0].oil_type_name : null
  };
}

module.exports = connect(mapStateToProps)(AddServices);
