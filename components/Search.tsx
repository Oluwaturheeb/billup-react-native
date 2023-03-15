import filter from 'lodash.filter';
import React, {useState} from 'react';
import {View, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Card, MD2Colors, Searchbar, Text} from 'react-native-paper';
import {pry} from './colors';
import {Logs} from './interfaces';
import {useUser} from './lib/context';

const Search = ({route, navigation}: {route: any; navigation: any}) => {
  // console.log(navigation.getState());
  const {user} = useUser();
  const [searchFilter, setSearchFilter] = useState<any>([]);
  const [key, setKey] = useState('');

  const searchFn = (text: string) => {
    setKey(text);
    let searchResult = filter(user.logs, (item: Logs) => {
      let {title, desc, info} = item;
      if (
        title.toLowerCase().includes(text) ||
        desc.toLowerCase().includes(text) ||
        info?.Pin ||
        info?.token ||
        info?.amount ||
        info?.requestId ||
        info?.content?.transactions?.transactionId
      ) {
        return true;
      }
    });
    console.log(JSON.stringify(searchResult, null, 2));
    setSearchFilter(searchResult);
  };

  const Item = ({item}: {item: Logs}) => {
    return (
      <Card
        style={{backgroundColor: pry, marginHorizontal: 10, marginVertical: 5}}>
        <Card.Content>
          <Text variant="bodyMedium" style={{color: MD2Colors.white}}>
            {item.title}
          </Text>
          <Text variant="bodySmall" style={{color: MD2Colors.white}}>
            {item.desc}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <LinearGradient
      colors={[pry + '11', pry + '33']}
      style={{position: 'relative', height: '100%'}}>
      <Searchbar
        placeholder="Search"
        value={key}
        onChangeText={text => searchFn(text)}
      />
      <FlatList
        data={searchFilter}
        renderItem={({item}) => <Item item={item} />}
      />
    </LinearGradient>
  );
};

export default Search;
