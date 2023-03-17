import React, {useRef} from 'react';
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
} from 'react-native-gesture-handler';
import {
  Avatar,
  IconButton,
  MD2Colors,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import styles from './components/styles';
import {View} from 'react-native';
import {pry, sec} from './components/colors';
import LinearGradient from 'react-native-linear-gradient';
import {money} from './components/lib/firestore';
import {UserProvider, useUser} from './components/lib/context';
import Logs from './components/Logs';
import Admin from './components/Admin';
import CustomerProfile from './components/CustomerProfile';
import Settings from './components/Settings';
import Statistics from './components/Statistics';
import Search from './components/Search';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Beneficiary from './components/Beneficiary';
import CodePush from 'react-native-code-push';

const App = () => {
  const Stack = createNativeStackNavigator();
  const navRef = useRef();
  
  const Headers = ({props}: {props: any}) => {
    return (
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
              <View style={[styles.frow]}>
                <IconButton
                  icon="magnify"
                  onPress={() => props.navigation.navigate('Logs', 1)}
                  iconColor={sec}
                  style={{marginVertical: 10}}
                />
                <IconButton icon="bell-outline" iconColor={sec} />
              </View>
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
                  icon="magnify"
                  onPress={() => props.navigation.navigate('Logs', 1)}
                  iconColor={sec}
                  style={{marginVertical: 10}}
                />
                <IconButton
                  icon="bell"
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
  };

  const NavDrawer = () => {
    const nav = useNavigation();
    let {user} = useUser();

    return (
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
                onPress={() => {
                  nav.navigate('Settings');
                  navRef.current.closeDrawer();
                }}>
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
                  nav.navigate('Beneficiary');
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
              <TouchableRipple
                rippleColor={pry + '44'}
                onPress={() => {
                  nav.navigate('Stats', {stats: 1});
                  navRef.current.closeDrawer();
                }}>
                <View style={[styles.frow, styles.fVertCenter, styles.p2]}>
                  <IconButton
                    style={{marginVertical: -10}}
                    iconColor={pry}
                    icon="chart-bar"
                  />
                  <Text variant="bodySmall" style={{color: pry}}>
                    Statistics
                  </Text>
                </View>
              </TouchableRipple>
              <TouchableRipple
                rippleColor={pry + '44'}
                onPress={async () => {
                  await AsyncStorage.removeItem('id');
                  nav.navigate('Welcome');
                  navRef.current.closeDrawer();
                }}>
                <View style={[styles.frow, styles.fVertCenter, styles.p2]}>
                  <IconButton
                    style={{marginVertical: -10}}
                    iconColor={pry}
                    icon="key-remove"
                  />
                  <Text variant="bodySmall" style={{color: pry}}>
                    Logout
                  </Text>
                </View>
              </TouchableRipple>
            </View>
          </View>
        )}
      </LinearGradient>
    );
  };

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
              <Stack.Screen
                name="Settings"
                component={Settings}
                options={{title: 'Account Settings'}}
              />
              <Stack.Screen
                name="Stats"
                component={Statistics}
                options={{title: 'Statistics'}}
              />
              <Stack.Screen
                name="Search"
                component={Search}
                options={{title: 'Search', headerShown: false}}
              />
              <Stack.Screen
                name="Beneficiary"
                component={Beneficiary}
                options={{title: 'Beneficiaries'}}
              />
            </Stack.Navigator>
          </DrawerLayout>
        </NavigationContainer>
      </UserProvider>
    </GestureHandlerRootView>
  );
};

let codePushConfig = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  minimumBackgroundDuration: 60,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  updateDialog: {
    appendReleaseDescription: true,
    title: 'Update available',
    optionalUpdateMessage:
      'Click update to upgrade your app to the latest version.',
  },
};

export default __DEV__ ? App : CodePush(codePushConfig)(App);
