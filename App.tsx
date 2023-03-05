import React, {useRef, useState} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Welcome from './components/Welcome';
import Home from './components/Home';
import Services from './components/services/index';
import Airtime from './components/Airtime';
import TransactionDetails from './components/TransactionDetails';
import {
  DrawerLayout,
  GestureHandlerRootView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {
  Avatar,
  IconButton,
  MD2Colors,
  Text,
  Switch,
  TouchableRipple,
  Tooltip,
  TextInput,
  Button,
} from 'react-native-paper';
import styles from './components/styles';
import {Modal, View} from 'react-native';
import {pry, sec} from './components/colors';
import LinearGradient from 'react-native-linear-gradient';
import {money, users} from './components/lib/firestore';
import {UserProvider, useUser} from './components/lib/context';
import Logs from './components/Logs';
import Admin from './components/Admin';
import CustomerProfile from './components/CustomerProfile';

const App = () => {
  const Stack = createNativeStackNavigator();
  const navRef = useRef();

  const NavDrawer = () => {
    const [showModal, toggleModal] = useState(false);
    const nav = useNavigation();
    let {user, id} = useUser();
    const [settings, setSettings] = useState(false);

    const TFAModal = () => {
      const [text, setText] = useState({msg: '', text: '', tries: 3});
      const fn2FA = async () => {
        if (text.tries === 0) return;
        else {
          let curAction = user.TWOFAEnable;
          // confirm 2fa before disabling it
          if (curAction === true) {
            if (user.TWOFA == text.text) {
              toggleModal(!showModal);
              await users.doc(id).update({
                TWOFA: 1234,
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
              TWOFA: 1234,
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
          <TouchableWithoutFeedback
            style={{
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, .3)',
              padding: 20,
            }}>
            <View
              style={{
                backgroundColor: MD2Colors.grey200,
                padding: 20,
                width: '100%',
                borderRadius: 5,
                height: '40%',
                top: '30%',
              }}>
              <Text variant="titleLarge" style={{textAlign: 'center'}}>
                2FA Authentication
              </Text>
              <View style={[styles.fcenter, {top: '20%'}]}>
                <View style={{marginBottom: 16}}>
                  <TextInput
                    value={text}
                    onChangeText={txt => setText(txt)}
                    placeholder="0"
                    style={{backgroundColor: 'transparent', width: 200}}
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
          </TouchableWithoutFeedback>
        </Modal>
      );
    };

    return (
      <>
        <TFAModal />
        <LinearGradient
          colors={[pry + '11', pry + '44']}
          style={{position: 'relative', height: '100%'}}>
          {user?.photo && (
            <View>
              <LinearGradient
                colors={[pry + 'cc', pry + 'dd']}
                style={{height: 120}}>
                <View style={[styles.frow, {padding: 8}]}>
                  <Avatar.Image source={{uri: user?.photo}} size={48} />
                  <View>
                    <Text
                      variant="titleMedium"
                      style={{color: MD2Colors.grey300, marginLeft: 5}}>
                      {user?.name}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{color: MD2Colors.grey300, marginLeft: 5}}>
                      {user?.email}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text
                    variant="bodyMedium"
                    style={{
                      color: MD2Colors.grey300,
                      textAlign: 'center',
                      marginBottom: 10,
                    }}>
                    Balance
                  </Text>
                  <Text
                    variant="titleLarge"
                    style={{
                      color: MD2Colors.grey300,
                      textAlign: 'center',
                      marginTop: -10,
                    }}>
                    {money(user?.balance || 0)}
                  </Text>
                </View>
              </LinearGradient>
              {settings ? (
                <>
                  <TouchableRipple onPress={() => toggleModal(!showModal)}>
                    <View
                      style={[
                        styles.frow,
                        styles.fspace,
                        styles.fVertCenter,
                        styles.p2,
                      ]}>
                      <Text variant="bodySmall">
                        {user.TWOFAEnable ? 'Disable' : 'Enable'} 2FA
                      </Text>
                      <Switch
                        value={user.TWOFAEnable}
                        onValueChange={() => toggleModal(!showModal)}
                      />
                    </View>
                  </TouchableRipple>
                  <TouchableRipple
                    style={{
                      position: 'absolute',
                      bottom: '-310%',
                      width: '100%',
                    }}
                    rippleColor={pry + '44'}
                    onPress={() => setSettings(!settings)}>
                    <View style={[styles.frow, styles.fVertCenter, styles.p2]}>
                      <IconButton
                        iconColor={pry}
                        icon="close"
                        style={{marginVertical: -10}}
                      />
                      <Text variant="bodySmall" style={{color: pry}}>
                        Close Settings
                      </Text>
                    </View>
                  </TouchableRipple>
                </>
              ) : (
                <View>
                  <TouchableRipple
                    rippleColor={pry + '44'}
                    onPress={() => {
                      nav.navigate('Home');
                      navRef.current.closeDrawer();
                    }}>
                    <View style={[styles.frow, styles.fVertCenter, styles.p2]}>
                      <IconButton
                        style={{marginVertical: -10}}
                        iconColor={pry}
                        icon="home"
                      />
                      <Text variant="bodySmall" style={{color: pry}}>
                        Home
                      </Text>
                    </View>
                  </TouchableRipple>
                  <TouchableRipple
                    rippleColor={pry + '44'}
                    onPress={() => setSettings(!settings)}>
                    <View style={[styles.frow, styles.fVertCenter, styles.p2]}>
                      <IconButton
                        iconColor={pry}
                        icon="account-cog"
                        style={{marginVertical: -10}}
                      />
                      <Text variant="bodySmall" style={{color: pry}}>
                        Account Settings
                      </Text>
                    </View>
                  </TouchableRipple>
                  <TouchableRipple
                    rippleColor={pry + '44'}
                    onPress={() => {
                      nav.navigate('Home');
                      navRef.current.closeDrawer();
                    }}>
                    <View style={[styles.frow, styles.fVertCenter, styles.p2]}>
                      <IconButton
                        style={{marginVertical: -10}}
                        iconColor={pry}
                        icon="account-group"
                      />
                      <Text variant="bodySmall" style={{color: pry}}>
                        My Beneficiary
                      </Text>
                    </View>
                  </TouchableRipple>
                  <TouchableRipple
                    rippleColor={pry + '44'}
                    onPress={() => {
                      nav.navigate('Logs');
                      navRef.current.closeDrawer();
                    }}>
                    <View style={[styles.frow, styles.fVertCenter, styles.p2]}>
                      <IconButton
                        style={{marginVertical: -10}}
                        iconColor={pry}
                        icon="script-text-outline"
                      />
                      <Text variant="bodySmall" style={{color: pry}}>
                        Trasactions History
                      </Text>
                    </View>
                  </TouchableRipple>
                  <TouchableRipple
                    rippleColor={pry + '44'}
                    onPress={() => {
                      nav.navigate('Admin');
                      navRef.current.closeDrawer();
                    }}>
                    <View style={[styles.frow, styles.fVertCenter, styles.p2]}>
                      <IconButton
                        style={{marginVertical: -10}}
                        iconColor={pry}
                        icon="account-lock"
                      />
                      <Text variant="bodySmall" style={{color: pry}}>
                        Admin Panel
                      </Text>
                    </View>
                  </TouchableRipple>
                </View>
              )}
            </View>
          )}
        </LinearGradient>
      </>
    );
  };

  const Headers = ({props}: {props: any}) => (
    <LinearGradient
      colors={[pry + 'dd', pry + 'cc']}
      style={{justifyContent: 'center'}}>
      <View style={[styles.frow, styles.fspace]}>
        {props.back == undefined ? (
          <>
            <IconButton
              icon="menu"
              iconColor={sec}
              onPress={navRef.current?.openDrawer}
            />
            <IconButton icon="bell-outline" iconColor={sec} />
          </>
        ) : (
          <View style={[styles.frow, styles.fspace, {flex: 1}]}>
            <View style={[styles.frow, {alignItems: 'center'}]}>
              <IconButton
                icon="arrow-left"
                onPress={props.navigation.goBack}
                iconColor={sec}
                style={{marginVertical: 10}}
              />
              <Text variant="titleMedium" style={{color: sec + 'ff'}}>
                {props.options.title}
              </Text>
            </View>
            <View style={[styles.frow]}>
              <IconButton
                icon="bell"
                // onPress={() => props.navigation('Home')}
                iconColor={sec}
                style={{marginVertical: 10}}
              />
              <IconButton
                icon="menu"
                onPress={navRef.current.openDrawer}
                iconColor={sec}
                style={{marginVertical: 10}}
              />
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <UserProvider>
        <NavigationContainer>
          <DrawerLayout
            drawerWidth={240}
            drawerPosition="right"
            useNativeAnimations={true}
            drawerType="front"
            minSwipeDistance={20}
            renderNavigationView={() => <NavDrawer />}
            drawerBackgroundColor={MD2Colors.white}
            ref={navRef}>
            <Stack.Navigator
              screenOptions={{
                header: (props: any) => <Headers props={props} />,
              }}>
              <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Home"
                component={Home}
                options={{headerShown: true}}
              />
              <Stack.Screen
                name="Services"
                component={Services}
                options={{title: 'Services'}}
              />
              <Stack.Screen
                name="Airtime"
                component={Airtime}
                options={{title: 'Airtime'}}
              />
              <Stack.Screen
                name="TransactionDetails"
                component={TransactionDetails}
                options={{title: 'Transaction Details'}}
              />
              <Stack.Screen
                name="Logs"
                component={Logs}
                options={{
                  headerTitle: 'Transaction History',
                  title: 'Transaction History',
                }}
              />
              <Stack.Screen
                name="CustomerProfile"
                component={CustomerProfile}
                options={{
                  title: 'Customer Profile',
                }}
              />
              <Stack.Screen
                name="Admin"
                component={Admin}
                options={{title: 'Admin panel'}}
              />
            </Stack.Navigator>
          </DrawerLayout>
        </NavigationContainer>
      </UserProvider>
    </GestureHandlerRootView>
  );
};

export default App;
