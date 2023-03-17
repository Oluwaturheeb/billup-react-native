import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Avatar,
  IconButton,
  MD2Colors,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import {pry, sec} from './colors';
import {BeneficiaryValue} from './interfaces';
import {beneficiarySchema} from './schema';
import styles from './styles';
import { capFirst } from './lib/firestore';

const Beneficiary = ({navigation}: {navigation: any}) => {
  const [beny, setBeny] = useState(beneficiarySchema);
  useEffect(() => {
    (async () => {
      // await AsyncStorage.removeItem('beneficiary');
      let dbData = await AsyncStorage.getItem('beneficiary');
      if (dbData) {
        let dbObj = JSON.parse(dbData);
        let keys = Object.keys(dbObj);

        setBeny({
          keys,
          value: dbObj,
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const BenyItem = ({item, index}: {item: BeneficiaryValue; index: number}) => {
    let name = item.info.type.split('-');
    return (
      <View key={index}>
        <TouchableRipple
          rippleColor={pry + '44'}
          onPress={() =>
            navigation.navigate(
              item.info.type == 'airtime' ? 'Airtime' : 'Services',
              {
                beny: item,
                other: [],
                item: {
                  identifier: item.info.type,
                  name: capFirst(name[0]) + ' ' + capFirst(name[1]),
                },
              },
            )
          }>
          <View style={[styles.frow, {padding: 5, margin: 5}]}>
            <Avatar.Image source={{uri: item.info?.image}} size={36} />
            <View
              style={{
                marginLeft: 10,
              }}>
              <Text style={{color: pry}}>{item.details?.name}</Text>
              {item.info?.userInfo?.Customer_Name && (
                <Text style={{color: pry}}>
                  {item.info.userInfo?.Customer_Name}
                </Text>
              )}
              <Text style={{color: pry}}>{item.details?.biller}</Text>
            </View>
          </View>
        </TouchableRipple>
      </View>
    );
  };

  return (
    <LinearGradient colors={[sec + '44', sec + 'aa']} style={{flex: 1}}>
      {beny.keys.length > 0 ? (
        <>
          {beny.keys.map((item: string, index: number) => {
            return (
              <View key={index}>
                <View style={{backgroundColor: pry + 'dd', padding: 10}}>
                  <Text variant="bodyLarge" style={{color: MD2Colors.grey300}}>
                    {item.replace(item[0], item[0]?.toLocaleUpperCase())}
                  </Text>
                </View>
                <View>
                  {Object.values(beny.value[item]).map((itemObj, indexNum) => {
                    return <BenyItem item={itemObj} index={indexNum} />;
                  })}
                </View>
              </View>
            );
          })}
        </>
      ) : (
        <View style={[styles.fcenter, {flex: 1}]}>
          <IconButton size={120} icon="account-group" iconColor={pry + 'bb'} />
          <Text variant="bodyLarge">Nothing here</Text>
        </View>
      )}
    </LinearGradient>
  );
};

export default Beneficiary;
