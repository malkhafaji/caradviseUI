'use strict';
var TopBar = require('../components/main/topBar');

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
} from 'react-native';

var width = Dimensions.get('window').width - 20;

class Privacy extends Component {

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />

            <ScrollView
              style={styles.scrollView}>
            <View style={styles.container}>

              <Text style={styles.textHd}>Privacy Policy</Text>
              <View style={styles.privacyTxt}>
              <Text>This Privacy Policy applies to all CarAdvise, LLC (“we,” “our” or “CarAdvise”) website(s), all online and offline services and all of our mobile sites and mobile applications (together with any other services or products offered by CarAdvise, the “Services”).
{'\n'}{'\n'}
This Privacy Policy (this “Policy”) describes how CarAdvise treats and uses personal information through the Services. This Privacy Policy is hereby incorporated into the CarAdvise Terms of Use, available at: [ ] (the “Terms”).
{'\n'}{'\n'}
Any use of the Services is entirely voluntary. No individual is ever required to register for a CarAdvise account or to use the Services.
{'\n'}{'\n'}
We collect information from and about you.
{'\n'}{'\n'}
To use the Services, you must register for CarAdvise, which requires you to provide an e-mail address. This is the minimum amount of personally identifiable information required to use the Services.
{'\n'}{'\n'}
You may voluntarily choose to provide additional information to us to enable CarAdvise to provide particular Services. Should you do so, the information may be shared with third parties from time to time, as set forth in this Policy.
{'\n'}{'\n'}
Information we may collect about may include, without limitation, the following (together with any other information collected from you by CarAdvise, the “Information”):
{'\n'}{'\n'}
* Contact information, such as your name, street address, city, state, zip code, phone number, fax number, and email address;
{'\n'}{'\n'}
* Vehicle information, such as the VIN, mileage, location (via GPS technology) and driving behavior of your vehicle;
{'\n'}{'\n'}
* Repair and maintenance services information, such as information regarding how your vehicle is repaired or maintained, including work recommended for your vehicle (whether completed or not);
{'\n'}{'\n'}
* Payment information, if you make a payment through our website;
{'\n'}{'\n'}
* Information submitted by you to book an appointment or make a customer service request from one of the vehicle repair/maintenance shops (each, a “Maintenance Partner”) listed on our website;
{'\n'}{'\n'}
* Demographic information, such as your gender, age, place of residence or professional information; and
{'\n'}{'\n'}
* Other information, such as information about the browser you’re using and your IP address, the website you were to us from or the website you visit after you leave our website.
{'\n'}{'\n'}
How we collect information.
{'\n'}{'\n'}
We may collect Information from you in the following ways, without limitation:
{'\n'}{'\n'}
* Directly from you: For example, if you approve repair/maintenance services with a Maintenance Partner through CarAdvise, or if you contact us online or offline.
{'\n'}{'\n'}
* Passively from you: CarAdvise, or third parties on our site, may use tracking tools such as browser cookies, GPS technology and web beacons to collect Information from you.
{'\n'}{'\n'}
* Indirectly from third parties: For example, our third party-business partners may give us
{'\n'}{'\n'}
information about you. We may combine this Information with Information you give us, such as, for example, if a Maintenance Partner notifies us of \the date and time of any appointments you book though CarAdvise.
{'\n'}{'\n'}
How we use your Information.
{'\n'}{'\n'}
CarAdvise uses the Information in a variety of ways. We may use the Information to respond to your requests or questions, to notify you if you reserve repair services with a Maintenance Partner through our Services or to contact you about your account.
{'\n'}{'\n'}
We may use your Information to improve our Services, including our websites, mobile apps, and products. We might use your Information to customize your experience with us.
{'\n'}{'\n'}
We may use Information for marketing purposes. For example, CarAdvise might send you information about new products/services and special promotions. We might tell you about new features or updates to the Services.
{'\n'}{'\n'}
We use Information to communicate with you about your account or our relationship. We may contact you about your order or feedback. We might also contact you about this Policy or our Terms.
{'\n'}{'\n'}
We may share Information with third parties.
{'\n'}{'\n'}
We may share Information with third parties, such as Maintenance Partners, CarAdvise affiliates or other third parties who perform services on our behalf or with whom we work with to provide the Services to you.
{'\n'}{'\n'}
We will also share Information in order to comply with the law, regulatory provisions, or as we otherwise see fit to protect ourselves, our users. We may also disclose your Information to third parties when we have a reason to believe that a disclosure is necessary to address potential or actual injury or interference with our rights, property, operations, other users or others who may be harmed or may suffer loss or damage, or if we believe that such disclosure is necessary to protect our rights, combat fraud and/or comply with a judicial proceeding, court order, or legal process served on CarAdvise.
{'\n'}{'\n'}
We may share Information with any successor to all, or part of, our business(es), or for for other reasons that we may describe to you.
{'\n'}{'\n'}
You have certain choices about our marketing and tracking tools.
{'\n'}{'\n'}
You can opt out of receiving certain of our commercial email messages. From time to time, CarAdvise may send email messages that it believes to be relevant and beneficial to CarAdvise users, such as promotional messages or advertisements. To stop receiving our commercial email messages, simply send us an email at support@CarAdvise.com with the subject “Unsubscribe;” write to us at the below address (include your email address); or use the unsubscribe function in any promotional message you get from us.
{'\n'}{'\n'}
Even if you opt out of getting our commercial messages, we will still send you transactional or relationship e-mail messages. These include responses to your questions, order confirmations, and other important notices about your account and/or Services you have booked through CarAdvise.
{'\n'}{'\n'}
You can control cookies and tracking tools.
{'\n'}{'\n'}
Your browser may give you the ability to control cookies. How you do so depends on the type of cookie. Certain browsers can be set to reject browser cookies. If you block cookies on your browser, certain of the Services, including certain features on our websites or mobile applications, may not work.
{'\n'}{'\n'}
“Do Not Track.”
{'\n'}{'\n'}
Some browsers have a “Do Not Track” feature that lets you tell websites that you do not want to have your online activities tracked. CarAdivse is not currently set up to respond to Do Not Track signals.
{'\n'}{'\n'}
Your California privacy rights.
{'\n'}{'\n'}
If you reside in California, you have the right to ask us one time each year whether we have shared personal Information with third parties for their direct marketing purposes. To make a request, please send us an email, or write to us at the address listed below, indicating in your letter that you are a California resident making a “Shine the Light” inquiry.
{'\n'}{'\n'}
CarAdvise, the Services and children.
{'\n'}{'\n'}
Our site is meant for adults. We do not knowingly collect or retain personally identifiable information from children under 13 without permission from a parent or guardian. If CarAdvise ever becomes aware that a child under 13 has provided us with personal information, we will promptly delete that information. If you are a parent or legal guardian and believe your child under 13 has given us information, you can email us. You can also write to us at the address listed at the end of this policy. Please mark your inquiries “COPPA Information Request.”
{'\n'}{'\n'}
We use industry standard security measures.
{'\n'}{'\n'}
CarAdvise follows generally accepted industry standards and maintains reasonable safeguards to attempt to ensure the security, integrity and privacy of our sites, the Services and the Information. While CarAdvise exercises reasonable care and due diligence in providing a secure conduit of information between your computer or other device and its servers, the Internet is not 100% secure. We cannot and do not promise that your use of our Services will be completely safe. Therefore, while CarAdvise will attempt to protect the transmission of any Information using methods that comply with the industry standards, CarAdvise does not accept liability for any unintentional disclosure of same. We encourage you to always use caution when using the Internet.
{'\n'}{'\n'}
We keep Information as long as it may be necessary or relevant to do so for the practices described in this Policy. We also keep Information as otherwise required by law.
{'\n'}{'\n'}
We store Information in the United States.
{'\n'}{'\n'}
Information we maintain will be stored within the United States. If you live outside of the United States, you understand and agree that we may transfer your Information to the United States.
{'\n'}{'\n'}
We may link to other sites or have third party services on our site we don’t control.
{'\n'}{'\n'}
The Services may incorporate links to third party websites or other applications. We do not control any third party websites or other applications. This Policy does not apply to the privacy practices of any third party websites or other applications. You should always read the privacy policy and terms of use of any third party website or application carefully. CarAdvise is not liable for any such third party terms and conditions and their use of your Information, and if you use a third party website or service, you do so at your own risk.
{'\n'}{'\n'}
Information applicable to Maintenance Partners
{'\n'}{'\n'}
In addition to the foregoing, we may collect and use Information differently or in addition to what
{'\n'}{'\n'}
is set forth above for our Maintenance Partners. We may collect Information about your professional credentials, including mechanical credentials, years in the trade, certifications received.
{'\n'}{'\n'}
Feel free to contact us if you have more questions.
{'\n'}{'\n'}
If you have any questions about this Policy or other privacy concerns, please email us at support@CarAdvise.com.
{'\n'}{'\n'}
You can also write to us or call at:
{'\n'}{'\n'}
CarAdvise, LLC
{'\n'}{'\n'}
Customer Privacy
{'\n'}
111 W Illinois
{'\n'}
Chicago, IL 60654
{'\n'}{'\n'}
Phone:
{'\n'}{'\n'}
844-9-ADVISE
{'\n'}{'\n'}
We may update this Policy.
{'\n'}{'\n'}
From time to time we may change this Policy. We reserve the right, at our and without prior notice, to change, modify, amend, add, subtract, or otherwise remove portions of this Policy at any time and for any or no reason. We may notify you of any material changes to our Policy, or as otherwise required by law. We will also post an updated Policy on our website. Please check our site periodically for updates. By using the Services, you consent, acknowledge and agree to our Policy, as it may be amended from time to time.

              </Text>
              </View>
            </View>
            </ScrollView>
          </View>
        );
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
  container: {
    alignItems: 'center',
    marginBottom: 200,
  },
  textHd: {
    fontSize: 17,
    marginTop: 15,
    marginBottom: 8,
    color: '#666666',
  },
  privacyTxt: {
    flexDirection: 'column',
    width: width,
  },
});

module.exports = Privacy;
