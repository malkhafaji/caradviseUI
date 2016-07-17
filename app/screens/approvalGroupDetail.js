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
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { putJSON } from '../utils/fetch';

var width = Dimensions.get('window').width - 20;

var UPDATE_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/orders/update_order_service';

class ApprovalGroupDetail extends Component {
  constructor(props) {
    super(props);
    var passProps = props.navigator._navigationContext._currentRoute.passProps || {};
    this.state = {
      services: passProps.services || [],
      showSpinner: false
    };
  }

  render() {
    let {status} = this.state.services[0] || {};
    let title, empty;

    if (status == 0) {
      title = 'Services To Approve';
      empty = 'No services to approve';
    } else if (status == 2 || status == 5) {
      title = 'Approved Services';
      empty = 'No approved services';
    }

    return (
      <View style={styles.base}>
        <Spinner visible={this.state.showSpinner} />
        <TopBar navigator={this.props.navigator} />
        <CarBar />
        <ScrollView style={styles.scrollView}>
          <View style={styles.approvalsContainer}>
            <Text style={styles.textHd}>{title}</Text>
            <View style={styles.newServicesList}>
              {this.state.services.length ?
                this.state.services.map(this.createServiceRow) :
                <View style={styles.noServicesBg}><View style={styles.noServicesContainer}><Text style={styles.noServices}>{empty}</Text></View></View>}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  async updateServiceStatus(service, status) {
    if (!this.props.isLoggedIn || !this.props.authentication_token)
      return;

    this.setState({ showSpinner: true });

    let response = await putJSON(
      UPDATE_URL,
      { order_service_id: service.id, status },
      { 'Authorization': this.props.authentication_token }
    );

    this.setState({ showSpinner: false });

    if (response.error) {
      Alert.alert('Error', response.error)
    } else {
      let services = [...this.state.services];
      services.splice(services.indexOf(service), 1);
      this.setState({ services });
    }

    this.props.navigator.replacePrevious({ indent: 'Approvals' });
  }

  createServiceRow = service => <Service key={service.id} service={service} nav={this.props.navigator} updateServiceStatus={this.updateServiceStatus.bind(this)}/>;
}

var Service = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },

  openDetail: function() {
    this.props.nav.push({
      indent:'ApprovalDetail',
      passProps:{
        category:this.props.service.id,
        miles:this.props.miles,
        name:this.props.service.serviceName,
        desc:this.props.service.motor_vehicle_service.required_skills_description,
        time:this.props.service.motor_vehicle_service.base_labor_time,
        timeInterval:this.props.service.motor_vehicle_service.labor_time_interval,
        intervalMile:this.props.service.motor_vehicle_service.interval_mile,
        intervalMonth:this.props.service.motor_vehicle_service.interval_month,
        position:this.props.service.motor_vehicle_service.position,
        whatIsIt:this.props.service.motor_vehicle_service.what_is_it,
        whatIf:this.props.service.motor_vehicle_service.what_if_decline,
        whyDoThis:this.props.service.motor_vehicle_service.why_do_this,
        factors:this.props.service.motor_vehicle_service.factors_to_consider,
        fairLow:this.props.service.motor_vehicle_service.low_fair_cost,
        fairHigh:this.props.service.motor_vehicle_service.high_fair_cost,
        parts:this.props.service.motor_vehicle_service,
        partDetail:this.props.service.motor_vehicle_service.motor_vehicle_service_parts,
      }
    });
  },

  render: function() {
    var totalLow = this.props.service.motor_vehicle_service.low_fair_cost;
    var totalHigh = this.props.service.motor_vehicle_service.high_fair_cost;

    if (this.props.service.status == 0) {
      return (
        <View>
          <TouchableOpacity
            style={styles.newServicesRow}
            onPress={() => this.openDetail()}>
            <Text style={styles.newServiceItem}>{this.props.service.serviceName}</Text>
            <View style={styles.fairPriceContainer}>
              <Text style={styles.fairPriceText}>FAIR PRICE</Text>
              <View style={styles.fairPriceRange}>
                <Text style={styles.fairPrice}>${totalLow.toFixed(0)}</Text>
                <Image
                  source={require('../../images/arrow-range.png')}
                  style={styles.fairPriceArrow} />
                <Text style={styles.fairPrice}>${totalHigh.toFixed(0)}</Text>
              </View>
            </View>
            <View style={styles.newServicePriceContainer}>
              <Text style={styles.newServicePriceHd}>PRICE</Text>
              <Text style={styles.newServicePrice}>${Number(this.props.service.totalCost).toFixed(2)}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnLeft}
              underlayColor='#dddddd'
              onPress={() => { this.props.updateServiceStatus(this.props.service, 3) }}>
              <Image
                source={require('../../images/btn-save.png')}
                style={styles.btnSave} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnRight}
              underlayColor='#dddddd'
              onPress={() => { this.props.updateServiceStatus(this.props.service, 2) }}>
              <Image
                source={require('../../images/btn-approve-orange.png')}
                style={styles.btnApprove} />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (this.props.service.status == 2 || this.props.service.status == 5) {
      return (
        <TouchableOpacity
          style={styles.approvedRow}
          onPress={() => this.openDetail()}>
          <Text style={styles.approvedItem}>{this.props.service.serviceName}</Text>
          <Text style={styles.approvedPrice}>${Number(this.props.service.totalCost).toFixed(2)}</Text>
        </TouchableOpacity>
      );
    }

  }
});

var styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10
  },
  approvalsContainer: {
    alignItems: 'center',
    marginBottom: 5
  },
  textHd: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#006699',
    fontWeight: 'bold',
    fontFamily: 'RobotoCondensed-Light'
  },
  noServicesBg: {
    backgroundColor: '#F4F4F4',
    marginBottom: 2,
  },
  noServicesContainer: {
    margin: 10,
  },
  noServices: {
    color: '#006699',
    width: width,
    textAlign: 'center',
  },
  newServicesList: {
    flexDirection: 'column',
    width: width,
    alignItems: 'center',
  },
  newServicesRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
  },
  newServiceItem: {
    flex: 5,
    marginTop: 17,
    marginBottom: 15,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#006699',
    alignItems: 'center',
  },
  fairPriceContainer: {
    flex: 3,
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
    color: '#FF9900',
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
    color: '#006699',
    fontWeight: 'bold',
  },
  newServicePriceContainer: {
    flex: 2,
    marginTop: 10,
    marginRight: 10,
  },
  newServicePrice: {
    textAlign: 'right',
    color: '#006699',
    fontWeight: 'bold',
  },
  newServicePriceHd: {
    fontSize: 12,
    color: '#006699',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  btnRow: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    backgroundColor: '#EFEFEF',
    paddingBottom: 10,
    marginBottom: 5,
  },
  btnLeft: {
    flex: 2,
    alignItems: 'center',
  },
  btnRight: {
    flex: 2,
    alignItems: 'center',
  },
  btnApprove: {
    width: 145,
    height: 29,
  },
  btnSave: {
    width: 145,
    height: 29,
  },
  approvedRow: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    width: width,
    padding: 10,
    marginBottom: 2,
  },
  approvedItem: {
    flex: 3,
    color: '#006699',
    fontWeight: 'bold',
  },
  approvedPrice: {
    flex: 1,
    textAlign: 'right',
    color: '#006699',
    fontWeight: 'bold',
  }
});

function mapStateToProps(state) {
  let user = state.user || {};
  return {
    isLoggedIn: !!user.authentication_token,
    authentication_token: user.authentication_token
  };
}

module.exports = connect(mapStateToProps)(ApprovalGroupDetail);
