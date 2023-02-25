import React, {useState} from 'react';
import {View} from 'react-native';
import {ActivityIndicator, MD2Colors, Snackbar} from 'react-native-paper';
import {sec} from '../colors';
import styles from '../styles';
import NetInfo from '@react-native-community/netinfo';
import LinearGradient from 'react-native-linear-gradient';

export const Network = () => {
  const [net, setNet] = useState(true);
  NetInfo.fetch().then(con => setNet(con.isInternetReachable));
  return (
    <View
      style={[
        styles.fcenter,
        {zIndex: 1000, position: 'absolute', bottom: '0%', width: '100%'},
      ]}>
      <Snackbar
        style={{color: sec}}
        elevation={2}
        visible={net === false}
        onDismiss={() => setNet(true)}
        action={{
          label: 'Close',
          onPress: () => setNet(true),
        }}>
        You are not connected to the internet.
      </Snackbar>
    </View>
  );
};

export const Loader = () => (
  <LinearGradient
    colors={[MD2Colors.red400, MD2Colors.white]}
    style={{
      flex: 1,
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 100,
    }}
  />
);

export const MiniLoader = () => (
  <View style={[styles.fcenter, styles.fVertCenter, {flex: 1}]}>
    <ActivityIndicator
      style={{alignSelf: 'center'}}
      size="large"
      color={MD2Colors.grey200}
    />
  </View>
);
