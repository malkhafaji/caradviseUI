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

class Terms extends Component {

    render() {
        return (
          <View style={styles.base}>
            <TopBar navigator={this.props.navigator} />

            <ScrollView
              style={styles.scrollView}>
            <View style={styles.container}>

              <Text style={styles.textHd}>Terms of Use</Text>
              <View style={styles.privacyTxt}>
              <Text>{'\n'}Effective Date: June 12, 2016
{'\n'}{'\n'}
Welcome to the products and services ("Services") provided by CarAdvise, LLC, a Delaware limited liability company ("we," "us," "our," or "CarAdvise"). Our Services include, without limitation, the CarAdvise website, located at CarAdvise.com (the "Website"), our mobile applications (together, the "App") and any and all services offered on the Website, through the App and/or by CarAdvise. By accessing or using our Services, you are agreeing to these Terms of Use, so please read them carefully. If you have any questions, comments or concerns regarding these Terms of Use or our Services, please contact us at support@CarAdvise.com.
{'\n'}{'\n'}</Text>
<Text>APPLICATION; MODIFICATIONS AND AMENDMENTS
{'\n'}{'\n'}
In addition to any other terms and conditions which may apply to certain of the Services, these Terms of Use contain the terms and conditions that apply to all of our Services. CarAdvise reserves the right to modify or amend these Terms of Use at any time and without notice to you, and any continued use by you of the Services constitutes acceptance with any amended Terms of Use. Updates will be posted on the Website, and changes will be effective immediately upon their posting. Online modifications and amendments supersede any printed version/copy of these Terms of Use.
{'\n'}{'\n'}</Text>
<Text>PRIVACY POLICY
{'\n'}{'\n'}
By accessing and using the Services, you agree to our Privacy Policy, available at: .com, which are incorporated into these Terms of Use by reference (the "Privacy Policy").

Please note that the Services are not directed at children under 13. We do not knowingly collect or solicit personally identifiable information from children under 13. If you are a child under 13, please do not attempt to register for the Services or send any personal information about yourself to us. If we learn we have collected personal information from a child under 13, we will delete that information as quickly as possible. If you believe that a child under 13 may have provided us personal information, please contact us at support@CarAdvise.com.
{'\n'}{'\n'}</Text>
<Text>THE SERVICES
{'\n'}{'\n'}
The Services assist users in procuring maintenance and repair services for their vehicles by connecting such users with vehicle maintenance providers ("Maintenance Providers") through the Website and the App. CarAdvise may provide recommendations, guidance, reviews and/or scheduling services related to vehicles and Maintenance Providers. CarAdvise may collect and process fees for transactions between a user and a Maintenance Provider, but CarAdvise is not a party to the actual repair transaction between users and Maintenance Providers that originates on or through the Website, the App or the Services.

To be clear, CarAdvise does not: (i) negotiate pricing or other terms between users and Maintenance Providers; or (ii) provide vehicle repair or maintenance services.
{'\n'}{'\n'}</Text>
<Text>VEHICLE CONTENT
{'\n'}{'\n'}
CarAdvise may collect and provide information, advice, recommendations or guidance about a particular vehicle or a Maintenance Provider ("Vehicle Content") on the Website, through the App or otherwise through the Services, but CarAdvise gives no assurance that any Vehicle Content is accurate, complete or verified. CarAdvise does not warrant the accuracy of, or assume (and you agree that CarAdvise does not bear any) responsibility for any errors or omissions in the Vehicle Content. CarAdvise has no responsibility to update or review any Vehicle Content.
{'\n'}{'\n'}
You understand that CarAdvise owns the Vehicle Content. Any and all Vehicle Content collected through the Website, the App, the Services or by CarAdvise through any other means is the property of CarAdvise, and CarAdvise has the right to use or re-use such Vehicle Content. You won&#39;t modify, publish, transmit, participate in the transfer or sale of, reproduce (except as expressly provided in the Terms of Use), create derivative works based on or otherwise exploit any of the Vehicle Content.
{'\n'}{'\n'}</Text>
<Text>USE OF THE SERVICES
{'\n'}{'\n'}
You must follow all applicable laws when using the Services. If applicable law prohibits you from using any or all of the Services, then you aren&#39;t authorized to use such Services. We can&#39;t and won&#39;t be responsible for your using the Services in any way not in accordance with applicable laws. The Services are provided by a U.S. company.
{'\n'}{'\n'}
Without limitation of the foregoing, when using the Services, you must not:
{'\n'}{'\n'}
* Use the Services outside of any interfaces we have provided or remove or alter notices or logos provided with the Services;
{'\n'}{'\n'}
* Engage in any unsolicited advertising, marketing or other activities, including, without limitation, any activities that violate anti-spam laws and regulations including, but not limited to, the CAN SPAM Act of 2003, the Telephone Consumer Protection Act and the Do-Not-Call Implementation Act;
{'\n'}{'\n'}
* Use extreme bandwidth capacity in a way that threatens our infrastructure;
{'\n'}{'\n'}
* Upload viruses or malware or attempt to overload the system with email or traffic;
{'\n'}{'\n'}
* Promote commercial services, unless you are specifically authorized by CarAdvise to do so;
{'\n'}{'\n'}
* Infringe or violate the intellectual property rights, privacy rights or any other rights of anyone else (including CarAdvise);
{'\n'}{'\n'}
* Violate any applicable law or regulation;
{'\n'}{'\n'}
* Post or upload any content that, in CarAdvise&#39;s sole discretion, is likely to expose CarAdvise to civil or criminal liability;
{'\n'}{'\n'}
* Jeopardize the security of your User Account (as defined below) or the User Account of any other user (such as allowing someone else access to your User Account);
{'\n'}{'\n'}
* Attempt, in any manner, to obtain the password, account, or other security information from any other user of the Services;
{'\n'}{'\n'}
* Compromise the security of the Website, App or any of CarAdvise&#39;s other computer systems or networks, or the security of any CarAdvise users or partners
{'\n'}{'\n'}
* "Crawl," "scrape," or "spider" any page, data, or portion of or relating to the Website, App, Services, or any content available through the Services (through use of manual or automated means);
{'\n'}{'\n'}
* Decompile, reverse engineer, or otherwise attempt to obtain the source code or underlying ideas or information of or relating to the Webiste, App or Services; or
{'\n'}{'\n'}
* Use any of the Services beyond their intended use.
{'\n'}{'\n'}
Information and content displayed on the Website or the App, or otherwise provided through the Services, may change without notice. We reserve the right to modify such information and content without any obligation to notify past or current users. We make no representations that the information or content are appropriate or available for use or access in any particular state or country besides the United States. When accessing the Services, you are solely responsible for compliance with the laws of the state or country in which you live.
{'\n'}{'\n'}
All offers made pursuant to the Services are void where prohibited. Some Services may not be available in certain areas.
{'\n'}{'\n'}</Text>
<Text>COOKIES
{'\n'}{'\n'}
We may also collect cookies, which are small pieces of information sent to your browser by a website that you visit. We may use cookies to compile and provide aggregate statistics about the Website's and the App's visitors, traffic patterns, and related information to third parties, but such information will not identify you personally. Cookies may help us adjust the content and user experience on the Website and the App, and to otherwise improve the Services. You may set your browser to refuse cookies from any website that you visit. If you refuse cookies, you may not be able to access certain portions of the Services.
{'\n'}{'\n'}</Text>
<Text>USER ACCOUNTS
{'\n'}{'\n'}
You may create an account ("User Account") in order to use various portions of the Services, such as the App and parts of the Website. You may register using your social media accounts (such as Facebook, Twitter, Instagram, Google+ or Yahoo), or by providing us with your name, mailing address, email address and a password of your choosing.
{'\n'}{'\n'}
Your User Account is personal to you. You promise to provide us with accurate, complete and updated registration information about yourself. You may not select as your username a name that you don't have the right to use, or use another person's information with the intent to impersonate such person. You may not transfer your User Account to anyone else without our prior written permission. You may not share your User Account information with or allow access to your User Account by any third party. You are solely responsible for all activity that occurs on or under your User Account. As a result, you should keep your username, password and other User Account information confidential. We will not be liable for any costs, losses, claims or damages that you or any third party incur which are directly or indirectly caused by any unauthorized use of your User Account. You agree to immediately notify us at support@CarAdvise.com if at any time you have any reason to believe that your User Account has been compromised.
{'\n'}{'\n'}
You understand that CarAdvise owns data appearing on or derived from your creation and use of your user account ("User Data"). Any and all User Data collected through the Website, the App, the Services or by CarAdvise through any other means is the property of CarAdvise, and CarAdvise has the right to use or re-use such User Data.
{'\n'}{'\n'}
As a general matter, by utilizing the Services, you grant CarAdvise permission to communicate with you as CarAdvise deems necessary via, as applicable, email, text message and/or alert via the App. Such communications may be regarding your account, the Services or other information from the Website or about CarAdvise. Such communications may be promotional in nature. You may opt-out of certain of these communications. Please note that opting out of certain communications may limit your ability to use the Services, and that, if you chose to use the Services, there are certain communications you may not be able to opt out of at all.
{'\n'}{'\n'}
CarAdvise will not knowingly send you any communications containing any false, misrepresented, inaccurate, forged, obscured or misleading information.
{'\n'}{'\n'}
You can close your user account at any time through the Website or the App. However, you will still be responsible for any fees you have incurred for Services. CarAdvise retains ownership of all User Data after you close your account, and reserves the right use such User Data for any future purposes.
{'\n'}{'\n'}</Text>
<Text>RIGHT TO DENY ACCESS OR SUSPEND OR TERMINATE ACCOUNT
{'\n'}{'\n'}
We reserve the right to deny use of, or access to, the Services to you for any or no reason. We have the right to suspend or terminate your User Account and your access to the Services at any time and for any reason, including, without limitation, failure to maintain an updated User Account, unauthorized use, suspicion of fraud or abuse or for your violation of our Terms of Use or other posted policies. If you are suspended or terminated, CarAdvise may, at its sole discretion, prohibit you from accessing the Services at all times in the future. You agree that CarAdvise shall not be liable to you or to any third party for, without limitation, any denial of Services, change of costs for Maintenance Provider services or otherwise, or from suspension or termination of your User Account.
{'\n'}{'\n'}</Text>
<Text>FEES AND PAYMENTS
{'\n'}{'\n'}
If you chose to access certain of the Services, CarAdvise may collect, process and remit the fees for such Services to third parties (such as, without limitation, Maintenance Providers) through the Website or App. You are responsible for all charges, fees, duties, taxes, and assessments arising out of any such Services. You agree to pay to CarAdvise all fees for Services in accordance with the pricing and payment terms approved or accepted by you through the Website or App. Where applicable, you will be billed using the billing method you select through your User Account management page. Except as provided in these Terms of Use or when required by law, all fees paid by you are non-refundable. CarAdvise may change the fees for any Services at any time.
{'\n'}{'\n'}
CarAdvise may charge a per-transaction fee for your use of the Services (the "Transaction Fee"). The Transaction Fee shall be agreed upon between CarAdvise and you at the time upon which
{'\n'}{'\n'}
you approve or accept the subject transaction through the Website or App. The Transaction Fees may be a percentage of the underlying service, a flat fee or may be charged pursuant to any membership you may sign up for with CarAdvise.
{'\n'}{'\n'}</Text>
<Text>CANCELLATIONS AND REFUNDS
{'\n'}{'\n'}
Reservations for appointments with Maintenance Providers (each, an "Appointment") booked or purchased through the Website or App are non-refundable unless the applicable Maintenance Provider has also agreed to provide you with a full refund of its fees, in which case CarAdvise will also refund you for its fees for Services related to the Appointment with the refunding Maintenance Provider. You can cancel an Appointment for any reason within 2 days/hours prior to the scheduled date of the Appointment, unless noted otherwise. If you cancel an Appointment, you may be charged a cancellation fee by the applicable Maintenance Provider. In addition, you may be charged a cancellation fee of $1 by CarAdvise.
{'\n'}{'\n'}</Text>
<Text>RESPONSIBILITY FOR CONTENT
{'\n'}{'\n'}
You access all content and information (including Vehicle Content) displayed on the Website, the App or otherwise pursuant to the Services at your sole risk. We aren&#39;t liable for any errors or omissions in such content or information, or for any damages or loss you might suffer in connection with it. You are solely responsible for interactions with other users of the Services.
{'\n'}{'\n'}
The Services may contain links or connections to third party websites or services that are not owned or controlled by CarAdvise. When you access third party websites or use third party services, you accept that there are risks in doing so, and that CarAdvise is not responsible for such risks. If directed to or accessing third party websites, we encourage you to be aware when you leave the Services and to read the terms and conditions and privacy policy of each third party website or service that you visit or utilize. CarAdvise has no control over, and assumes no responsibility for, the content, accuracy, privacy policies, or practices of or opinions expressed in any third party websites or by any third party that you interact with through the Services. By using the Services, you release and hold us harmless from any and all liability arising from your use of any third party website or service.
{'\n'}{'\n'}
If there is a dispute between users of the Services, or between users and any third party, you agree that we are under no obligation to become involved. In the event that you have a dispute with one or more other users, you release CarAdvise, its officers, employees, agents, and successors from claims, demands, and damages of every kind or nature, known or unknown, suspected or unsuspected, disclosed or undisclosed, arising out of or in any way related to such disputes and/or our Services.
{'\n'}{'\n'}</Text>
<Text>ORGANIZATIONAL USERS
{'\n'}{'\n'}
If you&#39;re using any of our Services on behalf of an organization or entity, you affirm that you have the right to act on behalf of that organization or entity, and that these Terms of Use apply to the organization or entity (and all references to "you" and similar terms refer to that organization or entity). The organization or entity will hold harmless and indemnify CarAdvise (and its
{'\n'}{'\n'}
affiliates, officers, agents, and employees) from any claim, suit or action arising from or related to the use of the Services or violation of these terms, including any liability or expense arising from claims, losses, damages, suits, judgments, litigation costs and attorneys&#39; fees.
{'\n'}{'\n'}</Text>
<Text>NO WARRANTY
{'\n'}{'\n'}
THE SERVICES ARE PROVIDED BY CARADVISE ON AN "AS IS" BASIS. NO WARRANTY IS OFFERED OR IMPLIED. WE DISCLAIM ALL WARRANTIES WITH RESPECT TO THE SERVICES, AND TO ANY INFORMATION AVAILABLE ON THE WEBSITE AND THE APP OR OTHERWISE PURSUANT TO THE SERVICES. THIS INCLUDES ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. WE MAKE NO WARRANTY OR REPRESENTATION REGARDING THE RESULTS THAT MAY BE OBTAINED FROM THE SERVICES, OR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OBTAINED PURSUANT TO THE SERVICES, OR THAT ANY INFORMATION WILL MEET ANY OF YOUR REQUIREMENTS. WE MAKE NO WARRANTY THAT YOUR ACCESS TO THE WEBSITE AND THE APP WILL BE UNINTERRUPTED, TIMELY, SECURE OR ERROR-FREE. WE ARE NOT RESPONSIBLE FOR THE TIMELINESS, DELETION, MISDELIVERY OR FAILURE TO STORE ANY OF YOUR COMMUNICATIONS.
{'\n'}{'\n'}
You acknowledge and agree that your use of the Services and any information or content available through the Services is at your discretion and risk. You are solely responsible for any damage to your computer system or loss of data that may result from your use of the Internet or your access or use of the Services, including, without limitation, the Website and the App.
{'\n'}{'\n'}
No advice or information, whether written or oral, obtained from us or from or as a result of the Services creates any warranty.
{'\n'}{'\n'}</Text>
<Text>NO LIABILITY
{'\n'}{'\n'}
IN NO EVENT WILL CARADVISE OR ANY OF ITS OFFICERS, AFFILIATES, DIRECTORS, ADVISORS, MEMBERS, REPRESENTATIVES, OR AGENTS BE LIABLE FOR ANY DIRECT, INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER, INCLUDING, WITHOUT LIMITATION, DAMAGES: (1) FOR LOSS OF USE, DATA, INFORMATION, PROFITS OR BUSINESS INTERRUPTION; OR (2) ARISING OUT OF OR IN ANY WAY RELATED TO: A) ANY INFORMATION OBTAINED THROUGH OR RELATED TO THE SERVICES, B) ANY SITE LINKED TO OR FROM THE WEBSITE OR THE APP, C) ANY INABILITY TO USE THE WEBSITE, THE APP OR ANY OF THE SERVICES, OR D) OTHERWISE ARISING OUT OF OR RELATED TO THE USE OR PERFORMANCE OF THE SERVICES. THIS LIMITATION APPLIES WHETHER BASED IN TORT, CONTRACT, NEGLIGENCE, STRICT LIABILITY OR OTHERWISE, AND EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. YOUR SOLE AND EXCLUSIVE REMEDY IS TO DISCONTINUE USING THE SERVICES.
{'\n'}{'\n'}
Some states do not allow the exclusion or limitation of incidental or consequential damages, so some of the above limitations may not apply to you.
{'\n'}{'\n'}</Text>
<Text>INDEMNIFICATION
{'\n'}{'\n'}
You agree to indemnify, defend and hold harmless CarAdvise, our affiliates, and their respective officers, directors, advisors, members, representatives, and agents from any and all losses, expenses, third-party claims, liability, damages, costs, and attorneys&#39; fees arising from or incurred as a result of your misuse of the Services, or the violation of these Terms of Use, including without limitation, your infringement of any intellectual property or other right or policy of any person or CarAdvise.
{'\n'}{'\n'}</Text>
<Text>INTELLECTUAL PROPERTY RIGHTS AND OWNERSHIP
{'\n'}{'\n'}
All content on the Website and the App, and otherwise appearing on or related to the Services in any way, such as, without limitation, Vehicle Content, User Data, documents, materials, text, graphics, logos, button icons, images, audio clips, digital downloads, trade dress, data compilations and software and any other information or content provided through the Services (collectively, the "Services Content") is the property of CarAdvise or our suppliers and is protected by United States and international copyright laws. You promise to abide by all copyright notices, trademark rules, information, and restrictions contained in any Services Content that you access through the Services, and you won't use, copy, reproduce, modify, translate, publish, broadcast, transmit, distribute, perform, upload, display, license, sell or otherwise exploit for any purpose any Services Content not owned by you, (i) without the prior written consent of the owner of that Services Content or (ii) in a way that violates someone else's rights, including the rights of CarAdvise.
{'\n'}{'\n'}
The Services Content appearing on the Website and the App is also distinctive and protected trademarks or trade dress of CarAdvise or our affiliates. The Website and the App may also contain various third-party names and marks that are the property of their respective owners.
{'\n'}{'\n'}
The Services may allow you to copy, use, print or download certain Services Content, in which case these Terms of Use continue to apply following your copying or downloading of the Services Content. You are only permitted to undertake any such copying, use, printing or downloading of Services Content solely for your internal or personal use. Unauthorized commercial publication, copying, modifying, mirroring, framing, distributing, republishing, transmitting or exploitation of any Services Content is prohibited without our express written consent. Without limitation of the foregoing, you agree that you will not sell, convey, license, sublicense, resell or attempt any of the Services Content.
{'\n'}{'\n'}
Any unauthorized use of the Services Content or any other intellectual property is strictly prohibited and may be prosecuted to the fullest extent that the law provides.
{'\n'}{'\n'}</Text>
<Text>THIRD-PARTY WEBSITES
{'\n'}{'\n'}
We are not responsible for, and have no control over, the contents of any sites linked to, referenced by, or accessible from the Website and the App, or any site that links to the Website and the App. Any links or references are provided for your convenience, and are not intended as an endorsement by CarAdvise or a warranty of any type regarding any sites or the products, services, information or materials on any sites. Your linking to or otherwise visiting any other site is at your own risk, and we accept no liability for the contents, accuracy or currency of any

other site. We assume no responsibility, and is not liable, for any transmission or material, or any viral infection of your computer equipment or software, or any other types of damage related to your access, use of or browsing in this or any other site.
{'\n'}{'\n'}</Text>
<Text>INTERPRETATION & DISPUTES
{'\n'}{'\n'}
These Terms of Use governed by the laws of the United States and the State of Delaware, without regard to any conflict of laws provisions. Any case, controversy, suit, action or proceeding arising out of, in connection with, or related to these Terms of Use (including any dispute related to the Services) shall be brought in state and federal courts located in Chicago, Illinois, and you hereby waive any objection to the exclusive jurisdiction of such courts.
{'\n'}{'\n'}</Text>
<Text>SECURITY
{'\n'}{'\n'}
Transmissions over the Internet are never 100% secure or error-free. We take reasonable steps to protect your User Account and any personal information you may submit from loss, misuse, and unauthorized access, disclosure, alteration and destruction, but we are in no event responsible for liability related to any security breach of the Website or the App.
{'\n'}{'\n'}</Text>
<Text>ENTIRE AGREEMENT
{'\n'}{'\n'}
By your access or use of the Services, you agree to these Terms of Use. These Terms of Use, as they may be amended from time to time, together with the Privacy Policy, constitute the entire agreement between you and CarAdvise with respect to your access and use of the Services. Any waiver of any provision of these Terms of Use will be effective only if in writing and signed by CarAdvise. These Terms of Use will inure to the benefit of our successors and assigns.
{'\n'}{'\n'}
No agency, partnership, joint venture, or employment is created as a result of these Terms of Use and you do not have any authority of any kind to bind CarAdvise in any respect whatsoever. You and CarAdvise agree that there are no third party beneficiaries intended under these Terms of Use.
{'\n'}{'\n'}
We have the right to enforce these Terms of Use, even if we don&#39;t right away. No waiver of any provision of these Terms of Use shall be deemed a further or continuing waiver of such term or any other term, and CarAdvise&#39;s failure to assert any right or provision under these Terms of Use shall not constitute a waiver of such right or provision.
{'\n'}{'\n'}
CarAdvise has a right to assign these Terms of Use and its rights hereunder to any party from time to time.
{'\n'}{'\n'}</Text>
<Text>ELECTRONIC COMMUNICATIONS
{'\n'}{'\n'}
You agree that these Terms of Use and any other documentation, agreements, notices or communications between you and CarAdvise may be provided to you electronically, to the extent permissible by law. Please print a copy of all documentation, agreements, notices or other communications for your reference.
{'\n'}{'\n'}</Text>
<Text>CONTACTING US
{'\n'}{'\n'}
If you have any questions or concerns regarding these Terms of Use or the Services, please contact us at support@CarAdvise.com.</Text>
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

module.exports = Terms;
