import React, {useState} from 'react';
import {Modal, TouchableOpacity, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  MD2Colors,
  Snackbar,
  Text,
  TextInput,
} from 'react-native-paper';
import {click, pry} from '../colors';
import styles from '../styles';
import NetInfo from '@react-native-community/netinfo';
import LinearGradient from 'react-native-linear-gradient';
import {adminTransaction, money, ref, updateFirebase} from '../lib/firestore';
import {useUser} from '../lib/context';
import PayWithFlutterwave from 'flutterwave-react-native';

export const Network = () => {
  const [net, setNet] = useState(true);
  NetInfo.fetch().then(con => setNet(con.isInternetReachable ? true : false));
  return (
    <View
      style={[
        styles.fcenter,
        {zIndex: 1000, position: 'absolute', bottom: '0%', width: '100%'},
      ]}>
      <Snackbar
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

export const PaymentModal = ({
  showModal,
  toggleModal,
}: {
  showModal: boolean;
  toggleModal: any;
}) => {
  const [topUp, setTopUp] = useState<{
    msg: string;
    value: any;
  }>({msg: '', value: 500});
  const {id, user, setUser} = useUser();

  return (
    <Modal
      visible={showModal}
      animationType="slide"
      onDismiss={() => toggleModal(!showModal)}
      transparent={true}>
      <TouchableOpacity
        onPress={() => toggleModal(!showModal)}
        style={{height: '100%', backgroundColor: 'rgba(0,0,0,.7)'}}>
        <View
          style={{
            backgroundColor: MD2Colors.grey200,
            padding: 20,
            width: '90%',
            borderRadius: 10,
            top: '24%',
            alignSelf: 'center',
          }}>
          <TextInput
            onChangeText={(text: number | string) =>
              setTopUp({...topUp, value: text})
            }
            value={topUp.value}
            keyboardType="numeric"
            placeholder="Amount..."
            label="Wallet Topup"
            style={{backgroundColor: 'transparent'}}
            outlineColor={pry}
            activeUnderlineColor={pry}
            underlineColor={pry}
            textColor={pry}
            placeholderTextColor={pry}
            selectionColor={click}
            left={<TextInput.Icon icon="cash-fast" iconColor={pry} />}
          />
          <Text
            variant="bodySmall"
            style={{
              color: MD2Colors.red400,
              paddingVertical: 5,
              textAlign: 'center',
            }}>
            Note: A service fee of {money(50)} will be charged.
          </Text>
          {topUp.msg != '' && (
            <Text
              variant="bodySmall"
              style={{
                color: MD2Colors.red400,
                paddingVertical: 5,
                textAlign: 'center',
              }}>
              {topUp.msg}
            </Text>
          )}
          <View style={[styles.frow, styles.fcenter, styles.my1]}>
            <Button mode="outlined" onPress={() => toggleModal(!showModal)}>
              Cancel
            </Button>
            <PayWithFlutterwave
              onRedirect={async e => {
                let log = {
                  title: 'Wallet Topup',
                  desc: 'Wallet topup of ' + money(topUp.value),
                  status: e.status == 'successful' ? 'success' : 'failed',
                  amount: e.status == 'successful' ? topUp.value : 0,
                  info: e,
                  createdAt: new Date(),
                };
                await updateFirebase(id, topUp.value - 50, log, true);
                await adminTransaction({id, info: log});
                setTopUp({msg: '', value: 0});
                toggleModal(!showModal);
                setUser({
                  ...user,
                  balance: Number(user.balance) + Number(topUp.value - 50),
                });
              }}
              options={{
                tx_ref: ref(),
                amount: topUp.value,
                authorization:
                  'FLWPUBK_TEST-3ffa62793f521b1e3134650390f7ea97-X',
                customer: {
                  name: user?.name,
                  email: user?.email,
                },
                currency: 'NGN',
                payment_options: 'card,banktransfer',
                customizations: {
                  title: 'Billup',
                  description: 'Wallet payment',
                },
              }}
              customButton={props => (
                <Button
                  mode="contained"
                  onPress={async () => {
                    if (topUp.value < 100) {
                      setTopUp({
                        ...topUp,
                        msg: 'Minimum top up value is ' + money(100),
                      });
                    } else if (topUp.value > 5000000) {
                      setTopUp({
                        ...topUp,
                        msg: 'Maximum top up value is ' + money(500000),
                      });
                    } else {
                      props.onPress();
                      console.log(topUp.value);
                      setTopUp({...topUp, msg: ''});
                    }
                  }}>
                  Continue
                </Button>
              )}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
