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

const App = () => {
  const Stack = createNativeStackNavigator();
  const navRef = useRef();

  const NavDrawer = () => {
    const nav = useNavigation();
    let {user} = useUser();

    return (
      <LinearGradient
        colors={[pry + '11', pry + '44']}
        style={{position: 'relative', height: '100%'}}>
        <LinearGradient colors={[pry + 'cc', pry + 'dd']} style={{height: 120}}>
          <View style={[styles.frow, {padding: 8}]}>
            {user.photo !== '' && (
              <Avatar.Image source={{uri: user.photo}} size={48} />
            )}
            <Text
              variant="titleMedium"
              style={{color: MD2Colors.grey300, marginLeft: 5}}>
              {user.name}
            </Text>
          </View>
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
            {money(user.balance)}
          </Text>
        </LinearGradient>
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
      </LinearGradient>
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
                {props.route.name}
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
                // options={{headerShown: false}}
              />
              <Stack.Screen name="Airtime" component={Airtime} />
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
            </Stack.Navigator>
          </DrawerLayout>
        </NavigationContainer>
      </UserProvider>
    </GestureHandlerRootView>
  );
};

export default App;
