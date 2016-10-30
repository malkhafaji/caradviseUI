'use strict';
var TopBar = require('../../components/main/topBar');
var CarBar = require('../../components/main/carBar');

import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Component,
  TouchableOpacity,
  Dimensions,
  LayoutAnimation,
  ScrollView,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { putJSON } from '../../utils/fetch';
import { findLastIndex } from 'lodash';

var UPDATE_ORDER_SERVICE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v2/orders/?/update_order_service_option_item';

var width = Dimensions.get('window').width - 20;
var height = Dimensions.get('window').height;

class ApprovalDetail extends Component {

    constructor(props) {
      super(props);
      var passProps = this.props.navigator._navigationContext._currentRoute.passProps;
      this.state = {
        id: passProps.category,
        orderId: passProps.orderId,
        name:passProps.name,
        partCost:passProps.partCost,
        fairLow:passProps.fairLow,
        fairHigh:passProps.fairHigh,
        comments:passProps.comments,
        time:passProps.time,
        timeInterval:passProps.timeInterval,
        intervalMile:passProps.intervalMile,
        intervalMonth:passProps.intervalMonth,
        position:passProps.position,
        desc:passProps.desc,
        partPrice:passProps.partPrice,
        whatIsIt:passProps.whatIsIt,
        whyDoThis:passProps.whyDoThis,
        whatIf:passProps.whatIf,
        factors:passProps.factors,
        laborLow:passProps.laborLow,
        laborHigh:passProps.laborHigh,
        partLow:passProps.partLow,
        partHigh:passProps.partHigh,
        parts:passProps.parts,
        partDetail:passProps.partDetail || [],
        partName:passProps.partName,
        fluidDetail:(passProps.fluidDetail || []).filter(fluid => fluid.literal_name == 'Engine Oil Fluid Type'),
        fluidType:passProps.fluidType,
        orderServiceOptions:passProps.orderServiceOptions || [],
        showSpinner: false,
        selectedOrderServiceOptionId: null,
        selectedPart: '',
        selectedQuantity: '',
        selectedPosition: '',
        selectedUnit: '',
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

    renderLabor()
    {
        if (this.state.laborLow) {
            return (
              <Text><Text>LABOR ESTIMATE:</Text><Text style={styles.textBold}>  ${this.state.laborLow.toFixed(0)}-${this.state.laborHigh.toFixed(0)}{"\n"}</Text></Text>
            );
        } else {
            return null;
        }
    }
    renderOil()
    {
        if (this.state.name == "Oil Change") {
            return (
              <View style={styles.oilContainer}>
                <Text style={styles.oilHd}>Recommended Oil:</Text>
                <View style={styles.oilType}><Text style={styles.oilTypeTxt}>{this.props.oilType}</Text></View>
              </View>
            );
        } else {
            return null;
        }
    }
    renderComments()
    {
        if (this.state.comments) {
            return (
              <View>
                <Text style={styles.textHdComments}>Shop Notes</Text>
                <View style={styles.commentContainer}>
                  <View style={styles.comment}><Text style={styles.commentTxt}>{this.state.comments}</Text></View>
                </View>
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

    renderTime()
    {
        if (this.state.intervalMonth != 0) {
            return (
                <Text style={styles.textBold}>{this.state.intervalMonth} MONTHS</Text>
            );
        } else {
            return null;
        }
    }
    renderOr()
    {
        if (this.state.intervalMonth != 0 && this.state.intervalMile != 0) {
            return (
                <Text> OR </Text>
            );
        } else {
            return null;
        }
    }
    renderMile()
    {
        if (this.state.intervalMile != 0) {
            return (
                <Text style={styles.textBold}>{this.state.intervalMile} MILES</Text>
            );
        } else {
            return null;
        }
    }
    renderMaintenance()
    {
        if (this.state.intervalMile != 0) {
            return (
              <View style={styles.maintenanceTime}>
                <View style={styles.maintenanceTimeTextContainer}><Text style={styles.maintenanceTimeText}>{this.renderLabor()}TIME ESTIMATE:  <Text style={styles.textBold}>{this.state.time} {this.state.timeInterval}</Text>{"\n"}RECOMMENDED EVERY {this.renderTime()}{this.renderOr()}{this.renderMile()}</Text></View>
              </View>
            );
        } else {
            return null;
        }
    }

    renderParts()
    {
        if (this.state.partDetail.length != 0) {
            return (
              <View style={styles.partList}>
                <View>
                  <Text style={styles.textHd}>Part Replacement Estimate</Text>
                  {this.state.partDetail.length ?
                    this.state.partDetail.map(this.createPartsRow) :
                    <View style={styles.noServicesBg}><View style={styles.noServicesContainer}><Text style={styles.noServices}>None</Text></View></View>}

                </View>
              </View>
            );
        } else {
            return null;
        }
    }

    renderFluids()
    {
        if (this.state.fluidDetail.length != 0) {
            return (
              <View style={styles.partList}>
                <View>
                  <Text style={styles.textHd}>Fluid Detail</Text>
                  {this.state.fluidDetail.length ?
                    this.state.fluidDetail.map(this.createFluidsRow) :
                    <View style={styles.noServicesBg}><View style={styles.noServicesContainer}><Text style={styles.noServices}>None</Text></View></View>}

                </View>
              </View>
            );
        } else {
            return null;
        }
    }

    renderOrderServiceOptions() {
      if (this.state.orderServiceOptions.length === 0)
        return null;

      return (
        <View>
          {this.state.orderServiceOptions.map(option => this.renderOrderServiceItem(option))}
          {this.state.selectedOrderServiceOptionId ?
            <TouchableOpacity style={styles.btnUpdate} onPress={() => this.updatePart()}>
              <Image style={styles.btnUpdateImage} source={require('../../../images/btn-update.png')} />
            </TouchableOpacity> : null
          }
        </View>
      );
    }

    renderOrderServiceItem(option) {
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
              value: this.state.selectedPart || `Select ${option.option_type == 0 ? 'Part' : 'Fluid'}`,
              onPress: () => {
                this.setState({
                  pickers: {
                    ...this.state.pickers,
                    part: option.order_service_option_items.map(a => ({ label: a.name, value: a.name, item: a }))
                  }
                })
              }
            })}
          </View>
          <View style={styles.partOptionsSelectOptions}>
            <View style={styles.partOptionsSelectQuantity}>
              <View style={styles.partOptionsSelectLabel}>
                <Text style={styles.partOptionsSelectLabelText}>Quantity: </Text>
              </View>
              {this.renderPickerToggle({
                key: 'quantity',
                value: this.state.selectedQuantity || '1'
              })}
            </View>
            { (option.positions || []).length > 0 ?
              <View style={styles.partOptionsSelectPosition}>
                <View style={styles.partOptionsSelectLabel}>
                  <Text style={styles.partOptionsSelectLabelText}>Position: </Text>
                </View>
                {this.renderPickerToggle({
                  key: 'position',
                  value: this.state.selectedPosition,
                  onPress: () => {
                    this.setState({
                      pickers: {
                        ...this.state.pickers,
                        position: option.positions.map(label => ({ label, value: label }))
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
                  value: this.state.selectedUnit,
                  onPress: () => {
                    this.setState({
                      pickers: {
                        ...this.state.pickers,
                        unit: option.units.map(label => ({ label, value: label }))
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
                  key={item.item ? item.item.id : item.value}
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

    render() {
      if (this.state.showSpinner)
        return <View><Spinner visible={true} /></View>;

      var totalLow = this.state.fairLow;
      var totalHigh = this.state.fairHigh;
      return (
        <View style={styles.base}>
          <TopBar navigator={this.props.navigator} />
          <CarBar />
          <View style={styles.maintenanceContainer}>

            <ScrollView style={styles.scrollView}>
            <Text style={styles.textHd}>Service Detail</Text>

            <View style={styles.maintenanceList}>
              <View>
                <View style={styles.maintenanceRow}>
                  <Text style={styles.maintenanceItem}>{this.state.name} {this.state.position}</Text>
                  { totalLow || totalHigh ? (
                    <View style={styles.fairPriceContainer}>
                      <Text style={styles.fairPriceText}>FAIR PRICE</Text>
                      <View style={styles.fairPriceRange}>
                        <Text style={styles.fairPrice}>${totalLow.toFixed(0)}</Text>
                        <Image
                          source={require('../../../images/arrow-range.png')}
                          style={styles.fairPriceArrow} />
                        <Text style={styles.fairPrice}>${totalHigh.toFixed(0)}</Text>
                      </View>
                    </View>
                  ) : null }
                </View>
                {this.renderMaintenance()}
              </View>

              {this.renderOil()}
              {this.renderOrderServiceOptions()}
              {this.renderComments()}
              {this.renderParts()}
              {this.renderFluids()}
              {this.renderWhat()}
              {this.renderWhy()}
              {this.renderWhatIf()}
              {this.renderFactors()}

            </View>

            </ScrollView>

          </View>

          {this.renderPicker({
            key: 'part',
            items: this.state.pickers.part,
            onChange: a => this.setState({
              selectedOrderServiceOptionId: a.item.id,
              selectedPart: a.value,
              selectedQuantity: a.item.quantity,
              selectedPosition: a.item.position,
              selectedUnit: a.item.unit
            })
          })}

          {this.renderPicker({
            key: 'quantity',
            items: this.state.pickers.quantity,
            onChange: a => this.setState({ selectedQuantity: a.value })
          })}

          {this.renderPicker({
            key: 'position',
            items: this.state.pickers.position,
            onChange: a => this.setState({ selectedPosition: a.value })
          })}

          {this.renderPicker({
            key: 'unit',
            items: this.state.pickers.unit,
            onChange: a => this.setState({ selectedQuantity: a.value })
          })}

        </View>
      );
    }

    async updatePart() {
      if (!this.props.isLoggedIn)
        return;

      this.setState({ showSpinner: true });

      let response = await putJSON(
        UPDATE_ORDER_SERVICE_URL.replace('?', this.state.orderId),
        {
          order_service_option_item_id: this.state.selectedOrderServiceOptionId,
          quantity: this.state.selectedQuantity,
          position: this.state.selectedPosition || undefined,
          unit_name: this.state.selectedUnit || undefined,
          selected: true
        },
        { 'Authorization': this.props.authentication_token }
      );

      this.setState({ showSpinner: false });

      if (response.error) {
        Alert.alert('Error', response.error)
      } else {
        let routes = this.props.navigator.getCurrentRoutes();
        let index = findLastIndex(routes, { indent: 'Approvals' });
        let newRoute = { indent: 'Approvals' };
        this.props.navigator.replaceAtIndex(newRoute, index);
        this.props.navigator.popToRoute(newRoute);
      }
    }

    createPartsRow = (part, i) => <Part key={i} part={part} partDetail={this.state.partDetail} laborLow={this.state.laborLow} laborHigh={this.state.laborHigh} partLow={this.state.partLow} partHigh={this.state.partHigh} fairLow={this.state.fairLow} fairHigh={this.state.fairHigh}/>;
    createFluidsRow = (fluid, i) => <Fluid key={i} fluid={fluid} fluidDetail={this.state.fluidDetail} fluidType={this.state.fluidType} />;
}

var Part = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },

  render: function() {
      return(
        <View style={styles.partRow}>
          <Text style={styles.partItem}>{this.props.part.name} {this.props.part.qualifier_name}</Text>
          { this.props.partLow || this.props.partHigh ? (
            <View style={styles.fairPriceContainer}>
              <Text style={styles.fairPriceText}>FAIR PRICE</Text>
              <View style={styles.fairPriceRange}>
                <Text style={styles.fairPrice}>${this.props.partLow.toFixed(0)}</Text>
                <Image
                  source={require('../../../images/arrow-range.png')}
                  style={styles.fairPriceArrow} />
                <Text style={styles.fairPrice}>${this.props.partHigh.toFixed(0)}</Text>
              </View>
            </View>
          ) : null }
        </View>
      );
  }
});

var Fluid = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },

  render: function() {
      return(
        <View style={styles.partRow}>
          <View style={styles.fluidContainerLeft}>
            <Text style={styles.fairPriceText}>{this.props.fluid.literal_name}</Text>
            <View style={styles.fairPriceRange}>
              <Text style={styles.fluidViscosityTxt}>{this.props.fluid.fluid_type_name}</Text>
            </View>
          </View>
          { this.props.fluid.viscosity ? (
          <View style={styles.fluidContainerRight}>
            <Text style={styles.fairPriceText}>Viscosity</Text>
            <View style={styles.fairPriceRange}>
              <Text style={styles.fluidViscosityTxt}>{this.props.fluid.viscosity}</Text>
            </View>
          </View>
          ) : null }
        </View>
      );
  }
});

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  maintenanceContainer: {
    flex: 1,
    alignItems: 'center',
  },
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#002d5e',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center',
  },
  textHdComments: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#f8991d',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light',
    textAlign: 'center',
  },
  maintenanceList: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    alignItems: 'center',
    marginBottom: 50,
  },
  maintenanceRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintenanceItem: {
    flex: 2,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#002d5e',
    alignItems: 'center',
  },
  commentContainer: {
    width: width,
    backgroundColor: '#f8991d',
  },
  comment: {
    margin: 2,
    backgroundColor: '#FFF',
  },
  commentTxt: {
    backgroundColor: '#FFF',
    margin: 10,
    color: '#002d5e',
    fontSize: 12,
  },
  maintenanceTime: {
    width: width,
    backgroundColor: '#EFEFEF',
  },
  maintenanceTimeTextContainer: {
    margin: 5,
    backgroundColor: '#FFF',
  },
  maintenanceTimeText: {
    backgroundColor: '#FFF',
    margin: 10,
    textAlign: 'center',
    color: '#002d5e',
    fontSize: 12,
  },
  maintenanceReco: {
    width: width,
    backgroundColor: '#EFEFEF',
  },
  maintenanceRecoText: {
    backgroundColor: '#FFF',
    margin: 5,
    padding: 10,
    textAlign: 'center',
    color: '#002d5e',
    fontSize: 12,
  },
  maintenanceDesc: {
    width: width,
    backgroundColor: '#EFEFEF',
  },
  maintenanceDescText: {
    backgroundColor: '#FFF',
    margin: 5,
    padding: 10,
    color: '#002d5e',
    fontSize: 12,
  },
  maintenancePrice: {
    flex: 1,
    textAlign: 'right',
    color: '#002d5e',
  },
  partList: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
  partRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partItem: {
    flex: 2,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#002d5e',
    alignItems: 'center',
  },
  partPrice: {
    flex: 1,
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    color: '#002d5e',
    textAlign: 'right',
  },
  priceContainer: {
    flex: 1,
    marginTop: 15,
    marginRight: 10,
  },
  priceHd: {
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  price: {
    textAlign: 'right',
    color: '#002d5e',
    fontWeight: 'bold',
  },
  total: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#002d5e',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 20,
  },
  totalText: {
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002d5e',
  },
  totalPrice: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  fairPriceContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
    alignItems: 'center',
  },
  fairPriceRange: {
    flexDirection: 'row',
  },
  fairPriceText: {
    color: '#f8991d',
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
    fontSize: 14,
    color: '#002d5e',
    fontWeight: 'bold',
  },
  fluidContainerLeft: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 3
  },
  fluidContainerRight: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 10,
    alignItems: 'flex-end'
  },
  fluidViscosity: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3
  },
  fluidViscosityTxt: {
    color: '#002d5e',
    fontWeight: 'bold',
    textAlign: 'right'
  },
  rowAddService: {
    alignItems: 'center',
  },
  btnAddService: {
    width: 110,
    height: 10,
    marginBottom: 20,
  },
  bookIt: {
    alignItems: 'center',
  },
  btnCheckout: {
    width: 300,
    height: 40,
  },
  textBold: {
    fontWeight: 'bold',
  },
  oilContainer: {
    width: width,
    backgroundColor: '#fff',
    marginTop: 5,
    padding: 10,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0099ff'
  },
  oilHd: {
    color: '#0099ff',
    fontSize: 12
  },
  oilTypeTxt: {
    color: '#0099ff',
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
  noServicesBg: {
    backgroundColor: '#F4F4F4',
    width: width,
  },
  noServicesContainer: {
    margin: 10,
  },
  noServices: {
    color: '#002d5e',
    width: width,
    textAlign: 'center',
  },
  partOptionsContainer: {
    width,
    marginTop: 5,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  partOptionsHeader: {
    backgroundColor: '#0099FF',
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
    padding: 5
  },
  partOptionsSelectQuantity: {
    flex: 1,
    flexDirection: 'row'
  },
  partOptionsSelectPosition: {
    flex: 1,
    flexDirection: 'row'
  },
  partOptionsSelectUnit: {
    flex: 1,
    flexDirection: 'row'
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
  btnUpdate: {
    width
  },
  btnUpdateImage: {
    width,
    resizeMode: 'contain'
  }
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token,
    vehicleId : user.vehicles[0].id,
    miles : user.vehicles[0].miles,
    oilType : user.vehicles[0].oil_type_name,
  };
}

module.exports = connect(mapStateToProps)(ApprovalDetail);
