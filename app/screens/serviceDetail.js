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
  ScrollView,
  Dimensions,
  LayoutAnimation
} from 'react-native';
import { connect } from 'react-redux';
import { findLastIndex } from 'lodash';
import cache from '../utils/cache';

var width = Dimensions.get('window').width - 20;
var height = Dimensions.get('window').height;

class ServiceDetail extends Component {

    constructor(props) {
      super(props);
      var passProps = this.props.navigator._navigationContext._currentRoute.passProps;
      var service = passProps.service.app_services[0];
      this.state = {
        id: passProps.category,
        name:passProps.name,
        whatIsIt:service.service.what_is_this,
        whyDoThis:service.service.why_do_this,
        whatIf:service.service.what_if_decline,
        factors:service.service.factors_to_consider,
        service:passProps.service,
        serviceOptions: service.service.service_options
            .map(a => ({ ...a, service_id: service.service_id })),
        selectedOptions: {},
        pickers: {
          part: [],
          quantity: [{ label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }],
          position: [],
          unit: []
        },
        hide_pickers: {
          part: true,
          quantity: true,
          position: true,
          unit: true
        },
      };
    }

    renderOil()
    {
        if (this.state.name == "Oil Change") {
            return (
              <View style={styles.oilContainer}>
                <Text style={styles.oilHd}>Your Recommended Oil:</Text>
                <View style={styles.oilType}><Text style={styles.oilTypeTxt}>{this.props.oilType}</Text></View>
              </View>
            );
        } else {
            return null;
        }
    }
    renderWhat()
    {
        if (this.state.whatIsIt) {
            return (
              <View>
                <Text style={styles.textHd}>What is it?</Text>
                <View style={styles.whatContainer}><View style={styles.whatTxtContainer}><Text style={styles.whatTxt}>{this.state.whatIsIt}</Text></View></View>
              </View>
            );
        } else {
            return null;
        }
    }
    renderWhy()
    {
        if (this.state.whyDoThis) {
            return (
              <View>
              <Text style={styles.textHd}>Why do this?</Text>
              <View style={styles.whatContainer}><View style={styles.whatTxtContainer}><Text style={styles.whatTxt}>{this.state.whyDoThis}</Text></View></View>
              </View>
            );
        } else {
            return null;
        }
    }
    renderWhatIf()
    {
        if (this.state.whatIf) {
            return (
              <View>
              <Text style={styles.textHd}>What if I decline?</Text>
              <View style={styles.whatContainer}><View style={styles.whatTxtContainer}><Text style={styles.whatTxt}>{this.state.whatIf}</Text></View></View>
              </View>
            );
        } else {
            return null;
        }
    }
    renderFactors()
    {
        if (this.state.factors) {
            return (
              <View>
              <Text style={styles.textHd}>Factors to consider</Text>
              <View style={styles.whatContainer}><View style={styles.whatTxtContainer}><Text style={styles.whatTxt}>{this.state.factors}</Text></View></View>
              </View>
            );
        } else {
            return null;
        }
    }

    addService() {
      if (cache.get('serviceRequest-fields')) {
        const fields = cache.get('serviceRequest-fields');
        fields.services.push({ ...this.state.service, status: 'ADDED' });
        cache.set('serviceRequest-fields', fields);
      } else {
        const services = cache.get('selectMaintenance-addedServices') || [];
        services.push({ ...this.state.service, status: 'ADDED' });
        cache.set('selectMaintenance-addedServices', services);
      }

      let selectedOptions = this.state.selectedOptions;
      let selectedOptionIds = Object.keys(selectedOptions).filter(id => !!selectedOptions.item_id);
      if (selectedOptionIds.length > 0) {
        let serviceOptions = cache.get('serviceDetail-serviceOptions') || {};
        let { service_id } = this.state.serviceOptions[0];

        serviceOptions[service_id] = {
          parts: selectedOptionIds.map(id => ({
            service_option_id: id,
            service_option_item_id: selectedOptions[id].item_id,
            quantity: selectedOptions[id].quantity,
            position: selectedOptions[id].position || undefined,
            unit_name: selectedOptions[id].unit || undefined
          }))
        };

        cache.set('serviceDetail-serviceOptions', serviceOptions);
      }

      const route = { indent: cache.get('addServices-returnTo') };
      const routes = this.props.navigator.getCurrentRoutes();
      this.props.navigator.replaceAtIndex(route, findLastIndex(routes, route));
      this.props.navigator.popToRoute(route);
    }

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />
            <CarBar />
            <ScrollView
              style={styles.scrollView}>
            <View style={styles.serviceContainer}>

              <Text style={styles.textHd}>Service Detail</Text>

              <View style={styles.serviceList}>

                  <View style={styles.serviceRow}>
                    <Text style={styles.serviceItem}>{this.state.name}</Text>

                    {this.state.lowCost !== undefined && this.state.highCost !== undefined &&
                    <View style={styles.fairPriceContainer}>
                      <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                      <View style={styles.fairPriceRange}>
                        <Text style={styles.fairPrice}>${this.state.lowCost}</Text>
                        <Image
                          source={require('../../images/arrow-range.png')}
                          style={styles.fairPriceArrow} />
                        <Text style={styles.fairPrice}>${this.state.highCost}</Text>
                      </View>
                    </View>}

                  </View>

              </View>

              {this.renderOil()}
              {this.renderServiceOptions()}

              <View style={styles.approveDecline}>
                <TouchableOpacity onPress={() => this.addService()}>
                  <Image
                    source={require('../../images/btn-add.png')}
                    style={styles.btnAdd} />
                </TouchableOpacity>
              </View>

              {this.renderWhat()}
              {this.renderWhy()}
              {this.renderWhatIf()}
              {this.renderFactors()}

            </View>
            </ScrollView>

            {this.renderPicker({
              key: 'part',
              items: this.state.pickers.part,
              onChange: a => this.setState({
                selectedOptions: {
                  ...this.state.selectedOptions,
                  [a.option.id]: {
                    quantity: 1,
                    position: a.option.positions ? a.option.positions[0] : '',
                    unit: a.option.units ? a.option.units[0] : '',
                    ...(this.state.selectedOptions[a.option.id] || {}),
                    item_id: a.option_item.id,
                    part: a.value
                  }
                }
              })
            })}

            {this.renderPicker({
              key: 'quantity',
              items: this.state.pickers.quantity,
              onChange: a => this.setState({
                selectedOptions: {
                  ...this.state.selectedOptions,
                  [a.option.id]: {
                    ...(this.state.selectedOptions[a.option.id] || {}),
                    quantity: a.value
                  }
                }
              })
            })}

            {this.renderPicker({
              key: 'position',
              items: this.state.pickers.position,
              onChange: a => this.setState({
                selectedOptions: {
                  ...this.state.selectedOptions,
                  [a.option.id]: {
                    ...(this.state.selectedOptions[a.option.id] || {}),
                    position: a.value
                  }
                }
              })
            })}

            {this.renderPicker({
              key: 'unit',
              items: this.state.pickers.unit,
              onChange: a => this.setState({
                selectedOptions: {
                  ...this.state.selectedOptions,
                  [a.option.id]: {
                    ...(this.state.selectedOptions[a.option.id] || {}),
                    unit: a.value
                  }
                }
              })
            })}
          </View>
        );
    }

    renderServiceOptions() {
      if (this.state.serviceOptions.length === 0)
        return null;

      return (
        <View>
          {this.state.serviceOptions.map(option => this.renderServiceOptionItem(option))}
        </View>
      );
    }

    renderServiceOptionItem(option) {
      let selectedOption = this.state.selectedOptions[option.id] || {};

      return (
        <View key={option.id} style={styles.partOptionsContainer}>
          <View style={styles.partOptionsHeader}>
            <Text style={styles.partOptionsHeaderText}>
              { option.option_type == 0 ? 'Part' : 'Fluid' } Options
            </Text>
          </View>
          <View style={styles.partOptionsSelectPart}>
            {this.renderPickerToggle({
              key: 'part',
              value: selectedOption.part || `Select ${option.option_type == 0 ? 'Part' : 'Fluid'}`,
              onPress: () => {
                this.setState({
                  pickers: {
                    ...this.state.pickers,
                    part: option.service_option_items.map(option_item => {
                      let label = option_item.name;
                      return { label, value: label, option, option_item };
                    })
                  }
                })
              }
            })}
          </View>
          <View style={styles.partOptionsSelectOptions}>

            { this.state.name != "Oil Change" ? (
            <View style={styles.partOptionsSelectQuantity}>
              <View style={styles.partOptionsSelectLabel}>
                <Text style={styles.partOptionsSelectLabelText}>Quantity: </Text>
              </View>
              {this.renderPickerToggle({
                key: 'quantity',
                value: selectedOption.quantity || 1,
                onPress: () => {
                  this.setState({
                    pickers: {
                      ...this.state.pickers,
                      quantity: [1,2,3,4].map(label => ({ label, value: label, option }))
                    }
                  })
                }
              })}
            </View>
            ) : null }

            { (option.positions || []).length > 0 ?
              <View style={styles.partOptionsSelectPosition}>
                <View style={styles.partOptionsSelectLabel}>
                  <Text style={styles.partOptionsSelectLabelText}>Position: </Text>
                </View>
                {this.renderPickerToggle({
                  key: 'position',
                  value: selectedOption.position || option.positions[0],
                  onPress: () => {
                    this.setState({
                      pickers: {
                        ...this.state.pickers,
                        position: option.positions.map(label => ({ label, value: label, option }))
                      }
                    })
                  }
                })}
              </View> : null
            }
            { (option.units || []).length > 0 ?
              <View style={styles.partOptionsSelectUnit}>
                <View style={styles.partOptionsSelectLabel}>
                  <Text style={styles.partOptionsSelectLabelText}>Unit: </Text>
                </View>
                {this.renderPickerToggle({
                  key: 'unit',
                  value: selectedOption.unit || option.units[0],
                  onPress: () => {
                    this.setState({
                      pickers: {
                        ...this.state.pickers,
                        unit: option.units.map(label => ({ label, value: label, option }))
                      }
                    })
                  }
                })}
              </View> : null
            }
          </View>
        </View>
      );
    }

    renderPickerToggle({ key, value, onPress }) {
      return (
        <TouchableOpacity
          ref={key}
          key={key}
          style={styles.selectFld}
          onPress={() => {
            onPress && onPress();
            this.showPicker(key);
          }}>
          <Text style={styles.selectTextFld}>{value}</Text>
          <Text style={styles.selectArrow}>{'>'}</Text>
        </TouchableOpacity>
      );
    }

    renderPicker({ key, items, onChange }) {
      return (
        <View key={key} style={[styles.pickerContainer, this.state.hide_pickers[key] && styles.pickerHidden]}>
          <View style={styles.pickerWrapper}>
            <View style={styles.pickerControls}>
              <TouchableOpacity
                style={styles.pickerDone}
                onPress={() => this.hidePicker(key)}>
                <Text>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.picker} contentContainerStyle={styles.pickerContainerStyle}>
              {items.map(item => (
                <TouchableOpacity
                  key={item.option_item ? item.option_item.id : item.value}
                  style={styles.pickerItem}
                  onPress={() => {
                    onChange && onChange(item);
                    this.hidePicker(key);
                  }}>
                  <Text style={styles.pickerItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )
    }

    showPicker(type) {
      LayoutAnimation.easeInEaseOut();
      this.setState({ hide_pickers: { ...this.state.hide_pickers, [type]: false } });
    }

    hidePicker(type) {
      LayoutAnimation.easeInEaseOut();
      this.setState({ hide_pickers: { ...this.state.hide_pickers, [type]: true } });
    }
}

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    width: width,
    height: Dimensions.get('window').height,
    marginLeft: 10,
    marginRight: 10,
  },
  serviceContainer: {
    alignItems: 'center',
    marginBottom: 200,
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
  serviceList: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
  },
  serviceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: Dimensions.get('window').width,
    paddingLeft: 10,
    paddingRight: 10,
  },
  serviceItem: {
    flex: 2,
    marginTop: 17,
    marginBottom: 15,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#002d5e',
    alignItems: 'center',
  },
  fairPriceContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
    alignItems: 'center',
  },
  servicePriceContainer: {
    flex: 1,
    marginTop: 10,
    marginRight: 10,
  },
  servicePriceHd: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  servicePrice: {
    textAlign: 'right',
    color: '#002d5e',
    fontWeight: 'bold',
  },
  serviceRange: {
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
  },
  fairPriceRange: {
    flexDirection: 'row',
  },
  fairPriceText: {
    color: '#F49D11',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fairPriceArrow: {
    width: 22,
    height: 10,
    marginTop: 4,
    marginLeft: 2,
    marginRight: 2,
  },
  fairPrice: {
    color: '#002d5e',
    fontWeight: 'bold',
  },
  serviceDescContainer: {
    backgroundColor: '#EFEFEF',
    width: Dimensions.get('window').width,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
  },
  serviceDesc: {
    backgroundColor: '#FFF',
    padding: 10,
  },
  btnAdd: {
    width: 300,
    height: 40,
    marginTop: 15,
  },
  oilContainer: {
    width: width,
    backgroundColor: '#fff',
    marginTop: 5,
    padding: 10,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#002d5e'
  },
  oilHd: {
    color: '#002d5e',
    fontSize: 12
  },
  oilTypeTxt: {
    color: '#002d5e',
    fontWeight: 'bold'
  },
  whatContainer: {
    backgroundColor: '#EFEFEF',
    width: width,
  },
  whatTxtContainer: {
    margin: 5,
    backgroundColor: '#FFF',
  },
  whatTxt: {
    backgroundColor: '#FFF',
    margin: 10,
    color: '#002d5e',
    fontSize: 12,
  },
  partOptionsContainer: {
    width,
    marginTop: 5,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  partOptionsHeader: {
    backgroundColor: '#002d5e',
    alignItems: 'center',
    padding: 5
  },
  partOptionsHeaderText: {
    color: 'white',
    fontWeight: 'bold'
  },
  partOptionsSelectPart: {
    marginTop: 2,
    padding: 5,
    backgroundColor: '#EFEFEF'
  },
  partOptionsSelectOptions: {
    borderWidth: 2,
    borderColor: '#EFEFEF',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
    flexWrap: 'wrap'
  },
  partOptionsSelectQuantity: {
    flexDirection: 'row',
    marginRight: 10
  },
  partOptionsSelectPosition: {
    flexDirection: 'row',
    marginRight: 10
  },
  partOptionsSelectUnit: {
    flexDirection: 'row',
    marginRight: 10
  },
  partOptionsSelectLabel: {
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  partOptionsSelectLabelText: {

  },
  selectFld: {
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderColor: '#bbb',
  },
  selectTextFld: {
    flex: 1,
    color: '#002d5e',
    fontWeight: 'bold'
  },
  selectArrow: {
    width: 20,
    color: '#002d5e',
    fontWeight: 'bold',
    textAlign: 'right'
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
    width: width + 20,
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
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token,
    vehicleId : user.vehicles[0].id,
    oilType : user.vehicles[0].oil_type_name,
  };
}

module.exports = connect(mapStateToProps)(ServiceDetail);
