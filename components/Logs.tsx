import React, {useState, useMemo, useEffect} from 'react';
import {FlatList, Modal, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Button,
  IconButton,
  MD2Colors,
  Searchbar,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import {click, pry, sec} from './colors';
import {useUser} from './lib/context';
import styles from './styles';
import {Logs as TLog, TransactionResponse} from './interfaces';
import {logs as SLog} from './schema';
import {chunk, dateFormat, money, users} from './lib/firestore';
import {ScrollView} from 'react-native-gesture-handler';
import filter from 'lodash.filter';

const Logs = ({route}: {route: any}) => {
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

  const ViewLog = () => {
    let {data} = action;
    let info: TransactionResponse | undefined = data.info;

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
              <Text
                variant="bodySmall"
                style={{textAlign: 'center', color: pry}}>
                {data.title}
              </Text>
              <Text
                variant="bodySmall"
                style={{textAlign: 'center', color: pry}}>
                {data.desc}
              </Text>
              {!info?.cards && info?.purchased_code && (
                <Text
                  variant="bodyLarge"
                  style={{textAlign: 'center', color: click}}>
                  {chunk(info.purchased_code.split(': ')[1])}
                </Text>
              )}
              {info?.cards && info?.purchased_code && (
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
                {info?.code != '1' && info?.code && (
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
              </View>
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

  const LogItems = ({item, index}: {item: any; index: number}) => {
    if (route.params.account != 'user') item = item.transaction;
    return (
      <TouchableRipple
        key={index}
        rippleColor={pry}
        style={{padding: 7}}
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
            <Text variant="bodySmall">{item?.title}</Text>
            <Text variant="bodySmall">{item?.desc}</Text>
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

  const UserStats = () => (
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

  const Search = () => {
    const [searchFilter, setSearchFilter] = useState<any>([]);
    const [key, setKey] = useState('');
    const [data, setData] = useState<{
      loading: boolean;
      data: any;
    }>({loading: true, data: logs});

    const searchFn = (text: string) => {
      setKey(text);
      let searchResult: TLog[] = [];
      filter(data.data, (item: any) => {
        if (route.params.account != 'user') {
          var obj: TLog = item.transaction;
        } else {
          var obj: TLog = item;
        }
        let {title, desc, info} = obj;

        if (typeof text === 'string') {
          if (
            title.toLowerCase().includes(text) ||
            desc.toLowerCase().includes(text) ||
            info?.token ||
            info?.transaction_date?.date.toString().includes(text)
          ) {
            searchResult.push(obj);
          }
        } else {
          if (
            info?.amount ||
            info?.requestId ||
            info?.content?.transactions?.transactionId ||
            info?.transaction_date?.date.toString().includes(text)
          ) {
            searchResult.push(obj);
          }
        }
      });
      setSearchFilter(searchResult);
    };

    const reRender = data.loading === false && true;
    useEffect(() => {
      (async () => {
        if (route.params.account != 'user') {
          let trans: any = await users.doc('PXlO3KDmrEwbDTwsprSM').get();
          trans = trans.data();
          setData({
            loading: false,
            data: trans.payments.concat(trans.transactions),
          });
        }
      })();
    }, [reRender]);

    return (
      <View>
        <Searchbar
          placeholder="Search"
          value={key}
          onChangeText={text => searchFn(text)}
          style={{marginBottom: 10}}
          iconColor={pry + '99'}
        />
        <FlatList
          ItemSeparatorComponent={() => (
            <View
              style={{
                borderColor: MD2Colors.grey300,
                borderBottomWidth: 1,
              }}
            />
          )}
          data={key ? searchFilter : data.data}
          renderItem={({item, index}) => <LogItems item={item} index={index} />}
        />
      </View>
    );
  };

  return (
    <>
      {action.show && <ViewLog />}
      {route.params != undefined ? (
        <Search />
      ) : (
        <LinearGradient colors={[sec + '44', sec + 'aa']} style={{flex: 1}}>
          <FlatList
            ListHeaderComponent={<UserStats />}
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
            renderItem={({item, index}) => (
              <LogItems item={item} index={index} />
            )}
            contentContainerStyle={{padding: 10}}
            showsVerticalScrollIndicator={false}
          />
        </LinearGradient>
      )}
    </>
  );
};

export default Logs;
