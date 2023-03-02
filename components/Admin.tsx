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
import {Logs as TLog, TransactionResponse} from './interfaces';
import {adminData, logs as SLog} from './schema';
import {chunk, dateFormat, money, users} from './lib/firestore';
import {ScrollView} from 'react-native-gesture-handler';
import {Network} from './services/Components';

const Logs = ({navigation}: {navigation: any; route: any}) => {
  const time = new Date().getHours();
  const [action, setAction] = useState({show: false, data: SLog});
  const [data, setData] = useState({loading: true, data: adminData});
  const [tab, setTab] = useState({main: true, log: false});
  // const [transAll, setTransAll] = useState({
  //   success: 0,
  //   failed: 0,
  //   paySuccess: 0,
  //   payFailed: 0,
  // });

  useEffect(() => {
    (async () => {
      let trans = await users.doc('PXlO3KDmrEwbDTwsprSM').get();
      setData({loading: false, data: trans.data()});
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const LogAction = () => {
    const [techDetails, setTechDetails] = useState(false);
    let {data} = action;
    let info: TransactionResponse = data.transaction;

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
                  data.status !== 'failed'
                    ? pry + 'dd'
                    : MD2Colors.redA200 + 'dd',
                borderTopStartRadius: 10,
                borderTopEndRadius: 10,
                alignItems: 'center',
              }}>
              <IconButton
                icon={
                  data.status !== 'failed'
                    ? 'checkbox-marked-circle-outline'
                    : 'close-outline'
                }
                iconColor={MD2Colors.grey300}
                size={120}
              />
            </View>
            <View style={{padding: 16}}>
              <Text
                variant="titleLarge"
                style={{textAlign: 'center', color: pry, marginBottom: 10}}>
                Transaction Information
              </Text>
              <View style={[styles.frow, styles.fspace, styles.my1]}>
                <Button
                  onPress={() =>
                    navigation.navigate('CustomerProfile', data.id)
                  }
                  style={{backgroundColor: pry}}
                  labelStyle={{color: MD2Colors.grey300}}
                  icon="account">
                  Customer Profile
                </Button>
                <Button
                  onPress={() => setTechDetails(!techDetails)}
                  style={{backgroundColor: pry}}
                  icon="eye"
                  labelStyle={{color: MD2Colors.grey300}}>
                  {!techDetails ? 'See' : 'Close'} Technical Details
                </Button>
              </View>
              {!techDetails ? (
                <>
                  <Text
                    variant="bodySmall"
                    style={{textAlign: 'center', color: pry}}>
                    {info.title}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{textAlign: 'center', color: pry}}>
                    {info.desc}
                  </Text>
                  {!info.cards && info.purchased_code && (
                    <Text
                      variant="bodyLarge"
                      style={{textAlign: 'center', color: click}}>
                      {chunk(info.purchased_code.split(': ')[1])}
                    </Text>
                  )}
                  {info.cards && info.purchased_code && (
                    <>
                      {info.cards.map((item, index) => (
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
                    <View style={[styles.frow, styles.fspace, styles.p1]}>
                      <Text
                        variant="bodySmall"
                        style={{textAlign: 'center', color: pry}}>
                        Commission
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{textAlign: 'center', color: pry}}>
                        {money(info.info.content.transactions.commission)}
                      </Text>
                    </View>
                    <View style={[styles.frow, styles.fspace, styles.p1]}>
                      <Text
                        variant="bodySmall"
                        style={{textAlign: 'center', color: pry}}>
                        Transaction Status
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{textAlign: 'center', color: pry}}>
                        {data.status === 'failed' ? 'Failed' : 'Successful'}
                      </Text>
                    </View>
                    {info.code != '1' && info.code && (
                      <>
                        <View style={[styles.frow, styles.fspace, styles.p1]}>
                          <Text
                            variant="bodySmall"
                            style={{textAlign: 'center', color: pry}}>
                            Transaction ID
                          </Text>
                          <Text
                            variant="bodySmall"
                            style={{textAlign: 'center', color: pry}}>
                            {info.content.transactions?.transactionId}
                          </Text>
                        </View>
                        <View style={[styles.frow, styles.fspace, styles.p1]}>
                          <Text
                            variant="bodySmall"
                            style={{textAlign: 'center', color: pry}}>
                            Unique Element
                          </Text>
                          <Text
                            variant="bodySmall"
                            style={{textAlign: 'center', color: pry}}>
                            {info.content.transactions?.unique_element}
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
                </>
              ) : (
                <View style={{flex: 1}}>
                  <Text selectable={true} variant="bodySmall">{JSON.stringify(info.info, null, 2)}</Text>
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

  const LogItems = ({item, index}: {item: TLog; index: number}) => {
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

  /* const memoFunc = () => {
    let trans = {
      success: 0,
      failed: 0,
      paySuccess: 0,
      payFailed: 0,
    };

    logs.map((item: any, index: number) => {
      if (item?.title.includes('Topup')) {
        if (item.status === 'success') {
          let cal = Number(trans.paySuccess) + Number(item.amount);
          trans = {...trans, paySuccess: cal};
        } else {
          let cal = Number(trans.payFailed) + Number(item.amount);
          trans = {...trans, payFailed: cal};
        }
      } else {
        if (item.status === 'failed') {
          if (Number.isInteger(item.amount)) {
            let cal = Number(trans.failed) + Number(item.amount);
            trans = {...trans, failed: cal};
          }
        } else {
          if (Number.isInteger(item.amount)) {
            let cal = Number(trans.success) + Number(item.amount);
            trans = {...trans, success: cal};
          }
        }
      }
      index + 1 === logs.length && setTimeout(() => setTransAll(trans), 1000);
    });
  }; */

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useMemo(() => memoFunc(), []);

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

  const PaymentHeader = () => {
    return (
      <LinearGradient
        colors={[pry + 'dd', pry]}
        end={{x: 1, y: 0}}
        style={{borderRadius: 10, padding: 10, marginBottom: 10}}>
        <View
          style={[
            styles.frow,
            {marginBottom: 20, justifyContent: 'space-evenly'},
          ]}>
          <View style={styles.fcenter}>
            <IconButton
              icon="cash-multiple"
              style={{marginVertical: -5}}
              size={30}
              iconColor={MD2Colors.grey300}
            />
            <Text variant="bodySmall" style={{color: MD2Colors.grey300}}>
              {money(transAll.paySuccess)}
            </Text>
            <Text variant="bodySmall" style={{color: MD2Colors.grey300}}>
              Total Payment
            </Text>
          </View>
          <View style={styles.fcenter}>
            <IconButton
              icon="cash-remove"
              style={{marginVertical: -5}}
              size={30}
              iconColor={MD2Colors.grey300}
            />
            <Text variant="bodySmall" style={{color: MD2Colors.grey300}}>
              {money(transAll.payFailed)}
            </Text>
            <Text variant="bodySmall" style={{color: MD2Colors.grey300}}>
              Failed Payment
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.frow,
            {marginBottom: 20, justifyContent: 'space-evenly'},
          ]}>
          <View style={styles.fcenter}>
            <IconButton
              icon="cash-check"
              style={{marginVertical: -5}}
              size={30}
              iconColor={MD2Colors.grey300}
            />
            <Text variant="bodySmall" style={{color: MD2Colors.grey300}}>
              {money(transAll.success)}
            </Text>
            <Text variant="bodyMedium" style={{color: MD2Colors.grey300}}>
              Successful Transactions
            </Text>
          </View>
          <View style={styles.fcenter}>
            <IconButton
              icon="cash-remove"
              style={{marginVertical: -5}}
              size={30}
              iconColor={MD2Colors.grey300}
            />
            <Text variant="bodySmall" style={{color: MD2Colors.grey300}}>
              {money(transAll.failed)}
            </Text>
            <Text variant="bodyMedium" style={{color: MD2Colors.grey300}}>
              Failed Transactions
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  };

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
    // height: height,
    // top: height,
  },
});

export default Logs;
