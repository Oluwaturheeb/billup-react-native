import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ImageBackground} from 'react-native';
import {View, Dimensions} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import {pry} from '../colors';
import {ContentProp} from '../interfaces';

const Others = () => {
  const items: ContentProp[] = [
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
  ];

  const Items = ({item}: {item: ContentProp}) => {
    const nav: any = useNavigation();
    const img =
      item.identifier == 'airtime'
        ? require('../img/call.png')
        : item.identifier == 'data'
        ? require('../img/internet.png')
        : item.identifier == 'electricity-bill'
        ? require('../img/elect.jpeg')
        : item.identifier == 'tv-subscription'
        ? require('../img/tv.webp')
        : require('../img/social.webp');

    return (
      <TouchableRipple
        onPress={() =>
          nav.navigate(item.identifier == 'airtime' ? 'Airtime' : 'Services', {
            item,
          })
        }>
        <ImageBackground
          resizeMode="stretch"
          source={img}
          style={{width: '100%', height: '100%', top: '0%'}}
        />
      </TouchableRipple>
    );
  };
  return (
    <View>
      <Text
        variant="titleLarge"
        style={{
          color: pry,
          marginVertical: 20,
        }}>
        Other Services
      </Text>
      <Carousel
        loop={true}
        width={Dimensions.get('screen').width - 20}
        height={200}
        autoPlayInterval={5000}
        autoPlay={true}
        data={items}
        scrollAnimationDuration={2000}
        renderItem={({item}) => <Items item={item} />}
      />
    </View>
  );
};

export default Others;
