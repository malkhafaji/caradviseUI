import React from 'react';
import {
  View,
  WebView,
  Component,
  StyleSheet
} from 'react-native';
import TopBar from '../../components/main/topBar';

class IntroVideo extends Component {
  render() {
    return (
      <View style={styles.base}>
        <TopBar navigator={this.props.navigator} />
        <WebView
          style={styles.webView}
          startInLoadingState={true}
          allowsInlineMediaPlayback={true}
          source={{ uri: 'https://www.youtube.com/embed/Wp5fY7bdpvg?rel=0&playsinline=1' }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1
  }
});

module.exports = IntroVideo;
