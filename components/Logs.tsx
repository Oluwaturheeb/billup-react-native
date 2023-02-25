import React, {useState, useMemo} from 'react';
import {FlatList, Modal, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Button,
  IconButton,
  MD2Colors,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import {click, pry, sec} from './colors';
import {useUser} from './lib/context';
import styles from './styles';
import {Logs as TLog, TransactionResponse} from './interfaces';
import {logs as SLog} from './schema';
import {dateFormat, money} from './lib/firestore';
import {ScrollView} from 'react-native-gesture-handler';

const Logs = () => {
  const {
    user: {logs},
  } = useUser();
  const [action, setAction] = useState({show: false, data: SLog});
  const [transAll, setTransAll] = useState({
    success: 0,
    failed: 0,
    paySuccess: 0,
    payFailed: 0,
  });

  const LogAction = () => {
    let {data} = action;
    let info: TransactionResponse = data.info;
    console.log(info);
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
          <View
            style={{
              backgroundColor: MD2Colors.grey300,
              width: '100%',
              borderRadius: 10,
              height: '90%',
              top: '7%',
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
                size={180}
              />
            </View>
            <Text
              variant="titleLarge"
              style={{textAlign: 'center', color: pry, marginBottom: 10}}>
              Transaction Information
            </Text>
            <Text variant="bodySmall" style={{textAlign: 'center', color: pry}}>
              {data.title}
            </Text>
            {info.token && (
              <Text
                variant="bodyLarge"
                style={{textAlign: 'center', color: click}}>
                {info.token}
              </Text>
            )}
            <Text variant="bodySmall" style={{textAlign: 'center', color: pry}}>
              {data.desc}
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{marginBottom: 50}}>
              <View style={[styles.frow, styles.fspace, styles.p1]}>
                <Text
                  variant="bodySmall"
                  style={{textAlign: 'center', color: pry}}>
                  Amount
                </Text>
                <Text
                  variant="bodySmall"
                  style={{textAlign: 'center', color: pry}}>
                  {money(data.amount)}
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
                  {dateFormat(data.createdAt.seconds)}
                </Text>
              </View>
            </ScrollView>
          </View>
          <Button
            onPress={() => setAction({...action, show: false})}
            mode="contained"
            compact={false}
            style={{
              backgroundColor: pry + 'cc',
              width: 100,
              alignSelf: 'center',
            }}>
            OK
          </Button>
        </View>
      </Modal>
    );
  };

  const LogItems = ({item, index}: {item: TLog; index: number}) => {
    return (
      <TouchableRipple
        key={index}
        rippleColor={pry}
        style={{paddingVertical: 5}}
        onPress={() => setAction({...action, show: true, data: item})}>
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
            <Text variant="bodySmall">{item.title}</Text>
            <Text variant="bodySmall">{item.desc}</Text>
          </View>
        </View>
      </TouchableRipple>
    );
  };

  const memoFunc = () => {
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
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => memoFunc(), [logs]);

  return (
    <LinearGradient colors={[sec + '44', sec + 'aa']} style={{flex: 1}}>
      {action.show && <LogAction />}
      <FlatList
        ListHeaderComponent={
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
        }
        ItemSeparatorComponent={() => (
          <View
            style={{
              borderColor: MD2Colors.grey300,
              borderBottomWidth: 1,
            }}
          />
        )}
        data={logs.reverse()}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        renderItem={({item, index}) => <LogItems item={item} index={index} />}
        contentContainerStyle={{padding: 10}}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

export default Logs;
