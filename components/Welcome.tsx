/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Button, MD2Colors, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'react-native-reanimated-carousel';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { users } from './lib/firestore';
import { pry } from './colors';
import { useUser } from './lib/context';
import { User } from './interfaces';
import Animated, { BounceIn } from 'react-native-reanimated';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';

const Welcome = ({navigation,route}: {navigation: any; route: any}) => {
  const [firstTime, setFirstTime] = useState(false);
  const [skip, setSkip] = useState(false);
  const {user, setUser}: User = useUser();

  useEffect(() => {
    (async () => {
      let checkFirstTime = await AsyncStorage.getItem('firstTime');

      if (!checkFirstTime) {
        setFirstTime(true);
        await AsyncStorage.setItem('firstTime', '1');
      }
    })();
  }, []);

  // redirect after auth
  if (user?.email) setTimeout(() => navigation.navigate('Home'), 0);

  // authentication
  const googleAuth = async () => {
    GoogleSignin.configure({
      webClientId: "515730826407-ki1m138slk6c6og1arbkei85ou5m68j0.apps.googleusercontent.com",
      offline: true,
    });

    try {
      await GoogleSignin.hasPlayServices();
      let status = await GoogleSignin.isSignedIn(),
        login, authUser, id;

      if (status) login = await GoogleSignin.getCurrentUser();
      else login = await GoogleSignin.signIn();

      let googleAuthUser = login?.user;
      if (googleAuthUser?.email !== '') {
        // fetch user info from db
        let get = await users.where('email', '==', googleAuthUser?.email).get();
        // user is in db
        if (!get.empty) {
          // get user info
          let userInfo = get.docs[0];
          authUser = userInfo.data();
          id = userInfo.id;
          // slam user id in d app storage!
          await AsyncStorage.setItem('id', id);
        } else {
          // okay! newuser
          authUser = { ...googleAuthUser, balance: 0, logs: [] };
          // add the user to firebase
          let add = await users.add(authUser);
          // slam user data in d app storage!
          // await AsyncStorage.setItem('user', JSON.stringify(authUser));
          await AsyncStorage.setItem('id', add.id);
        }
        setUser(authUser);
        navigation.setParams({
          user: authUser,
          id: id,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LinearGradient colors={[MD2Colors.green100, MD2Colors.grey200]} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={[styles.frow, styles.fcenter]}>
        <Animated.View entering={BounceIn.duration(1000)} style={{margin: 10}}>
          <Text variant="bodyLarge">Airtime</Text>
        </Animated.View>
        <Animated.View entering={BounceIn.duration(1200).delay(100)} style={{margin: 10}}>
          <Text variant="bodyLarge">Mobile Data</Text>
        </Animated.View>
        <Animated.View entering={BounceIn.duration(1400).delay(300)} style={{margin: 10}}>
          <Text variant="bodyLarge">TV Sub</Text>
        </Animated.View>
      </View>
      <View style={[styles.frow, styles.fcenter]}>
        <Animated.View entering={BounceIn.duration(1200).delay(3000)}>
          <Text variant="displayLarge" style={{textAlign: 'center'}}>Billup</Text>
          <Text variant="bodySmall" style={{textAlign: 'center', marginTop: -5}}>Sure plug to get bills paid</Text>
        </Animated.View>
      </View>
      <View style={[styles.frow, styles.fcenter]}>
        <Animated.View entering={BounceIn.duration(1600).delay(500)} style={{margin: 10}}>
          <Text variant="bodyLarge">Electricity</Text>
        </Animated.View>
        <Animated.View entering={BounceIn.duration(1800).delay(700)} style={{margin: 10}}>
          <Text variant="bodyLarge">Education</Text>
        </Animated.View>
      </View>
        {/* <Text variant='displayLarge'>Billup</Text>
        <Text variant='titleLarge' style={{ fontSize: 24 }}>Get ur bills paid steadly</Text> */}
        {(skip && !firstTime ) && (
          <>
            <GoogleSigninButton
              style={{ width: 260, height: 48, marginTop: 10 }}
              size={GoogleSigninButton.Size.Wide}
              onPress={googleAuth}
            />
          </>
        )}
      </View>
      {firstTime && (
        <>
          {skip && <Button
            icon="skip-forward"
            compact={false}
            style={{ backgroundColor: pry, width: 80, position: 'absolute', bottom: 20, right: 20, zIndex: 100 }}
            textColor='white'
            contentStyle={{ flexDirection: 'row-reverse' }}
            onPress={() => setFirstTime(false)}
          >Skip</Button>}
          <Carousel
            loop
            width={Dimensions.get('screen').width}
            height={Dimensions.get('window').height}
            autoPlay={true}
            data={[...new Array(6).keys()]}
            scrollAnimationDuration={1000}
            onSnapToItem={index => index == 2 && setSkip(true)}
            renderItem={({ index }) => (
              <View
                style={{
                  flex: 1,
                  borderWidth: 1,
                  justifyContent: 'center',
                }}>
                <Text style={{ textAlign: 'center', fontSize: 30 }}>
                  This the billup app {index}
                </Text>
              </View>
            )}
          />
        </>

      )}
    </LinearGradient>
  );
};

export default Welcome;
