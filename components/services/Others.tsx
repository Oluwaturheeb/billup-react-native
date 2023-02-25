import React from 'react';
import {View, Dimensions} from 'react-native';
import {Text, Title} from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import {bod, pry} from '../colors';

const Others = ({items, except}) => {
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
        scrollAnimationDuration={1000}
        renderItem={({item, index}) =>
          items.identifier !== except && (
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                justifyContent: 'center',
              }}>
              <Text style={{textAlign: 'center', fontSize: 30}}>{item.identifier}</Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default Others;
