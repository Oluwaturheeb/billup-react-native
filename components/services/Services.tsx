/* eslint-disable @typescript-eslint/no-shadow */
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Modal, TouchableOpacity} from 'react-native';
import {
  Avatar,
  Card,
  IconButton,
  Text,
  TextInput,
  Button,
  MD2Colors,
  ActivityIndicator,
} from 'react-native-paper';
import {bg, pry, bod, sec, click} from '../colors';
import {Loader, MiniLoader, Network} from './Components';
import Others from './Others';
import axios from '../lib/axios';
import {FlatList} from 'react-native-gesture-handler';
import styles from '../styles';
import {selectContactPhone} from 'react-native-select-contact';
import filter from 'lodash.filter';
import {money} from '../lib/firestore';
import LinearGradient from 'react-native-linear-gradient';
import {selectedVariation, service, contact, serviceData} from '../schema';
import {useUser} from '../lib/context';
import {SelectedService} from '../interfaces';

const Services = ({navigation, route}: {navigation: any; route: any}) => {
  // get user info
  const {user} = useUser();

  // get current item and other items from the route params
  const {item: curItem, others} = route.params;

  // data collection
  // available services
  const [data, setData] = useState(serviceData);
  // this is for verrifying meter and smartcard number
  const [userInfo, setUserInfo] = useState({
    loading: false,
    data: {code: '', content: {}},
  });

  // sservice var
  // selected service
  const [selService, setSelService] = useState(service);
  // selected service variation
  const [selServiceVar, setSelServiceVar] = useState(selectedVariation);
  // contact form data
  const [selectContact, setContact] = useState(contact);
  // set contact error msg
  const [msg, setMsg] = useState({msg: ''});
  if (msg.msg != '') {
    setTimeout(() => setMsg({...msg, msg: ''}), 5000);
  }

  //modals
  // show variations modal
  const [showModal, toggleModal] = useState(false);
  // show actionmodal
  const [serviceActionModal, setServiceActionModal] = useState(false);

  // action true = renew
  // action false = new
  const [userAction, setUserAction] = useState({action: '', data: []});

  // get service variation
  useEffect(() => {
    (async () => {
      let req = await axios.get('/services', {
        params: {identifier: curItem.identifier},
      });
      setData({...req.data, loading: true});
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // query meter, smartcard, and user information
  useEffect(() => {
    if (
      curItem.identifier === 'tv-subscription' ||
      curItem.identifier === 'electricity-bill' ||
      curItem.identifier === 'education'
    ) {
      (async () => {
        const verifyNumber = async () => {
          setUserInfo({...userInfo, loading: true});
          let {data} = await axios.post('/merchant-verify', {
            billersCode: selectContact.biller,
            serviceID: selService.serviceID,
            type: selServiceVar.variation_code,
          });
          setUserInfo({loading: false, data});
          setServiceActionModal(!serviceActionModal);
        };

        if (curItem.identifier === 'tv-subscription') {
          selectContact?.biller?.length >= 10 && verifyNumber();
        } else if (curItem.identifier === 'electricity-bill') {
          selectContact?.biller?.length >= 13 && verifyNumber();
        } else if (!selService.serviceID.includes('waec')) {
          selectContact?.biller?.length >= 10 && verifyNumber();
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectContact.biller]);

  const ServicesVariations = ({item}: {item: SelectedService}) => {
    return (
      <Card
        onPress={() => {
          setSelService(item);
          toggleModal(!showModal);
        }}
        style={css.varCard}>
        <Card.Content style={[styles.fcenter, {paddingVertical: 5}]}>
          <Avatar.Image
            source={{uri: item.image}}
            size={60}
            style={{backgroundColor: pry}}
          />
          <Text variant="bodyMedium" style={css.cardText}>
            {item.name}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  const ServiceAction = () => {
    let data = userInfo.data.content;
    return (
      <Modal
        visible={serviceActionModal}
        animationType="slide"
        onDismiss={() => setServiceActionModal(!serviceActionModal)}
        transparent={true}>
        <TouchableOpacity
          style={{
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, .3)',
            padding: 20,
          }}>
          <View
            style={{
              backgroundColor: MD2Colors.grey200,
              padding: 20,
              width: '100%',
              borderRadius: 5,
              height: '40%',
              top: '30%',
            }}>
            {data.Customer_Name === undefined ? (
              <View style={[styles.fcenter, {flex: 1}]}>
                <Text variant="titleLarge">Info</Text>
                <Text variant="bodyMedium">
                  Coudn't find
                  {curItem.identifier == 'tv-subscription'
                    ? ' IUC '
                    : curItem.identifier.includes('elect')
                    ? 'Meter'
                    : 'Profile'}
                  information.
                </Text>
                <Button
                  mode="contained"
                  onPress={() => setServiceActionModal(!serviceActionModal)}
                  style={[styles.my1, {backgroundColor: pry}]}>
                  Close
                </Button>
              </View>
            ) : (
              <View style={[styles.fcenter, {flex: 1}]}>
                <Text variant="titleLarge">
                  {curItem.identifier === 'tv-subscription' ? 'IUC ' : 'Meter '}
                  Information
                </Text>
                <View style={styles.my1}>
                  <Text
                    variant="bodyLarge"
                    style={{textAlign: 'center', fontWeight: 'bold'}}>
                    {data.Customer_Name}
                  </Text>
                  <Text variant="bodyLarge" style={{textAlign: 'center'}}>
                    {data.Current_Bouquet ? data.Current_Bouquet : data.Address}
                  </Text>
                  {curItem.identifier === 'tv-subscription' ? (
                    <View
                      style={[
                        styles.frow,
                        styles.fcenter,
                        styles.m1,
                        {justifyContent: 'space-between'},
                      ]}>
                      <Button
                        mode="outlined"
                        onPress={() => {
                          setContact({
                            ...selectContact,
                            amount: data.Renewal_Amount,
                          });
                          setSelServiceVar(data);
                          setUserAction({action: 'new', data: []});
                          toggleModal(true);
                          setServiceActionModal(!serviceActionModal);
                        }}>
                        New Subscription
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() => {
                          setContact({
                            ...selectContact,
                            amount: data.Renewal_Amount,
                          });
                          setUserAction({action: 'renew', data});
                          setSelServiceVar({
                            ...selServiceVar,
                            name: data?.Current_Bouquet,
                            variation_code: data?.Current_Bouquet_Code,
                            variation_amount: data.Renewal_Amount,
                          });
                          toggleModal(false);
                          setServiceActionModal(!serviceActionModal);
                        }}>
                        Renew {money(data.Renewal_Amount)}
                      </Button>
                    </View>
                  ) : (
                    <Button
                      mode="contained"
                      onPress={() => setServiceActionModal(!serviceActionModal)}
                      style={[styles.my1, {backgroundColor: pry}]}>
                      Close
                    </Button>
                  )}
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  // shows the variation modal
  const ServiceVariationModal = () => {
    const [key, setKey] = useState('');
    const [serviceVar, setServiceVar] = useState({
      loading: true,
      data: selectedVariation,
    });

    useEffect(() => {
      (async () => {
        let req = await axios.get('/service-variations', {
          params: {serviceID: selService?.serviceID},
        });
        setServiceVar({data: req.data.content.varations, loading: false});
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selService]);

    const VarItems = ({item}) => {
      return (
        <Card
          onPress={() => {
            setSelServiceVar(item);
            toggleModal(!showModal);
            setContact({...selectContact, amount: item?.variation_amount});
          }}
          style={{marginBottom: 10}}>
          <Card.Content>
            <Text variant="bodyMedium">{item.name}</Text>
          </Card.Content>
        </Card>
      );
    };

    return (
      <Modal
        visible={showModal}
        animationType="slide"
        onDismiss={() => toggleModal(!showModal)}
        transparent={true}>
        <TouchableOpacity
          onPress={() => toggleModal(!showModal)}
          style={{height: '100%'}}>
          <View
            style={{
              backgroundColor: pry + 'dd',
              padding: 20,
              width: '100%',
              borderRadius: 5,
              height: '70%',
              top: '30%',
            }}>
            {serviceVar.loading ? (
              <MiniLoader />
            ) : (
              <View>
                <TextInput
                  onChangeText={text => {
                    setKey(text);
                    filter(serviceVar.data, item => {
                      let {variation_amount, name} = item;
                      if (
                        variation_amount.includes(text) ||
                        name.includes(text)
                      ) {
                        return item;
                      }
                    });
                  }}
                  value={key}
                  placeholder="Search variation..."
                  label="Search"
                  style={{backgroundColor: 'transparent'}}
                  outlineColor={sec}
                  activeUnderlineColor={sec}
                  underlineColor={sec}
                  textColor={sec}
                  placeholderTextColor={sec}
                  selectionColor={click}
                  left={
                    <TextInput.Icon
                      icon="magnify"
                      iconColor={sec}
                      style={[styles.bround, {backgroundColor: pry}]}
                      size={32}
                    />
                  }
                />
                <FlatList
                  data={serviceVar.data}
                  renderItem={({item}) => <VarItems item={item} />}
                  contentContainerStyle={{marginVertical: 20}}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  // selecting contact
  const contactFunc = async () => {
    let {
      contact: {emails, givenName},
      selectedPhone: {number},
    } = await selectContactPhone();

    setContact({
      ...selectContact,
      email: emails[0],
      biller:
        curItem.identifier == 'data' &&
        selService.serviceID.includes('waec') &&
        number,
      name: givenName,
      phone: number,
    });
  };

  const selectBiller = async () => {
    let {
      selectedPhone: {number},
    } = await selectContactPhone();
    setContact({
      ...selectContact,
      biller: number,
    });
  };

  const submitFormFunc = () => {
    let go = true;
    try {
      // minimum validation
      if (selService.minimium_amount) {
        if (Number(selectContact.amount) < Number(selService.minimium_amount)) {
          setMsg({
            ...msg,
            msg:
              'Mininum amount required is ' +
              money(Number(selService.minimium_amount)),
          });
          go = false;
        }
      }
      // maximum validation
      if (selService.maximum_amount) {
        if (Number(selectContact.amount) > Number(selService.maximum_amount)) {
          setMsg({
            ...msg,
            msg:
              'Maximum amount required is ' +
              money(Number(selService.maximum_amount)),
          });
          go = false;
        }
      }
      // designation number validation
      if (!showPhoneInputForData && !selectContact.biller) {
        setMsg({
          ...msg,
          msg: 'Designation number is required!',
        });
        go = false;
      }
      // check others
      if (!selectContact.name || !selectContact.email || !selectContact.phone) {
        setMsg({
          ...msg,
          msg: 'You are missing some required fields.',
        });
        go = false;
      }

      if (go === true) {
        let amount = Number(selectContact.amount),
          conFee = selService.convinience_fee;

        let cFee = conFee.includes('%')
          ? Number(conFee.slice(0, 1) / 100)
          : Number(conFee.slice(1, -1));

        cFee = Number(cFee);
        let total = amount + cFee * amount;

        navigation.navigate('TransactionDetails', {
          details: selectContact,
          info: {
            image: selService.image,
            xtra: cFee,
            name: selService.name,
            userInfo: userInfo.data.content,
            action: userAction.action === 'new' ? 'change' : 'renew',
            varName: selServiceVar.name,
            total,
          },
          data: {
            serviceID: selService.serviceID,
            amount: total,
            variation_code: selServiceVar.variation_code,
            phone: selectContact.phone,
            billersCode: selectContact.biller,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // here i am trying to hide the service variation for tv-sub
  // since we need to enter smartcard number b4 we can ask him to select variation
  let flatlistData =
    curItem.identifier == 'tv-subscription'
      ? selService.serviceID !== ''
        ? []
        : data.content
      : !selServiceVar.variation_code
      ? data.content
      : [];

  // i need this var to show the contact form
  let showForm =
    curItem.identifier == 'tv-subscription'
      ? selService.serviceID
        ? true
        : false
      : selServiceVar.variation_code !== ''
      ? true
      : false;

  // usimg this var to display the variation for tv sub
  let showVariationModal =
    curItem.identifier !== 'tv-subscription'
      ? selService.name && true
      : userAction.action === 'new' // show variation modal only when the user choose to renew subscription
      ? true
      : false;

  // toggle title icon
  let mainTitleSwitch =
    curItem.identifier === 'tv-subscription'
      ? selService.serviceID != ''
      : selServiceVar.variation_code != '';

  let showPhoneInputForData =
    curItem.identifier == 'data' ||
    (selService.serviceID.includes('waec') &&
      curItem.identifier === 'education');

  return (
    <>
      {!data.loading ? (
        <Loader />
      ) : (
        <LinearGradient colors={[sec + '44', sec + 'aa']} style={{flex: 1}}>
          {showVariationModal && <ServiceVariationModal />}
          {serviceActionModal && <ServiceAction />}
          <FlatList
            style={{padding: 20}}
            showsVerticalScrollIndicator={false}
            data={flatlistData}
            renderItem={({item}) => <ServicesVariations item={item} />}
            numColumns={3}
            ListHeaderComponent={() => (
              <View
                style={[
                  styles.frow,
                  styles.fspace,
                  styles.fVertCenter,
                  {marginBottom: 5},
                ]}>
                <Text
                  variant="titleLarge"
                  style={{color: pry, marginBottom: 20}}>
                  {curItem.name}
                </Text>
                {mainTitleSwitch && (
                  <IconButton
                    icon="swap-vertical"
                    iconColor={pry}
                    style={{marginTop: -10}}
                    onPress={() => {
                      setSelService(service);
                      setSelServiceVar(selectedVariation);
                      setContact({...selectContact, biller: ''});
                      setUserAction({...userAction, action: ''});
                    }}
                  />
                )}
              </View>
            )}
            ListFooterComponentStyle={{marginTop: 16, marginBottom: 50}}
            ListFooterComponent={
              <>
                {showForm && (
                  <View style={css.inputContainer}>
                    <Text
                      style={{
                        color: sec,
                        textAlign: 'center',
                        marginVertical: 5,
                      }}
                      variant="titleLarge">
                      {selService?.name}
                    </Text>
                    {selServiceVar?.variation_code && (
                      <View
                        style={[
                          styles.frow,
                          styles.fspace,
                          styles.bround,
                          {
                            alignItems: 'center',
                            backgroundColor: sec,
                            paddingVertical: 16,
                            paddingHorizontal: 16,
                          },
                        ]}>
                        <Text variant="titleMedium" style={{color: pry}}>
                          {selServiceVar.name}
                        </Text>
                        <View
                          style={{
                            position: 'absolute',
                            right: 3,
                            backgroundColor: pry,
                            borderRadius: 100,
                          }}>
                          <IconButton
                            icon="swap-vertical"
                            iconColor={sec}
                            onPress={() =>
                              // curItem.identifier == 'tv-subscription'
                              //   ? (toggleModal(!showModal))
                              //   : (setSelServiceVar(selectedVariation),
                              toggleModal(!showModal)
                            }
                          />
                        </View>
                      </View>
                    )}
                    <View style={[styles.my1]}>
                      <View style={[styles.frow, styles.fspace]}>
                        <TextInput
                          onChangeText={text =>
                            setContact({...selectContact, name: text})
                          }
                          value={
                            selectContact.name
                              ? selectContact.name
                              : (selectContact.name = user.name)
                          }
                          placeholder="Your name..."
                          label="Name"
                          returnKeyType="next"
                          style={css.input}
                          outlineColor={sec}
                          activeUnderlineColor={pry}
                          textColor={pry}
                          placeholderTextColor={pry}
                          selectionColor={click}
                          right={
                            <TextInput.Icon
                              icon="account-outline"
                              iconColor={sec}
                              style={[styles.bround, {backgroundColor: pry}]}
                              size={32}
                              onPress={contactFunc}
                            />
                          }
                        />
                        <TextInput
                          disabled={
                            selServiceVar?.variation_amount == null
                              ? true
                              : false
                          }
                          onChangeText={text =>
                            setContact({...selectContact, email: text})
                          }
                          value={
                            selectContact.email
                              ? selectContact.email
                              : (selectContact.email = user.email)
                          }
                          placeholder="Email address..."
                          label="Email"
                          keyboardType="email-address"
                          style={css.input}
                          outlineColor={sec}
                          activeUnderlineColor={pry}
                          textColor={pry}
                          placeholderTextColor={pry}
                          selectionColor={click}
                          right={
                            <TextInput.Icon
                              icon="email-outline"
                              iconColor={sec}
                              style={[styles.bround, {backgroundColor: pry}]}
                              size={32}
                              onPress={contactFunc}
                            />
                          }
                        />
                      </View>
                      <TextInput
                        onChangeText={text =>
                          showPhoneInputForData
                            ? setContact({
                                ...selectContact,
                                phone: text,
                                biller: text,
                              })
                            : setContact({...selectContact, phone: text})
                        }
                        value={selectContact.phone}
                        placeholder="Phone..."
                        label="Phone"
                        returnKeyType="next"
                        style={css.phoneInput}
                        outlineColor={sec}
                        activeUnderlineColor={pry}
                        textColor={pry}
                        placeholderTextColor={pry}
                        selectionColor={click}
                        keyboardType="phone-pad"
                        right={
                          <TextInput.Icon
                            icon="cellphone"
                            iconColor={sec}
                            style={[styles.bround, {backgroundColor: pry}]}
                            size={32}
                            onPress={contactFunc}
                          />
                        }
                      />
                      <View>
                        {!showPhoneInputForData && (
                          <TextInput
                            disabled={
                              curItem.identifier != 'data'
                                ? false
                                : selServiceVar?.variation_amount == ''
                                ? true
                                : false
                            }
                            onChangeText={text =>
                              setContact({
                                ...selectContact,
                                biller: text,
                                phone:
                                  curItem.identifier === 'data'
                                    ? text
                                    : selectContact.phone,
                              })
                            }
                            value={
                              selectContact.biller
                                ? selectContact.biller
                                : (selectContact.biller = user?.phone)
                            }
                            placeholder={
                              curItem.identifier.includes('data')
                                ? 'Phone number...'
                                : curItem.identifier.includes('tv')
                                ? 'SmartCard Number'
                                : curItem.identifier.includes('electricity')
                                ? 'Meter Number'
                                : curItem.identifier.includes('education') &&
                                  'Profile ID'
                            }
                            label={
                              selService.serviceID.includes('data')
                                ? 'Phone'
                                : curItem.identifier.includes('tv')
                                ? 'SmartCard Number'
                                : curItem.identifier.includes('electricity')
                                ? 'Meter Number'
                                : curItem.identifier.includes('education') &&
                                  'Profile ID'
                            }
                            keyboardType="number-pad"
                            style={css.phoneInput}
                            outlineColor={sec}
                            activeUnderlineColor={pry}
                            textColor={pry}
                            placeholderTextColor={pry}
                            selectionColor={click}
                            right={
                              <TextInput.Icon
                                icon={
                                  curItem.identifier.includes('tv')
                                    ? 'smart-card-outline'
                                    : curItem.identifier.includes('elect')
                                    ? 'speedometer'
                                    : curItem.identifier.includes('education')
                                    ? 'card-account-details-outline'
                                    : 'cellphone'
                                }
                                iconColor={sec}
                                style={[styles.bround, {backgroundColor: pry}]}
                                size={32}
                                onPress={selectBiller}
                              />
                            }
                          />
                        )}
                        {userInfo.loading && (
                          <View
                            style={[
                              styles.fcenter,
                              {
                                position: 'absolute',
                                top: 14,
                                right: 3,
                                backgroundColor: pry,
                                borderRadius: 100,
                                padding: 12,
                              },
                            ]}>
                            <ActivityIndicator
                              animating={true}
                              size="small"
                              color={sec}
                            />
                          </View>
                        )}
                      </View>
                      <TextInput
                        disabled={
                          curItem.identifier !== 'electricity-bill'
                            ? true
                            : false
                        }
                        onChangeText={text =>
                          setContact({...selectContact, amount: text})
                        }
                        value={selectContact.amount}
                        placeholder="Amount ..."
                        label="Amount"
                        keyboardType="number-pad"
                        style={css.phoneInput}
                        outlineColor={sec}
                        activeUnderlineColor={pry}
                        textColor={pry}
                        placeholderTextColor={pry}
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
                      {msg.msg != '' && (
                        <Text
                          variant="bodySmall"
                          style={{
                            textAlign: 'center',
                            color: MD2Colors.red400,
                            marginTop: 10,
                          }}>
                          {msg.msg}
                        </Text>
                      )}
                      <Button
                        mode="contained"
                        style={css.button}
                        labelStyle={{color: sec}}
                        onPress={submitFormFunc}>
                        Continue
                      </Button>
                    </View>
                  </View>
                )}
                <Others items={others} except={curItem.identifier} />
              </>
            }
          />
          <Network />
        </LinearGradient>
      )}
    </>
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

export default Services;
