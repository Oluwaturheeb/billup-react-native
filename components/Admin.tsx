import React, {useState, useMemo, useEffect} from 'react';
import {FlatList, Modal, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Avatar,
  Button,
  IconButton,
  MD2Colors,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import {click, pry, sec} from './colors';
import styles from './styles';
import {adminData, adminLog} from './schema';
import {chunk, dateFormat, money, users} from './lib/firestore';
import {ScrollView} from 'react-native-gesture-handler';
import {Network} from './services/Components';

const Admin = ({navigation}: {navigation: any; route: any}) => {
  const time = new Date().getHours();
  const [action, setAction] = useState({show: false, data: adminLog});
  const [data, setData] = useState({loading: true, data: adminData});
  const [tab, setTab] = useState({main: true, log: false});

  useEffect(() => {
    (async () => {
      let trans = await users.doc('PXlO3KDmrEwbDTwsprSM').get();
      setData({loading: false, data: trans.data()});
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const LogAction = () => {
    const [techDetails, setTechDetails] = useState(false);
    let logData = action.data;
    let info = logData.transaction;

    return (
      <Modal
        visible={action.show}
        animationType="slide"
        onDismiss={() => setAction({...action, show: !action.show})}
        transparent={true}>
        <View
          style={{
            height: '100%',
            padding: 20,
            backgroundColor: 'rgba(0, 0, 0, .3)',
          }}>
          <ScrollView
            style={{
              backgroundColor: MD2Colors.grey300,
              width: '100%',
              borderRadius: 10,
              height: '93%',
              top: '5%',
            }}>
            <View
              style={{
                backgroundColor:
                  info.status !== 'failed'
                    ? pry + 'dd'
                    : MD2Colors.redA200 + 'dd',
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
                alignItems: 'center',
              }}>
              <IconButton
                icon={
                  info.status !== 'failed'
                    ? 'checkbox-marked-circle-outline'
                    : 'close-outline'
                }
                iconColor={MD2Colors.grey300}
                size={120}
              />
            </View>
            <View style={{padding: 16}}>
              <View style={[styles.frow, styles.fspace, styles.my1]}>
                <Button
                  onPress={() =>
                    navigation.navigate('CustomerProfile', logData.userId)
                  }
                  style={{backgroundColor: pry}}
                  labelStyle={{color: MD2Colors.grey300}}
                  icon="account">
                  Customer Profile
                </Button>
                <Button
                  onPress={() => setTechDetails(!techDetails)}
                  style={{backgroundColor: pry}}
                  icon={!techDetails ? 'eye-outline' : 'eye-off-outline'}
                  labelStyle={{color: MD2Colors.grey300}}>
                  {!techDetails ? 'Technical Details' : 'Close Details'}
                </Button>
              </View>
              {!techDetails ? (
                <View>
                  <Text
                    variant="bodyLarge"
                    style={{textAlign: 'center', color: pry}}>
                    {info.title}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{textAlign: 'center', color: pry}}>
                    {info.desc}
                  </Text>
                  {!info.info?.cards && info.info?.purchased_code && (
                    <Text
                      variant="bodyLarge"
                      style={{textAlign: 'center', color: click}}>
                      {chunk(info.info?.purchased_code.split(': ')[1])}
                    </Text>
                  )}
                  {info.info?.cards && info.info?.purchased_code && (
                    <>
                      {info.info.cards.map((item, index) => (
                        <View
                          key={index}
                          style={[
                            styles.p2,
                            {backgroundColor: click, marginVertical: 2},
                          ]}>
                          <View style={[styles.frow, styles.fspace]}>
                            <Text
                              style={{color: MD2Colors.grey200}}
                              variant="bodySmall">
                              Serial
                            </Text>
                            <Text
                              style={{color: MD2Colors.grey200}}
                              variant="bodySmall">
                              {chunk(item.Serial)}
                            </Text>
                          </View>
                          <View style={[styles.frow, styles.fspace]}>
                            <Text
                              style={{color: MD2Colors.grey200}}
                              variant="bodySmall">
                              Pin
                            </Text>
                            <Text
                              style={{color: MD2Colors.grey200}}
                              variant="bodySmall">
                              {chunk(item.Pin)}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </>
                  )}
                  <View>
                    <View style={[styles.frow, styles.fspace, styles.p1]}>
                      <Text
                        variant="bodySmall"
                        style={{textAlign: 'center', color: pry}}>
                        Amount
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{textAlign: 'center', color: pry}}>
                        {money(info.amount)}
                      </Text>
                    </View>
                    {info.info?.content && (
                      <View style={[styles.frow, styles.fspace, styles.p1]}>
                        <Text
                          variant="bodySmall"
                          style={{textAlign: 'center', color: pry}}>
                          Commission
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={{textAlign: 'center', color: pry}}>
                          {money(
                            info.info?.content.transactions.commission || 0,
                          )}
                        </Text>
                      </View>
                    )}
                    <View style={[styles.frow, styles.fspace, styles.p1]}>
                      <Text
                        variant="bodySmall"
                        style={{textAlign: 'center', color: pry}}>
                        Transaction Status
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{textAlign: 'center', color: pry}}>
                        {info.status === 'failed' ? 'Failed' : 'Successful'}
                      </Text>
                    </View>
                    {info.info?.code != '1' && info.info?.code && (
                      <>
                        <View style={[styles.frow, styles.fspace, styles.p1]}>
                          <Text
                            variant="bodySmall"
                            style={{textAlign: 'center', color: pry}}>
                            Transaction ID
                          </Text>
                          <Text
                            selectable={true}
                            variant="bodySmall"
                            style={{textAlign: 'center', color: pry}}>
                            {info.info?.content.transactions.transactionId}
                          </Text>
                        </View>
                        <View style={[styles.frow, styles.fspace, styles.p1]}>
                          <Text
                            variant="bodySmall"
                            style={{textAlign: 'center', color: pry}}>
                            Unique Element
                          </Text>
                          <Text
                            selectable={true}
                            variant="bodySmall"
                            style={{textAlign: 'center', color: pry}}>
                            {info.info.content.transactions?.unique_element}
                          </Text>
                        </View>
                      </>
                    )}
                    <View style={[styles.frow, styles.fspace, styles.p1]}>
                      <Text
                        variant="bodySmall"
                        style={{textAlign: 'center', color: pry}}>
                        Transaction Date
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{textAlign: 'center', color: pry}}>
                        {dateFormat(info.createdAt.seconds)}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={{flex: 1}}>
                  <Text selectable={true} variant="bodySmall">
                    {JSON.stringify(info.info, null, 4)}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
          <Button
            onPress={() => setAction({...action, show: false})}
            mode="contained"
            compact={false}
            style={{
              backgroundColor: pry + 'cc',
              width: 100,
              alignSelf: 'center',
              marginTop: -10,
            }}>
            OK
          </Button>
        </View>
      </Modal>
    );
  };

  const LogItems = ({item, index}: {index: number; item: any}) => {
    let {desc, title} = item.transaction;
    return (
      <TouchableRipple
        key={index}
        rippleColor={pry}
        style={{paddingVertical: 5, backgroundColor: MD2Colors.grey100}}
        onPress={() => setAction({...action, show: true, data: item})}>
        <View style={[styles.frow, {alignItems: 'center'}]}>
          <IconButton
            icon={
              item?.status !== 'failed'
                ? 'checkbox-multiple-marked-circle-outline'
                : 'close-outline'
            }
            iconColor={
              item?.status !== 'failed' ? pry + '99' : MD2Colors.redA200
            }
            size={30}
            style={{marginVertical: -10}}
          />
          <View style={{flex: 1}}>
            <Text variant="bodySmall">{title}</Text>
            <Text variant="bodySmall">{desc}</Text>
          </View>
        </View>
      </TouchableRipple>
    );
  };

  const Greeting = () => (
    <View style={css.jumbo}>
      <View
        style={[
          styles.frow,
          styles.fcenter,
          {marginTop: -10, marginBottom: 16},
        ]}>
        <Avatar.Text
          label="DT"
          size={48}
          style={{backgroundColor: MD2Colors.grey300}}
        />
        <View style={{marginTop: 8, marginLeft: 8}}>
          {time < 12 && (
            <Text variant="bodyMedium" style={css.greetingText}>
              Good morning, Admin.
            </Text>
          )}
          {time >= 12 && time < 16 && (
            <Text style={css.greetingText} variant="bodyMedium">
              Good afternoon, Admin.
            </Text>
          )}
          {time >= 16 && time >= 16 && (
            <Text style={css.greetingText} variant="bodyMedium">
              Good evening, Admin.
            </Text>
          )}
          <Text variant="bodySmall" style={[css.greetingText, {fontSize: 13}]}>
            At your service anytime!
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
          Transactions
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
          Payments
        </Text>
      </View>
      <View style={{marginTop: 16}}>
        <Text
          variant="bodyLarge"
          style={{color: MD2Colors.grey300, textAlign: 'center'}}>
          Commission
        </Text>
        <Text
          variant="headlineMedium"
          style={{color: sec + 'ee', textAlign: 'center'}}>
          {money(data.data.commission)}
        </Text>
        <View style={[styles.frow, styles.fcenter]} />
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[pry + 'cc', pry + 'ff', MD2Colors.green900]}
      style={{flex: 1}}>
      {action.show && <LogAction />}
      <Network />
      <FlatList
        ListHeaderComponent={<Greeting />}
        ItemSeparatorComponent={() => (
          <View
            style={{
              borderColor: MD2Colors.grey300,
              borderBottomWidth: 1,
            }}
          />
        )}
        data={
          data.loading
            ? []
            : tab.main
            ? data.data.transactions
            : data.data.payments
        }
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        renderItem={({item, index}) => <LogItems item={item} index={index} />}
        contentContainerStyle={{padding: 10}}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
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
  },
});

export default Admin;
