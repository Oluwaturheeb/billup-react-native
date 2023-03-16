import React, {useState, useEffect} from 'react';
import {CommonActions} from '@react-navigation/native';
import {PermissionsAndroid, StyleSheet, View, Dimensions} from 'react-native';
import {
  Avatar,
  IconButton,
  MD2Colors,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import {pry, sec} from './colors';
import styles from './styles';
import {FlatList, Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Network, PaymentModal} from './services/Components';
import {money} from './lib/firestore';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useUser} from './lib/context';
import {homeData} from './schema';
import {ContentProp, Logs} from './interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Notifications} from 'react-native-notifications';

const height = Dimensions.get('screen').height;
// const width = Dimensions.get('screen').width;

const Home = ({navigation}: {navigation: any}) => {
  // Notifications.postLocalNotification({
  //   title: 'Test notty',
  //   body: 'Hello world',
  //   // category: 'Important',
  //   // userInfo: {},
  //   // fireDate: new Date(),
  // });
  const [data, setData] = useState(homeData);
  const time = new Date().getHours();
  const {user} = useUser();
  const [show, setShow] = useState(true);
  const [tab, setTab] = useState({main: true, log: false});
  const [showModal, toggleModal] = useState(false);

  useEffect(() => {
    // reset the navigation after d welcome screen has been displayed
    navigation.dispatch((state: any) => {
      const routes = state.routes.filter((r: any) => r.name !== 'Welcome');
      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });

    // let post = await axios.get('/service-categories');
    setData({
      response_description: '000',
      content: [
        {
          identifier: 'airtime',
          name: 'Airtime Recharge',
        },
        {
          identifier: 'data',
          name: 'Data Services',
        },
        {
          identifier: 'tv-subscription',
          name: 'TV Subscription',
        },
        {
          identifier: 'electricity-bill',
          name: 'Electricity Bill',
        },
        {
          identifier: 'education',
          name: 'Education',
        },
        /*
        {
          identifier: 'funds',
          name: 'Funds',
        },
        {
          identifier: 'events',
          name: 'Events',
        },
        {
          identifier: 'other-services',
          name: 'Other Merchants/Services',
        },
        {
          identifier: 'insurance',
          name: 'Insurance',
        }, */
      ],
    });

    // request contact reading permission
    (async () => {
      await PermissionsAndroid.request('android.permission.READ_CONTACTS');
      let item = await AsyncStorage.getItem('show');
      if (item) {
        setShow(item == 'show' ? true : false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Greeting = () => (
    <View style={css.jumbo}>
      <View
        style={[
          styles.frow,
          styles.fcenter,
          {marginTop: -10, marginBottom: 16},
        ]}>
        <Avatar.Image source={{uri: user.photo}} size={48} />
        <View style={{marginTop: 8, marginLeft: 8}}>
          {time < 12 && (
            <Text variant="bodyMedium" style={css.greetingText}>
              Good morning{user && ', ' + user.givenName}
            </Text>
          )}
          {time >= 12 && time < 16 && (
            <Text style={css.greetingText} variant="bodyMedium">
              Good afternoon{user && ', ' + user.givenName}
            </Text>
          )}
          {time >= 16 && time >= 16 && (
            <Text style={css.greetingText} variant="bodyMedium">
              Good evening{user && ', ' + user.givenName}
            </Text>
          )}
          <Text variant="bodySmall" style={[css.greetingText, {fontSize: 13}]}>
            What do you want to do today?
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.frow,
          {
            backgroundColor: pry + '55',
            justifyContent: 'space-evenly',
            marginHorizontal: 30,
            borderRadius: 50,
          },
        ]}>
        <Text
          variant="bodyMedium"
          style={{
            backgroundColor: tab.main ? MD2Colors.white : 'transparent',
            flex: 1,
            textAlign: 'center',
            padding: 8,
            borderRadius: 50,
            color: !tab.main ? MD2Colors.grey300 : MD2Colors.grey800,
          }}
          onPress={() => setTab({main: true, log: false})}>
          Services
        </Text>
        <Text
          variant="bodyMedium"
          style={{
            backgroundColor: tab.log ? MD2Colors.white : 'transparent',
            flex: 1,
            textAlign: 'center',
            padding: 8,
            borderRadius: 50,
            color: !tab.log ? MD2Colors.grey300 : MD2Colors.grey800,
          }}
          onPress={() => setTab({main: false, log: true})}>
          Transactions
        </Text>
      </View>
      <View style={{marginTop: 16}}>
        <Text
          variant="bodyMedium"
          style={{color: MD2Colors.grey300, textAlign: 'center'}}>
          Balance
        </Text>
        <Text
          variant="titleLarge"
          style={{color: sec + 'ee', textAlign: 'center'}}>
          {show
            ? !Number.isInteger(user.balance)
              ? money(user.balance)
              : money(user.balance) + '.00'
            : '******'}
        </Text>
        <View style={[styles.frow, styles.fcenter]}>
          <IconButton
            icon="eye"
            onPress={() => setShow(!show)}
            iconColor={sec}
            style={{marginVertical: -5}}
          />
          <IconButton
            icon="cash-plus"
            iconColor={sec}
            style={{marginVertical: -5}}
            onPress={() => toggleModal(!showModal)}
          />
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem('show', !show ? 'show' : 'hide');
    })();
  }, [show]);

  const Services = () => {
    const others: ContentProp[] = [];
    const transY = useSharedValue(0);
    const context = useSharedValue({y: 0});
    const maxTrans = -height + 108;
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = {y: transY.value};
      })
      .onUpdate(e => {
        transY.value = e.translationY + context.value.y;
        transY.value = Math.max(transY.value, maxTrans);
        // transY.value = Math.min(transY.value, -height);
      });
    const modalStyle = useAnimatedStyle(() => ({
      transform: [{translateY: transY.value}],
    }));

    useEffect(() => {
      transY.value = withSpring(-height / 1.44, {damping: 50});
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const ServiceItem = ({item, index}: {item: ContentProp; index: number}) => {
      if (index <= 5) {
        others.push(item);
      }

      let icon =
        item.identifier == 'airtime'
          ? 'phone-sync-outline'
          : item.identifier == 'data'
          ? 'cellphone-nfc'
          : item.identifier == 'electricity-bill'
          ? 'flash-outline'
          : item.identifier == 'tv-subscription'
          ? 'cast-variant'
          : 'school-outline';

      return (
        <TouchableRipple
          rippleColor={pry + 'cc'}
          onPress={() =>
            navigation.navigate(
              item.identifier == 'airtime' ? 'Airtime' : 'Services',
              {item, others},
            )
          }>
          <View
            style={[
              styles.frow,
              styles.fspace,
              styles.px2,
              {alignItems: 'center'},
            ]}>
            <View
              style={[styles.frow, {alignItems: 'center', marginLeft: -10}]}>
              <IconButton
                style={{marginVertical: -10}}
                icon={icon}
                iconColor={pry + 'cc'}
              />
              <Text
                variant="bodyMedium"
                style={{
                  color: pry,
                  fontSize: 12,
                }}>
                {item.name}
              </Text>
            </View>
            <IconButton icon="arrow-right" iconColor={pry} />
          </View>
        </TouchableRipple>
      );
    };

    const ServiceData = () => (
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{borderColor: MD2Colors.grey200, borderBottomWidth: 1}}
          />
        )}
        data={data.content}
        renderItem={({item, index}) => (
          <ServiceItem item={item} index={index} />
        )}
        contentContainerStyle={{marginHorizontal: 16}}
      />
    );

    const LogItems = ({item}: {item: Logs}) => {
      return (
        <View style={[styles.frow, {alignItems: 'center'}]}>
          <IconButton
            icon={
              item.status !== 'failed'
                ? 'checkbox-multiple-marked-circle-outline'
                : 'close-outline'
            }
            iconColor={
              item.status !== 'failed' ? pry + '99' : MD2Colors.redA200
            }
            size={30}
            style={{marginVertical: -10}}
          />
          <View style={{flex: 1}}>
            <Text variant="bodyMedium">{item.title}</Text>
            <Text variant="bodySmall">{item.desc}</Text>
          </View>
        </View>
      );
    };

    const Log = () => (
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{
              borderColor: MD2Colors.grey200,
              borderBottomWidth: 1,
              marginVertical: 5,
            }}
          />
        )}
        data={user.logs.reverse()}
        renderItem={({item}) => <LogItems item={item} />}
        contentContainerStyle={{padding: 20}}
        style={{marginBottom: 180}}
        showsVerticalScrollIndicator={false}
      />
    );

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[modalStyle, css.services]}>
          <View
            style={[
              {
                width: 100,
                backgroundColor: pry + '88',
                height: 4,
                alignSelf: 'center',
                marginTop: -16,
                marginBottom: 10,
                borderRadius: 100,
              },
            ]}
          />
          {tab.main ? <ServiceData /> : <Log />}
        </Animated.View>
      </GestureDetector>
    );
  };

  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={[pry + 'cc', pry + 'ff', MD2Colors.green900]}
        style={{flex: 1}}>
        <Greeting />
        {!showModal && <Services />}
        <Network />
      </LinearGradient>
      {showModal && (
        <PaymentModal toggleModal={toggleModal} showModal={showModal} />
      )}
    </View>
  );
};

const css = StyleSheet.create({
  jumbo: {
    padding: 12,
  },
  greetingText: {
    fontSize: 20,
    color: MD2Colors.grey300,
  },
  mainMoney: {
    fontSize: 40,
    color: MD2Colors.grey300,
  },
  services: {
    borderRadius: 25,
    backgroundColor: 'rgba(243, 255, 227, 1)',
    paddingVertical: 30,
    elevation: 4,
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: height,
    top: height,
  },
});

export default Home;

// {/* <Modal
//   visible={showModal}
//   animationType="slide"
//   onDismiss={() => toggleModal(!showModal)}
//   transparent={true}>
//   <TouchableOpacity
//     onPress={() => toggleModal(!showModal)}
//     style={{height: '100%', backgroundColor: 'rgba(0,0,0,.7)'}}>
//     <View
//       style={{
//         backgroundColor: MD2Colors.grey200,
//         padding: 20,
//         width: width - 40,
//         borderRadius: 10,
//         top: '24%',
//         alignSelf: 'center',
//       }}>
//       <TextInput
//         onChangeText={(text: number | string) =>
//           setTopUp({...topUp, value: text})
//         }
//         value={topUp.value}
//         keyboardType="numeric"
//         placeholder="Amount..."
//         label="Wallet"
//         style={{backgroundColor: 'transparent'}}
//         outlineColor={pry}
//         activeUnderlineColor={pry}
//         underlineColor={pry}
//         textColor={pry}
//         placeholderTextColor={pry}
//         selectionColor={click}
//         left={<TextInput.Icon icon="cash-plus" iconColor={pry} />}
//       />
//       <Text
//         variant="bodySmall"
//         style={{
//           color: MD2Colors.red400,
//           paddingVertical: 5,
//           textAlign: 'center',
//         }}>
//         Note: A service fee of {money(50)} will be charged.
//       </Text>
//       {topUp.msg != '' && (
//         <Text
//           variant="bodySmall"
//           style={{
//             color: MD2Colors.red400,
//             paddingVertical: 5,
//             textAlign: 'center',
//           }}>
//           {topUp.msg}
//         </Text>
//       )}
//       <View style={[styles.frow, styles.fcenter, styles.my1]}>
//         <Button mode="outlined" onPress={() => toggleModal(!showModal)}>
//           Cancel
//         </Button>
//         <PayWithFlutterwave
//           onRedirect={async e => {
//             let log = {
//               title: 'Wallet Topup',
//               desc: 'Wallet topup of ' + money(topUp.value),
//               status: e.status == 'successful' ? 'success' : 'failed',
//               amount: e.status == 'successful' ? topUp.value : 0,
//               info: e,
//               createdAt: new Date(),
//             };
//             await updateFirebase(id, topUp.value - 50, log, true);
//             await adminTransaction({id, info: log});

//             // update the user
//             setUser({
//               ...user,
//               balance: user.balance + (topUp.value - 50),
//             });
//             setTopUp({msg: '', value: 0});
//             toggleModal(!showModal);
//           }}
//           options={{
//             tx_ref: ref,
//             amount: topUp.value,
//             authorization:
//               'FLWPUBK_TEST-3ffa62793f521b1e3134650390f7ea97-X',
//             customer: {
//               name: user?.name,
//               email: user?.email,
//             },
//             currency: 'NGN',
//             payment_options: 'card,banktransfer',
//             customizations: {
//               title: 'Billup',
//               description: 'Wallet payment',
//             },
//           }}
//           customButton={props => (
//             <Button
//               mode="contained"
//               onPress={async () => {
//                 if (topUp.value < 100) {
//                   setTopUp({
//                     ...topUp,
//                     msg: 'Minimum top up value is ' + money(100),
//                   });
//                 } else if (topUp.value > 500000) {
//                   setTopUp({
//                     ...topUp,
//                     msg: 'Maximum top up value is ' + money(50000),
//                   });
//                 } else {
//                   props.onPress();
//                   setTopUp({...topUp, msg: ''});
//                 }
//               }}>
//               Continue
//             </Button>
//           )}
//         />
//       </View>
//     </View>
//   </TouchableOpacity>
// </Modal> */}
