/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, View } from 'react-native';
import { Button, MD2Colors, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'react-native-reanimated-carousel';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { users } from './lib/firestore';
import { pry } from './colors';
import { useUser } from './lib/context';
import { User } from './interfaces';
import Animated, { BounceIn, FadeIn } from 'react-native-reanimated';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';

const Welcome = ({navigation}: {navigation: any}) => {
  const [firstTime, setFirstTime] = useState(false);
  const [skip, setSkip] = useState(false);
  const {user, setUser, id, setId}: {user: User; setId: Function; setUser: Function; id: string} = useUser();
  const [showImage, setShowImage] = useState<{img: any[], show: boolean}>({img: [], show: true});

  if (showImage.show) setTimeout(() => setShowImage({
      ...showImage,
      show: false,
    }),2000)

  useEffect(() => {
    let img = require('./img/welcome.jpg');
    let img1 = require('./img/img1.png');
    let img2 = require('./img/welcome.jpg');
    setShowImage({...showImage, img: [img, img1, img2]});
    (async () => {
      let checkFirstTime = await AsyncStorage.getItem('firstTime');

      if (!checkFirstTime) {
        setFirstTime(true);
        await AsyncStorage.setItem('firstTime', '1');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // redirect after auth
  if (id || user?.email) setTimeout(() => navigation.navigate('Home'), 5000);

  // authentication
  const googleAuth = async () => {
    GoogleSignin.configure({
      webClientId: "515730826407-ki1m138slk6c6og1arbkei85ou5m68j0.apps.googleusercontent.com",
      // offline: true,
    });

    try {
      await GoogleSignin.hasPlayServices();
      let status = await GoogleSignin.isSignedIn(),
        login, authUser;

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
          
          // slam user id in d app storage!
          await AsyncStorage.setItem('id', userInfo.id);
        } else {
          // okay! newuser
          authUser = { ...googleAuthUser, balance: 0, logs: [] };
          // add the user to firebase
          (await users.add(authUser)).onSnapshot(async (doc) => {
            // slam user data in d app storage!
            setId(doc.id);
            await AsyncStorage.setItem('id', doc.id);
          })
        }
        setUser(authUser);
      }
    } catch (error) {}
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {showImage.show ? (
        <Image resizeMode="stretch" source={showImage.img[0]} style={{width: '100%', height: '80%', top: '20%'}}  />
      ) : (
        <LinearGradient colors={[MD2Colors.green100, MD2Colors.grey200]} style={{ flex: 1 }}>
          {firstTime ? (
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
                data={[...new Array(3).keys()]}
                scrollAnimationDuration={1000}
                onSnapToItem={index => index == 2 && setSkip(true)}
                renderItem={({ index }) => (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                    }}>
                    <Image resizeMode="stretch" source={showImage.img[index]}  style={{width: '100%', height: '100%', top: '0%'}}  />
                  </View>
                )}
              />
            </>
          ): (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={[styles.frow, styles.fcenter]}>
                <Animated.View entering={BounceIn.duration(2000)}>
                  <Text variant="displayLarge" style={{textAlign: 'center'}}>Billup</Text>
                  <Text variant="bodySmall" style={{textAlign: 'center', marginTop: -5}}>Sure plug to get bills paid</Text>
                </Animated.View>
              </View>
              <View style={[styles.frow, styles.fcenter]}>
                <Animated.View entering={BounceIn.duration(1000)} style={{margin: 10}}>
                  <Text variant="bodySmall">Airtime</Text>
                </Animated.View>
                <View style={{borderWidth: 2, borderRadius: 100, bottom: -1}} />
                <Animated.View entering={BounceIn.duration(1200).delay(100)} style={{margin: 10}}>
                  <Text variant="bodySmall">Internet Data</Text>
                </Animated.View>
                <View style={{borderWidth: 2, borderRadius: 100, bottom: -1}} />
                <Animated.View entering={BounceIn.duration(1400).delay(300)} style={{margin: 10}}>
                  <Text variant="bodySmall">TV Sub</Text>
                </Animated.View>
              </View>
              <View style={[styles.frow, styles.fcenter]}>
                <Animated.View entering={BounceIn.duration(1600).delay(500)} style={{margin: 10}}>
                  <Text variant="bodySmall">Electricity</Text>
                </Animated.View>
                <View style={{borderWidth: 2, borderRadius: 100, bottom: -1}} />
                <Animated.View entering={BounceIn.duration(1800).delay(700)} style={{margin: 10}}>
                  <Text variant="bodySmall">Education</Text>
                </Animated.View>
              </View>
                {!id && (
                  <Animated.View entering={FadeIn.delay(1000)}>
                    <GoogleSigninButton
                      style={{ width: 260, height: 48, marginTop: 10 }}
                      size={GoogleSigninButton.Size.Wide}
                      onPress={googleAuth}
                    />
                  </Animated.View>
                )}
            </View>
          )}
        </LinearGradient>
      )}
    </View>
  );
};

export default Welcome;
