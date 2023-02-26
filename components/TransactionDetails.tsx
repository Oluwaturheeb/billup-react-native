/* eslint-disable @typescript-eslint/no-shadow */
import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
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
  const [swap, setSwap] = useState(false);

  console.log(status.content.transactions.commission);

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
      if (user.balance > Number(total)) {
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
          transaction: req,
          commission: req.content.transactions.commission,
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
      <Text variant="titleLarge" style={{marginBottom: 7, textAlign: 'center'}}>
        Transaction Details
      </Text>
      <TransactionSummary />
      <View style={{marginTop: 10, marginBottom: 20}}>
        {status.code === '000' && (
          <>
            {tInfo.userInfo.Customer_Name != undefined && (
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
                {status.token && (
                  <Text
                    variant="bodyLarge"
                    style={{textAlign: 'center', color: click}}>
                    {chunk(status.token.split(': ')[1])}
                  </Text>
                )}
                {status.tokens && (
                  <Text
                    variant="bodyLarge"
                    style={{textAlign: 'center', color: click}}>
                    {chunk(status.tokens[0])}
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
            {tInfo.userInfo.Customer_Name != undefined
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
        {!tInfo.type && (
          <Button
            mode="contained"
            disabled={btn}
            style={css.button}
            labelStyle={{color: sec}}
            onPress={transBtnFunc}>
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
        style={{borderRadius: 10, padding: 10}}>
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
    <View style={[{marginTop: '50%'}]}>
      <Text
        variant="titleLarge"
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        Add to beneficiary
      </Text>
      <View style={[styles.fcenter]}>
        <Text style={{color: pry, fontWeight: 'bold'}} variant="bodySmall">
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
          style={{margin: 5}}
          labelStyle={{color: pry}}
          mode="outlined"
          onPress={() => setSwap(!swap)}>
          Close
        </Button>
        <Button
          icon="account-plus"
          style={{backgroundColor: pry, margin: 5}}
          labelStyle={{color: '#ddd'}}>
          Add to beneficiary
        </Button>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[sec + '44', sec + 'aa']}
      style={{flex: 1, paddingHorizontal: 10}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {swap ? <SwapView /> : <TransactionInfo />}
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
