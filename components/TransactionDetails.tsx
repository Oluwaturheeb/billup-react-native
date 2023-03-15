/* eslint-disable @typescript-eslint/no-shadow */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {
  IconButton,
  Text,
  Button,
  Snackbar,
  MD2Colors,
  Avatar,
} from 'react-native-paper';
import {bg, pry, bod, sec, click} from './colors';
import axios from './lib/axios';
import {useUser} from './lib/context';
import {chunk, adminTransaction, money, updateFirebase} from './lib/firestore';
import {transactionResponse} from './schema';
import styles from './styles';

const TransactionDetails = ({route}: {route: any}) => {
  const {id, user} = useUser();
  const {details, info: tInfo, data} = route.params;
  const [btn, setBtn] = useState(false);
  const [status, setStatus] = useState(transactionResponse);
  const [info, setInfo] = useState({show: false, msg: '', type: false});
  const [swap, setSwap] = useState(true);
  const [showModal, toggleModal] = useState(false);

  let beneficiaryType = tInfo?.name;
  // date problem
  let rate = tInfo.foreign?.rate || 1;
  let total = tInfo.total * rate;
  let date = new Date();
  let cal = date.getMonth() + 1,
    month = cal < 10 ? '0' + cal : cal,
    calDate = date.getDate(),
    daydate = calDate < 10 ? '0' + calDate : calDate,
    calHour = date.getHours(),
    hour = calHour < 10 ? '0' + calHour : calHour;
  const requestId = `${date.getFullYear()}${month}${daydate}${hour}${date.getMinutes()}${date.getMilliseconds()}`;

  useEffect(() => {
    if (status?.code === '000') {
      setTimeout(() => setSwap(true), 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.code]);

  const transBtnFunc = async () => {
    setBtn(true);
    setStatus(transactionResponse);
    let req;

    try {
      if (user.balance >= Number(total)) {
        let query = await axios.post('/pay', {
          ...data,
          request_id: requestId,
        });
        req = query.data;
      } else {
        req = {
          code: '1',
          msg: 'due to insufficient wallet balance',
          status: 'failed',
        };
      }
      console.log(req);

      let msg =
        req?.code === '000'
          ? `Purchase of ${tInfo?.name} ${money(total)} was successful.`
          : `Purchase of ${tInfo?.name} ${money(total)} failed${
              req?.msg && ' ' + req.msg
            }.`;

      let log = {
        title: tInfo?.name + ' ' + money(total),
        desc: msg,
        status: req?.code === '000' ? 'success' : 'failed',
        amount: Number(total),
        info: req,
        createdAt: new Date(),
      };
      updateFirebase(id, req?.code === '000' ? Number(total) : 0, log, false);
      await adminTransaction(
        {
          id,
          transaction: log,
          commission: req?.content?.transactions.commission | 0,
        },
        'transaction',
      );
      setStatus(req);
      setInfo({
        show: true,
        msg: req.code == '1' ? 'Insufficient wallet balance' : msg,
        type: req.code == '000' ? true : false,
      });

      setBtn(false);
    } catch (error) {
      console.error(error);
    }
  };

  const TransactionInfo = () => (
    <>
      <TransactionSummary />
      <View style={{marginBottom: 20}}>
        {status.code === '000' && (
          <>
            {tInfo.userInfo?.Customer_Name != undefined && (
              <>
                <View
                  style={[
                    styles.frow,
                    styles.fspace,
                    styles.p2,
                    {
                      backgroundColor: sec,
                      marginVertical: 2,
                      alignItems: 'center',
                    },
                  ]}>
                  <Text style={{color: pry}} variant="bodySmall">
                    Token
                  </Text>
                  {status.purchased_code && (
                    <Text
                      variant="bodyLarge"
                      style={{textAlign: 'center', color: click}}>
                      {chunk(status.purchased_code.split(': ')[1])}
                    </Text>
                  )}
                </View>
                {status?.bonusToken && (
                  <>
                    <View
                      style={[
                        styles.frow,
                        styles.fspace,
                        styles.p2,
                        {
                          backgroundColor: sec,
                          marginVertical: 2,
                          alignItems: 'center',
                        },
                      ]}>
                      <Text style={{color: pry}} variant="bodySmall">
                        Bonus Token
                      </Text>
                      <Text
                        variant="bodyLarge"
                        style={{textAlign: 'center', color: click}}>
                        {chunk(status.purchased_code.split(': ')[1])}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.frow,
                        styles.fspace,
                        styles.p2,
                        {
                          backgroundColor: sec,
                          marginVertical: 2,
                          alignItems: 'center',
                        },
                      ]}>
                      <Text style={{color: pry}} variant="bodySmall">
                        Bonus Token Amount
                      </Text>
                      {status && (
                        <Text
                          variant="bodyLarge"
                          style={{textAlign: 'center', color: click}}>
                          {status.bonusTokenAmount}
                        </Text>
                      )}
                      {status.Pin && (
                        <Text
                          variant="bodyLarge"
                          style={{textAlign: 'center', color: click}}>
                          {chunk(status.Pin.split(': ')[1])}
                        </Text>
                      )}
                    </View>
                  </>
                )}
              </>
            )}
            {data.serviceID == 'waec' && status.cards && (
              <View
                style={[styles.p2, {backgroundColor: sec, marginVertical: 2}]}>
                <View style={[styles.frow, styles.fspace]}>
                  <Text style={{color: pry}} variant="bodySmall">
                    Serial
                  </Text>
                  <Text style={{color: pry}} variant="bodySmall">
                    {chunk(status.cards[0].Serial)}
                  </Text>
                </View>
                <View style={[styles.frow, styles.fspace]}>
                  <Text style={{color: pry}} variant="bodySmall">
                    Pin
                  </Text>
                  <Text style={{color: pry}} variant="bodySmall">
                    {chunk(status.cards[0].Pin)}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
        <View
          style={[
            styles.frow,
            styles.fspace,
            styles.p2,
            {backgroundColor: sec, marginVertical: 2},
          ]}>
          <Text style={{color: pry}} variant="bodySmall">
            Name
          </Text>
          <Text style={{color: pry}} variant="bodySmall">
            {details.name}
          </Text>
        </View>
        <View
          style={[
            styles.frow,
            styles.fspace,
            styles.p2,
            {backgroundColor: sec, marginVertical: 2},
          ]}>
          <Text style={{color: pry}} variant="bodySmall">
            Email
          </Text>
          <Text style={{color: pry}} variant="bodySmall">
            {details.email}
          </Text>
        </View>
        <View
          style={[
            styles.frow,
            styles.fspace,
            styles.p2,
            {backgroundColor: sec, marginVertical: 2},
          ]}>
          <Text style={{color: pry}} variant="bodySmall">
            Designation
          </Text>
          <Text style={{color: pry}} variant="bodySmall">
            {tInfo.userInfo?.Customer_Name != undefined
              ? data.billersCode
              : details.phone}
          </Text>
        </View>
        <View
          style={[
            styles.frow,
            styles.fspace,
            styles.p2,
            {backgroundColor: sec, marginVertical: 2},
          ]}>
          <Text style={{color: pry}} variant="bodySmall">
            Amount
          </Text>
          <Text style={{color: pry}} variant="bodySmall">
            {money(tInfo.total)}
          </Text>
        </View>
        <View
          style={[
            styles.frow,
            styles.fspace,
            styles.p2,
            {backgroundColor: sec, marginVertical: 2},
          ]}>
          <Text style={{color: pry}} variant="bodySmall">
            Convience Fee
          </Text>
          <Text style={{color: pry}} variant="bodySmall">
            {money(tInfo.xtra)}
          </Text>
        </View>
        {tInfo.foreign?.image && (
          <>
            <View
              style={[
                styles.frow,
                styles.fspace,
                styles.p2,
                {backgroundColor: sec, marginVertical: 2},
              ]}>
              <Text style={{color: pry}} variant="bodySmall">
                Rate
              </Text>
              <Text style={{color: pry}} variant="bodySmall">
                {money(tInfo.foreign.rate)}
              </Text>
            </View>
            <View
              style={[
                styles.frow,
                styles.fspace,
                styles.p2,
                {backgroundColor: sec, marginVertical: 2},
              ]}>
              <Text style={{color: pry}} variant="bodySmall">
                Charge Currency
              </Text>
              <Text style={{color: pry}} variant="bodySmall">
                Naira
              </Text>
            </View>
          </>
        )}
        {status?.code !== '000' && (
          <>
            <View
              style={[
                styles.frow,
                styles.fspace,
                styles.p2,
                {backgroundColor: sec, marginVertical: 2},
              ]}>
              <Text style={{color: pry}} variant="bodySmall">
                Total
              </Text>
              <Text style={{color: pry}} variant="bodySmall">
                {money(total)}
              </Text>
            </View>
            <View
              style={[
                styles.frow,
                styles.fspace,
                styles.p2,
                {backgroundColor: sec, marginVertical: 2},
              ]}>
              <Text style={{color: pry}} variant="bodySmall">
                Status
              </Text>
              {!btn && status?.code == '' && (
                <Text variant="bodySmall">Pending</Text>
              )}
              {btn && <Button mode="text" loading={btn} children={undefined} />}
              {!btn && status?.code != '' && (
                <Text style={{color: click}} variant="bodySmall">
                  Transaction Failed
                </Text>
              )}
            </View>
          </>
        )}
        {status?.code === '000' && (
          <>
            <View
              style={[
                styles.frow,
                styles.fspace,
                styles.p2,
                {backgroundColor: sec, marginVertical: 2},
              ]}>
              <Text style={{color: pry}} variant="bodySmall">
                Total
              </Text>
              <Text style={{color: pry}} variant="bodySmall">
                {money(total)}
              </Text>
            </View>
            <View
              style={[
                styles.frow,
                styles.fspace,
                styles.p2,
                {backgroundColor: sec, marginVertical: 2},
              ]}>
              <Text style={{color: pry}} variant="bodySmall">
                Status
              </Text>
              <Text style={{color: pry}} variant="bodySmall">
                Transaction Successful
              </Text>
            </View>
            <View
              style={[
                styles.frow,
                styles.fspace,
                styles.p2,
                {backgroundColor: sec, marginVertical: 2},
              ]}>
              <Text style={{color: pry}} variant="bodySmall">
                Delivery
              </Text>
              <Text style={{color: pry}} variant="bodySmall">
                {status?.content.transactions.status}
              </Text>
            </View>
            <View
              style={[
                styles.frow,
                styles.fspace,
                styles.p2,
                {backgroundColor: sec, marginVertical: 2},
              ]}>
              <Text style={{color: pry}} variant="bodySmall">
                TransactionID
              </Text>
              <Text style={{color: pry}} variant="bodySmall">
                {status.content.transactions.transactionId}
              </Text>
            </View>
          </>
        )}
        {tInfo.type && (
          <Button
            mode="contained"
            disabled={btn}
            style={css.button}
            labelStyle={{color: sec}}
            onPress={() =>
              !user.TWOFAEnable ? transBtnFunc() : toggleModal(!showModal)
            }>
            Complete Transaction
          </Button>
        )}
      </View>
    </>
  );

  const TransactionSummary = () => {
    return (
      <LinearGradient
        colors={[pry + 'dd', pry]}
        end={{x: 1, y: 0}}
        style={{borderRadius: 10, padding: 10, marginVertical: 10}}>
        <View style={[styles.frow, styles.fcenter]}>
          <Avatar.Image source={{uri: tInfo.image}} size={36} />
          <Text
            variant="titleLarge"
            style={{color: MD2Colors.grey300, marginLeft: 10}}>
            {tInfo.name}
          </Text>
        </View>
        <View style={[styles.fcenter, styles.my1]}>
          {tInfo.foreign?.image && (
            <>
              <View style={[styles.frow, styles.fcenter]}>
                <Avatar.Image source={{uri: tInfo.foreign.image}} size={36} />
                <View>
                  <Text
                    variant="titleMedium"
                    style={{color: MD2Colors.grey300, marginLeft: 10}}>
                    {tInfo.foreign.service}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{color: MD2Colors.grey300, marginLeft: 10}}>
                    {tInfo.foreign.product}
                  </Text>
                </View>
              </View>
              {tInfo.foreign.product === 'Mobile Data' && (
                <View style={[styles.fcenter, styles.m1]}>
                  <Text variant="bodySmall" style={{color: MD2Colors.grey300}}>
                    {tInfo.foreign.variation}
                  </Text>
                </View>
              )}
            </>
          )}
          {tInfo.userInfo?.Customer_Name ? (
            <>
              <Text
                variant="bodySmall"
                style={{color: MD2Colors.grey300, fontWeight: 'bold'}}>
                {tInfo.userInfo.Customer_Name}
              </Text>
              {tInfo.userInfo.Current_Bouquet ? (
                <>
                  <Text variant="bodySmall" style={{color: MD2Colors.grey300}}>
                    {tInfo.varName}
                  </Text>
                  <Text variant="bodySmall" style={{color: MD2Colors.grey300}}>
                    {tInfo.action === 'renew' ? 'Renewal' : 'New subscription'}
                  </Text>
                </>
              ) : (
                <Text variant="bodySmall" style={{color: MD2Colors.grey300}}>
                  {tInfo.userInfo.Address}
                </Text>
              )}
            </>
          ) : (
            <>
              {tInfo.varName && (
                <Text variant="bodyMedium" style={{color: MD2Colors.grey300}}>
                  {tInfo.varName}
                </Text>
              )}
            </>
          )}
        </View>
      </LinearGradient>
    );
  };

  const SwapView = () => (
    <View
      style={{
        backgroundColor: MD2Colors.grey200,
        padding: 20,
        width: '100%',
        borderRadius: 5,
        height: '30%',
        top: '30%',
      }}>
      <Text
        variant="bodyLarge"
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        Add to beneficiary
      </Text>
      <View style={[styles.fcenter]}>
        <Text style={{color: pry, fontWeight: 'bold'}} variant="bodyMedium">
          {details.name}
        </Text>
        <Text style={{color: pry}} variant="bodySmall">
          {details.phone}
        </Text>
        <Text style={{color: pry}} variant="bodySmall">
          {beneficiaryType}
        </Text>
      </View>
      <View style={[styles.fcenter, styles.frow, {flex: 1}]}>
        <Button
          onPress={async e => {
            e.stopPropagation();
            // await AsyncStorage.removeItem('beneficiary');
            let beneficiary = await AsyncStorage.getItem('beneficiary');
            if (beneficiary) {
              let list: object = JSON.parse(beneficiary);
              list = {
                ...list,
                [tInfo.type]: {
                  ...list[tInfo.type] ,
                  [details.biller]: route.params,
                },
              };
              await AsyncStorage.setItem('beneficiary', JSON.stringify(list));
            } else {
              await AsyncStorage.setItem(
                'beneficiary',
                JSON.stringify({
                  [tInfo.type]: {[details.biller]: route.params},
                }),
              );
            }
          }}
          icon="account-plus"
          style={{backgroundColor: pry, margin: 5}}
          labelStyle={{color: '#ddd'}}>
          Add to beneficiary
        </Button>
      </View>
    </View>
  );

  const BeneficiaryModal = () => {
    const [showModal, setShowModal] = useState(true);
    useEffect(() => {
      (async () => {
        let beneficiary = await AsyncStorage.getItem('beneficiary');
        if (beneficiary) {
          let benList: any = JSON.parse(beneficiary);
          let keys = Object.keys(benList);

          let item = keys.filter(item => {
            if (item == tInfo.type) {
              if (benList[tInfo.type][details.biller]) return true;
            }
          });

          setShowModal(item.length > 0 ? false : true);
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        {showModal && (
          <Modal
            visible={swap}
            animationType="slide"
            onDismiss={() => setSwap(!swap)}
            transparent={true}>
            <TouchableOpacity
              onPress={() => setSwap(!swap)}
              style={{
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, .3)',
                padding: 20,
              }}>
              <SwapView />
            </TouchableOpacity>
          </Modal>
        )}
      </>
    );
  };

  const TFAModal = () => {
    const [text, setText] = useState({msg: '', text: '', tries: 3});
    const fn2FA = async () => {
      console.log(text.text == user.TWOFA, text.text, text.tries);
      if (text.tries === 0) {
        return;
      }
      if (user.TWOFA == text.text) {
        toggleModal(!showModal);
        transBtnFunc();
      } else {
        setText({
          ...text,
          msg: `Invalid 2-FA pin supplied tries remain ${text.tries - 1}`,
          tries: text.tries - 1,
        });
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
                width: '80%',
                marginLeft: '10%',
                borderRadius: 5,
                minHeight: '30%',
                top: '30%',
              }}>
              <Text variant="titleLarge" style={{textAlign: 'center'}}>
                Confirm 2-FA
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
                  Confirm
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
      style={{flex: 1, paddingHorizontal: 10}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <BeneficiaryModal />
        <TransactionInfo />
      </ScrollView>
      {info.show && (
        <View
          style={[
            styles.fcenter,
            {zIndex: 1000, position: 'absolute', bottom: '0%', width: '100%'},
          ]}>
          <Snackbar
            style={{width: '100%'}}
            elevation={2}
            visible={info.show}
            onDismiss={() => setInfo({...info, show: !info.show})}
            icon="close"
            onIconPress={() => setInfo({...info, show: !info.show})}
            duration={30000}>
            <View style={[styles.frow, styles.fVertCenter]}>
              {info.type ? (
                <IconButton
                  style={{margin: -10}}
                  icon="checkbox-multiple-marked-circle-outline"
                  size={20}
                  iconColor="white"
                />
              ) : (
                <IconButton
                  style={{margin: -10}}
                  icon="close-circle"
                  size={20}
                  iconColor={MD2Colors.red300}
                />
              )}
              <Text
                variant="bodySmall"
                style={{color: 'white', marginLeft: 10}}>
                {info.msg}
              </Text>
            </View>
          </Snackbar>
        </View>
      )}
      <TFAModal />
    </LinearGradient>
  );
};

const css = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: bg,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: pry,
    fontSize: 24,
    marginTop: 20,
  },
  headerBorder: {
    width: 60,
    borderBottomColor: bod,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  varCard: {
    width: '31.5%',
    elevation: 4,
    height: 100,
    marginVertical: 3,
    marginHorizontal: 3,
    backgroundColor: sec,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {textAlign: 'center', marginTop: 3, color: pry},
  inputContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: pry,
  },
  input: {
    backgroundColor: sec,
    width: '49%',
    ...styles.bround,
  },
  phoneInput: {
    marginTop: 10,
    backgroundColor: sec,
    ...styles.bround,
  },
  button: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#0c4836',
    marginTop: 10,
    marginHorizontal: 3,
  },
});

export default TransactionDetails;
