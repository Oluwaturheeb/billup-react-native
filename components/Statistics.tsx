import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  IconButton,
  MD2Colors,
  Text,
} from 'react-native-paper';
import {money, users} from './lib/firestore';
import {
  AdminLog,
  AdminUser,
  Logs,
  TransactionResponse,
  User,
} from './interfaces';
import LinearGradient from 'react-native-linear-gradient';
import {pry} from './colors';
import {statistics} from './schema';
import styles from './styles';
import {FlatList} from 'react-native-gesture-handler';

const Statistics = ({navigation}: {navigation: any}) => {
  const [stats, setStats] = useState(statistics);
  const [showStat, setShowStat] = useState({id: '', show: false});

  useEffect(() => {
    const memoFunc = (user: any) => {
      let trans = {
        successAmount: 0,
        failedAmount: 0,
        paySuccessAmount: 0,
        payFailedAmount: 0,
        successfulTransactionCount: 0,
        failedTransactionCount: 0,
      };

      let allUsersTrans: any = [];

      let {logs}: {logs: any} = user;
      let i = 1;

      //loop
      logs.map((item: Logs) => {
        if (item.title.includes('Topup')) {
          if (item.status === 'success') {
            let cal = Number(trans.paySuccessAmount) + Number(item.amount);
            trans = {
              ...trans,
              paySuccessAmount: cal,
              successfulTransactionCount: trans.successfulTransactionCount + 1,
            };
          } else {
            let cal = Number(trans.payFailedAmount) + Number(item.amount);
            trans = {
              ...trans,
              payFailedAmount: cal,
              failedTransactionCount: trans.failedTransactionCount + 1,
            };
          }
        } else {
          if (item.status === 'failed') {
            if (Number.isInteger(item.amount)) {
              let cal = Number(trans.failedAmount) + Number(item.amount);
              trans = {
                ...trans,
                failedAmount: cal,
                failedTransactionCount: trans.failedTransactionCount + 1,
              };
            }
          } else {
            if (Number.isInteger(item.amount)) {
              let cal = Number(trans.successAmount) + Number(item.amount);
              trans = {
                ...trans,
                successAmount: cal,
                successfulTransactionCount:
                  trans.successfulTransactionCount + 1,
              };
            }
          }
        }

        if (i == logs.length) {
          allUsersTrans.push(trans);
        }
        i++;
      });
      return allUsersTrans[0];
    };

    (async () => {
      let stat = {
        successAmount: 0,
        failedAmount: 0,
        paySuccessAmount: 0,
        payFailedAmount: 0,
        successfulTransactionCount: 0,
        failedTransactionCount: 0,
      };
      let allUsers = await users.get(),
        transformedData: any = [];

      //loop
      allUsers.docs.map(user => {
        if (user.id != 'PXlO3KDmrEwbDTwsprSM') {
          let eachUser = user.data();
          let item = memoFunc(eachUser);
          stat = {
            successAmount: stat.successAmount + item.successAmount,
            failedAmount: stat.failedAmount + item.failedAmount,
            paySuccessAmount: stat.paySuccessAmount + item.paySuccessAmount,
            payFailedAmount: stat.payFailedAmount + item.payFailedAmount,
            successfulTransactionCount:
              stat.successfulTransactionCount + item.successfulTransactionCount,
            failedTransactionCount:
              stat.failedTransactionCount + item.failedTransactionCount,
          };

          transformedData.push({
            photo: eachUser.photo,
            name: eachUser.name,
            email: eachUser.email,
            balance: eachUser.balance,
            transactions: item,
            id: user.id,
          });
        }
      });

      setStats({
        loading: false,
        users: transformedData,
        stats: stat,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats.users.length]);

  const TransStats = () => {
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
              icon="account-group"
              style={{marginVertical: -5}}
              size={30}
              iconColor={MD2Colors.grey300}
            />
            <Text variant="bodySmall" style={{color: MD2Colors.grey300}}>
              {stats.users.length}
            </Text>
            <Text variant="bodySmall" style={{color: MD2Colors.grey300}}>
              All Customers
            </Text>
          </View>
          <View style={styles.fcenter}>
            <IconButton
              icon="cash-multiple"
              style={{marginVertical: -5}}
              size={30}
              iconColor={MD2Colors.grey300}
            />
            <Text variant="bodySmall" style={{color: MD2Colors.grey300}}>
              {money(stats.stats.paySuccessAmount)}
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
              {money(stats.stats.payFailedAmount)}
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
              {money(stats.stats.successAmount)}
            </Text>
            <Text variant="bodySmall" style={{color: MD2Colors.grey300}}>
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
              {money(stats.stats.failedAmount)}
            </Text>
            <Text variant="bodySmall" style={{color: MD2Colors.grey300}}>
              Failed Transactions
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const CustomersList = ({data}: {data: AdminUser}) => {
    return (
      <Card
        onPress={() =>
          setShowStat({
            id: showStat.id === data.id ? '' : data.id,
            show: showStat.id === data.id ? false : true,
          })
        } style={{marginHorizontal: 10, paddingBottom: 5}}>
        <Card.Content style={[styles.frow, {marginBottom: 10}]}>
          <Avatar.Image source={{uri: data.photo}} style={{marginRight: 10}} />
          <View style={{flex: 1}}>
            <Text variant="bodyLarge" style={{color: pry}}>
              {data.name}
            </Text>
            <View>
              {showStat.id != data.id && (
                <>
                  <Text variant="bodySmall" style={{color: pry}}>
                    {data.email}
                  </Text>
                  <Text variant="bodySmall" style={{color: pry}}>
                    {`Balance ${money(data.balance)}`}
                  </Text>
                </>
              )}
              {data.id === showStat.id && showStat.show && (
                <View>
                  <Text variant="bodySmall" style={{color: pry}}>
                    {`Successful Transactions ${data.transactions.successfulTransactionCount}`}
                  </Text>
                  <Text variant="bodySmall" style={{color: pry}}>
                    {`Failed Transactions ${data.transactions.failedTransactionCount}`}
                  </Text>
                  <Text variant="bodySmall" style={{color: pry}}>
                    {`Successful Transactions ${money(
                      data.transactions.successAmount,
                    )}`}
                  </Text>
                  <Text variant="bodySmall" style={{color: pry}}>
                    {`Failed Transactions ${money(
                      data.transactions.failedAmount,
                    )}`}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card.Content>
        {data.id === showStat.id && showStat.show && (
          <Button
            onPress={() => navigation.navigate('CustomerProfile', data.id)}
            style={{backgroundColor: pry, marginHorizontal: 10}}
            labelStyle={{color: MD2Colors.white}}
            icon="account"
            elevation={3}>
            Profile
          </Button>
        )}
      </Card>
    );
  };

  return (
    <LinearGradient colors={[pry, pry + 'ee']} style={{flex: 1}}>
      <FlatList
        ListHeaderComponent={<TransStats />}
        ItemSeparatorComponent={() => <View style={{margin: 5}} />}
        data={stats.loading ? [] : stats.users}
        renderItem={({item}) => <CustomersList data={item} />}
      />
    </LinearGradient>
  );
};

export default Statistics;
