import { AsyncStorage } from 'react-native';

export default {
  get(key) {
    return AsyncStorage
      .getItem(key)
      .then(value => value ? JSON.parse(value).value : null);
  },

  set(key, value) {
    return AsyncStorage.setItem(key, JSON.stringify({ value }));
  },

  remove(key) {
    return AsyncStorage.removeItem(key);
  },

  clear() {
    return AsyncStorage.clear();
  }
};
