import React, {useState, useEffect} from 'react';
import {Modal, TouchableWithoutFeedback, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Button,
  Switch,
  TextInput,
  MD2Colors,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import {pry, sec} from './colors';
import {useUser} from './lib/context';
import {users} from './lib/firestore';
import styles from './styles';

const Settings = () => {
  const {user, id} = useUser();
  const [showModal, toggleModal] = useState(false);

  const TFAModal = () => {
    const [text, setText] = useState({msg: '', text: '', tries: 3});
    const fn2FA = async () => {
      if (text.tries === 0) {
        return;
      } else {
        let curAction = user.TWOFAEnable;
        // confirm 2fa before disabling it
        if (curAction === true) {
          if (user.TWOFA == text.text) {
            toggleModal(!showModal);
            await users.doc(id).update({
              TWOFA: text.text,
              TWOFAEnable: !curAction,
            });
          } else {
            setText({
              ...text,
              msg: `Invalid 2-FA pin supplied tries remain ${text.tries - 1}`,
              tries: text.tries - 1,
            });
          }
        } else {
          // first time creating it -> accept it directly
          toggleModal(!showModal);
          await users.doc(id).update({
            TWOFA: text.text,
            TWOFAEnable: !curAction,
          });
        }
      }
    };

    return (
      <Modal
        visible={showModal}
        animationType="slide"
        onDismiss={() => toggleModal(!showModal)}
        transparent={true}>
        <TouchableWithoutFeedback onPress={() => toggleModal(!showModal)}>
          <View
            style={{
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, .6)',
              padding: 20,
            }}>
            <View
              style={{
                backgroundColor: MD2Colors.grey200,
                padding: 20,
                width: '100%',
                // marginLeft: '10%',
                borderRadius: 5,
                minHeight: '30%',
                top: '30%',
              }}>
              <Text variant="titleLarge" style={{textAlign: 'center'}}>
                Setup 2-FA Authentication
              </Text>
              <Text variant="bodySmall" style={{textAlign: 'center'}}>
                Protect your transactions with Two Factor Authentication
              </Text>
              <View style={[styles.fcenter, {top: '10%'}]}>
                <View style={{marginBottom: 10}}>
                  <TextInput
                    value={text.text}
                    onChangeText={txt => setText({...text, text: txt})}
                    placeholder="...."
                    style={{
                      backgroundColor: 'transparent',
                      letterSpacing: 30,
                      width: 150,
                      // textAlign: 'center',
                    }}
                    outlineColor={pry}
                    activeUnderlineColor={pry}
                    underlineColor={pry}
                    textColor={pry}
                    placeholderTextColor={pry}
                  />
                </View>
                {text.msg && (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: MD2Colors.red400,
                      padding: 5,
                    }}
                    variant="bodySmall">
                    {text.msg}
                  </Text>
                )}
                <Button
                  mode="contained"
                  compact={true}
                  style={{paddingHorizontal: 10, backgroundColor: pry}}
                  onPress={fn2FA}>
                  {user.TWOFAEnable ? 'Disable' : 'Enable'} 2-FA
                </Button>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <LinearGradient
      colors={[sec + '44', sec + 'aa']}
      style={{flex: 1, ...styles.p1}}>
      <TFAModal />
      <View>
        <TouchableRipple onPress={() => toggleModal(!showModal)}>
          <View
            style={[styles.frow, styles.fspace, styles.fVertCenter, styles.p2]}>
            <Text variant="bodySmall">
              {user.TWOFAEnable ? 'Disable' : 'Enable'} 2FA
            </Text>
            <Switch
              value={user.TWOFAEnable}
              onValueChange={() => toggleModal(!showModal)}
              color={pry}
            />
          </View>
        </TouchableRipple>
      </View>
    </LinearGradient>
  );
};

export default Settings;
