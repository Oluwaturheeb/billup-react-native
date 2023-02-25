/* eslint-disable @typescript-eslint/no-shadow */
import React, {useState, useEffect} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Button, IconButton, TextInput, Title} from 'react-native-paper';
import {selectContactPhone} from 'react-native-select-contact';
import {bg, click, pry, sec} from './colors';
import axios from './lib/axios';
import styles from './styles';

const Data = ({navigation, route}) => {
  const item = route.params;
  const [data, setData] = useState({});
  const [selected, setSelected] = useState({});
  const [contact, setContact] = useState({
    phone: '',
    email: '',
    name: '',
    amount: 0,
  });

  useEffect(() => {
    // (async () => {
    //   let req = await axios.get('/services', {
    //     params: {identifier: item.id},
    //   });
    //   setData(req.data);
    //   console.error(req.data);
    // })();
  });

  return (
    <View style={css.bg}>
      <IconButton
        icon="arrow-left"
        onPress={() => navigation.goBack()}
        iconColor={pry}
        style={{marginLeft: -10, marginVertical: 10}}
      />
      <Title style={css.headerTitle}>{item.name}</Title>
      <View style={css.inputContainer}>
        <Title style={{color: sec}}>Airtime</Title>
        <View style={[styles.my1]}>
          <View style={[styles.frow, styles.fspace]}>
            <TextInput
              onChangeText={text => setContact({...contact, name: text})}
              value={selected?.contact ? selected.contact.name : contact.name}
              placeholder="Your name..."
              label="Name"
              style={css.input}
              outlineColor={sec}
              activeUnderlineColor={pry}
              textColor={pry}
              placeholderTextColor={sec}
              selectionColor={click}
              right={
                <TextInput.Icon
                  icon="account-outline"
                  iconColor={sec}
                  style={[styles.bround, {backgroundColor: pry}]}
                  size={32}
                  onPress={() =>
                    selectContactPhone()
                      .then(contact => setSelected(contact))
                      .catch(err => console.error(err))
                  }
                />
              }
            />
            <TextInput
              onChangeText={text => setContact({...contact, email: text})}
              value={
                selected?.contact ? selected.contact.emails[0] : contact.email
              }
              placeholder="Email address..."
              label="Email"
              keyboardType="email-address"
              style={css.input}
              outlineColor={sec}
              activeUnderlineColor={pry}
              textColor={pry}
              placeholderTextColor={sec}
              selectionColor={click}
              right={
                <TextInput.Icon
                  icon="email-outline"
                  iconColor={sec}
                  style={[styles.bround, {backgroundColor: pry}]}
                  size={32}
                  onPress={() =>
                    selectContactPhone()
                      .then(contact => setSelected(contact))
                      .catch(err => console.error(err))
                  }
                />
              }
            />
          </View>
          <TextInput
            onChangeText={text => setContact({...contact, phone: text})}
            value={
              selected.contact ? selected.selectedPhone.number : contact.phone
            }
            placeholder="Phone number..."
            label="Phone number"
            keyboardType="number-pad"
            style={css.phoneInput}
            outlineColor={sec}
            activeUnderlineColor={pry}
            textColor={pry}
            placeholderTextColor={sec}
            selectionColor={click}
            right={
              <TextInput.Icon
                icon="cellphone"
                iconColor={sec}
                style={[styles.bround, {backgroundColor: pry}]}
                size={32}
                onPress={() =>
                  selectContactPhone()
                    .then(contact => setSelected(contact))
                    .catch(err => console.error(err))
                }
              />
            }
          />
          <TextInput
            onChangeText={text => setContact({...contact, amount: text})}
            value={contact.amount}
            placeholder="Amount..."
            label="Amount"
            keyboardType="number-pad"
            style={css.phoneInput}
            outlineColor={sec}
            activeUnderlineColor={pry}
            textColor={pry}
            placeholderTextColor={sec}
            selectionColor={click}
            right={
              <TextInput.Icon
                icon="cash-fast"
                iconColor={sec}
                style={[styles.bround, {backgroundColor: pry}]}
                size={32}
              />
            }
          />
          <Button
            mode="contained"
            style={css.button}
            labelStyle={{color: pry}}
            onPress={pay}>
            Pay
          </Button>
        </View>
      </View>
    </View>
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
    marginVertical: 20,
  },
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
    margin: 5,
  },
  button: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: sec,
    marginTop: 10,
    marginHorizontal: 3,
  },
});

export default Data;
