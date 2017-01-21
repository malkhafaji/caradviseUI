import { Linking, Alert } from 'react-native';

export default function callPhone(number) {
  let url = `tel:${number}`;

  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Alert.alert(
        'Speak to a Caradvise advisor',
        `Call ${number}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => Linking.openURL(url) }
        ]
      );
    }
    else {
      Alert.alert(`Call ${number}`);
    }
  });
}
