/* eslint-disable @typescript-eslint/no-shadow */
import React, {useState, useEffect} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {
  Avatar,
  Card,
  Text,
  Button,
  TextInput,
  MD2Colors,
  IconButton,
} from 'react-native-paper';
import {bg, pry, bod, sec, click} from './colors';
import {Loader, MiniLoader, Network} from './services/Components';
import Others from './services/Others';
import axios from './lib/axios';
import {FlatList} from 'react-native-gesture-handler';
import styles from './styles';
import {selectContactPhone} from 'react-native-select-contact';
import {
  contact,
  foreignAirtimeCountries,
  foreignAirtimeOperator,
  foreignAirtimeProduct,
  foreignAirtimeVariation,
  service,
  serviceData,
} from './schema';
import {ContentProp, selectContactService} from './interfaces';
import LinearGradient from 'react-native-linear-gradient';
import {useUser} from './lib/context';
import {money} from './lib/firestore';
import filter from 'lodash.filter';

const Airtime = ({navigation, route}: {navigation: any; route: any}) => {
  const {item: curItem, others}: {curItem: ContentProp; others: ContentProp[]} =
    route.params;
  const [data, setData] = useState(serviceData);
  const [selectedService, setSelectedService] = useState(service);
  const {user} = useUser();
  const [fData, setForeignData] = useState({
    country: foreignAirtimeCountries,
    product: foreignAirtimeProduct,
    operator: foreignAirtimeOperator,
    variation: foreignAirtimeVariation,
  });

  // foreign airtime
  const [showModal, toggleModal] = useState(false);

  useEffect(() => {
    (async () => {
      let {data} = await axios.get('/services', {
        params: {identifier: curItem.identifier},
      });
      setData({...data, loading: true});
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // service vartiation
  const ServiceVariation = ({item}: {item: selectContactService}) => {
    return (
      <Card
        onPress={() => {
          setSelectedService(item);
          item.serviceID === 'foreign-airtime' && toggleModal(!showModal);
        }}
        style={css.varCard}>
        <Card.Content style={[styles.fcenter, {paddingVertical: 5}]}>
          <Avatar.Image
            source={{uri: item.image}}
            size={60}
            style={{backgroundColor: pry}}
          />
          <Text variant="bodySmall" style={css.cardText}>
            {item.name}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  const ContactInfo = () => {
    let [selectContact, setContact] = useState(contact);
    const [msg, setMsg] = useState({msg: ''});

    useEffect(() => {
      fData.product.name === 'Mobile Data' &&
        setContact({
          ...selectContact,
          amount: fData.variation.variation_amount,
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fData]);

    const contactFunc = async () => {
      let {
        contact: {emails, givenName},
        selectedPhone: {number},
      } = await selectContactPhone();
      setContact({
        ...selectContact,
        email: emails[0],
        biller: number,
        name: givenName,
        phone: number,
      });
    };

    const submitForm = () => {
      let go = true;
      // designation number validation
      if (!selectContact.biller) {
        setMsg({
          ...msg,
          msg: 'Designation number is required!',
        });
        go = false;
      }
      // phone number validation
      if (selectContact.biller?.length < 11) {
        setMsg({
          ...msg,
          msg: 'Invalid phone number format!',
        });
        go = false;
      }
      // maximum validation
      if (
        fData.country.name == '' &&
        selectContact.amount > Number(selectedService.maximum_amount)
      ) {
        setMsg({
          ...msg,
          msg:
            'Maximum amount required is ' +
            money(Number(selectedService.maximum_amount)),
        });
        go = false;
      }
      // minimum validation
      if (fData.country.name == '' && selectContact.amount < 100) {
        setMsg({
          ...msg,
          msg: 'Mininum amount required is ' + money(100),
        });
        go = false;
      }
      // other validation
      if (!selectContact.name || !selectContact.email) {
        setMsg({
          ...msg,
          msg: 'You are missing some required fields.',
        });
        go = false;
      }

      // foreign airtime
      if (
        fData.country.name &&
        selectContact.amount > fData.variation.variation_amount_max
      ) {
        setMsg({
          ...msg,
          msg:
            'Maximum amount required is ' +
            money(
              fData.variation.variation_amount_max,
              fData.country.currency || 'NGN',
            ),
        });
        go = false;
      }

      // minimum validation
      if (
        fData.country.name &&
        selectContact.amount < fData.variation.variation_amount_min
      ) {
        setMsg({
          ...msg,
          msg: 'Mininum amount required is ' + money(100),
        });
        go = false;
      }

      if (go) {
        let rate = fData.variation.variation_rate;
        let amount = Number(selectContact.amount),
          conFee = selectedService.convinience_fee || convFee;

        let cFee = conFee.includes('%')
          ? Number(conFee.slice(0, 1) / 100)
          : Number(conFee.slice(1, -1));

        // ? selectedService.convinience_fee
        // : fData.variation?.convinience_fee,
        cFee = Number(cFee);
        let total = amount + cFee * amount;

        //go to transaction preview page
        navigation.navigate('TransactionDetails', {
          details: selectContact,
          info: {
            image: selectedService.image,
            xtra: cFee,
            name: selectedService.name,
            serviceID: selectedService.serviceID,
            type: curItem.identifier,
            total,
            foreign: {
              service: fData.operator.name,
              image: fData.operator.operator_image,
              product: fData.product.name,
              variation: fData.variation.name,
              rate: fData.operator.name !== '' ? rate : 1,
            },
          },
          data: {
            serviceID: selectedService.serviceID,
            variation_code: fData.variation.variation_code,
            amount: selectContact.amount,
            phone: selectContact.biller,
            operator_id: fData.operator.operator_id,
            country_code: fData.country.code,
            product_type_id: fData.product.product_type_id,
            email: selectContact.email,
            billersCode: selectContact.biller,
          },
        });
      }
    };

    return (
      <View style={css.inputContainer}>
        <View style={[styles.frow, styles.fcenter]}>
          <Avatar.Image
            source={{uri: selectedService.image}}
            size={60}
            style={{backgroundColor: pry}}
          />
          <Text
            variant="titleLarge"
            style={{color: sec, textAlign: 'center', marginVertical: 5}}>
            {selectedService.name}
          </Text>
        </View>
        {fData.country.name && (
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
            <View>
              <Text variant="labelSmall" style={{color: pry}}>
                {fData.operator.name}
              </Text>
              <Text variant="bodyLarge" style={{color: pry}}>
                {fData.product.name}
                {contact.amount !== 0 && ' - ' + selectContact.amount}
              </Text>
            </View>
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
                  setForeignData({
                    country: foreignAirtimeCountries,
                    product: foreignAirtimeProduct,
                    operator: foreignAirtimeOperator,
                    variation: foreignAirtimeVariation,
                  })
                }
              />
            </View>
          </View>
        )}
        <View style={[styles.my1]}>
          <View style={[styles.frow, styles.fspace]}>
            <TextInput
              onChangeText={text => setContact({...selectContact, name: text})}
              value={
                selectContact.name
                  ? selectContact.name
                  : (selectContact.name = user.name)
              }
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
                  onPress={contactFunc}
                />
              }
            />
            <TextInput
              onChangeText={text => setContact({...selectContact, email: text})}
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
              placeholderTextColor={sec}
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
              setContact({...selectContact, biller: text, phone: text})
            }
            value={
              selectContact.biller
                ? selectContact.biller
                : (selectContact.biller = user.phone)
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
                onPress={contactFunc}
              />
            }
          />
          <TextInput
            onChangeText={text => setContact({...selectContact, amount: text})}
            disabled={fData.product.name === 'Mobile Data' ? true : false}
            value={selectContact.amount}
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

          <Button mode="contained" style={css.button} labelStyle={{color: sec}} onPress={submitForm}>
            Continue
          </Button>
        </View>
      </View>
    );
  };

  const ServiceVariationModal = () => {
    const [varData, setVarData] = useState({
      loading: true,
      country: foreignAirtimeCountries,
      product: foreignAirtimeProduct,
      operator: foreignAirtimeOperator,
      variation: foreignAirtimeVariation,
      convFee: '',
    });

    const VarItems = ({item}) => {
      return (
        <Card
          onPress={() => {
            // set in order of precidence
            //country
            if (varData.country.name == '') {
              setVarData({...varData, loading: true, country: item});
            }
            // product type
            if (varData.country.name && varData.product.name == '') {
              setVarData({...varData, loading: true, product: item});
            }
            // operator
            if (varData.product.name && varData.operator.name == '') {
              setVarData({...varData, loading: true, operator: item});
            }
            // if mobile data
            if (
              varData.operator.name &&
              varData.variation.variation_code == 0
            ) {
              setVarData({...varData, loading: true, variation: item});
              delete varData?.loading;
              setForeignData({...varData, variation: item});
              // toggleModal(!showModal);
            }
          }}
          style={{marginBottom: 10}}>
          <Card.Content style={[styles.frow, {alignItems: 'center'}]}>
            <Avatar.Image source={{uri: item.flag}} size={30} />
            <Text variant="bodyMedium" style={{marginLeft: 10, color: pry}}>
              {item.name}
            </Text>
          </Card.Content>
        </Card>
      );
    };

    const Country = () => {
      const [key, setKey] = useState('');
      let [countries, setCountries] = useState({
        loading: true,
        data: foreignAirtimeCountries,
        filter: [],
      });
      useEffect(() => {
        (async () => {
          let req = await axios.get('/get-international-airtime-countries');
          setCountries({
            ...countries,
            loading: false,
            data: req.data.content.countries,
          });
          console.log(JSON.stringify(req.data, null, 1));
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return (
        <>
          {countries.loading ? (
            <MiniLoader />
          ) : (
            <>
              <TextInput
                onChangeText={text => {
                  setKey(text);
                  let searchResult = filter(countries.data, item => {
                    let {name, code, currency} = item;
                    if (
                      name.toLowerCase().includes(text) ||
                      code.toLowerCase().includes(text) ||
                      currency.toLowerCase().includes(text)
                    ) {
                      return true;
                    }
                  });

                  setCountries({
                    ...countries,
                    filter: searchResult,
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
                    icon="flag"
                    iconColor={sec}
                    style={[styles.bround, {backgroundColor: pry}]}
                  />
                }
              />
              <FlatList
                data={!key ? countries.data : countries.filter}
                renderItem={({item}) => <VarItems item={item} />}
                contentContainerStyle={{marginVertical: 20}}
              />
            </>
          )}
        </>
      );
    };

    const ProductType = () => {
      const [key, setKey] = useState('');
      const [product, setProduct] = useState({
        filter: [],
        data: [],
        loading: true,
      });
      useEffect(() => {
        (async () => {
          let req = await axios.get(
            '/get-international-airtime-product-types?code=' +
              varData.country.code,
          );
          setProduct({loading: false, data: req.data.content});
          console.log(JSON.stringify(req.data, null, 1));
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return (
        <>
          {product.loading ? (
            <MiniLoader />
          ) : (
            <>
              <TextInput
                onChangeText={text => {
                  setKey(text);
                  let searchResult = filter(product.data, item => {
                    let {name} = item;
                    if (name.toLowerCase().includes(text)) {
                      return true;
                    }
                  });

                  setProduct({
                    ...product,
                    filter: searchResult,
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
                    icon="flag"
                    iconColor={sec}
                    style={[styles.bround, {backgroundColor: pry}]}
                  />
                }
              />
              <FlatList
                data={!key ? product.data : product.filter}
                renderItem={({item}) => <VarItems item={item} />}
                contentContainerStyle={{marginVertical: 20}}
              />
            </>
          )}
        </>
      );
    };

    const Operator = () => {
      const [key, setKey] = useState('');
      const [operator, setOperator] = useState({
        data: [],
        loading: true,
        filter: [],
      });
      useEffect(() => {
        (async () => {
          let req = await axios.get('/get-international-airtime-operators', {
            params: {
              code: varData.country.code,
              product_type_id: varData.product.product_type_id,
            },
          });
          setOperator({...operator, loading: false, data: req.data.content});
          console.log(JSON.stringify(req.data, null, 1));
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return (
        <>
          {operator.loading ? (
            <MiniLoader />
          ) : (
            <>
              <TextInput
                onChangeText={text => {
                  setKey(text);
                  let searchResult = filter(operator.data, item => {
                    let {name} = item;
                    if (name.toLowerCase().includes(text)) {
                      return true;
                    }
                  });

                  setOperator({
                    ...operator,
                    filter: searchResult,
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
                    icon="flag"
                    iconColor={sec}
                    style={[styles.bround, {backgroundColor: pry}]}
                  />
                }
              />
              <FlatList
                data={!key ? operator.data : operator.filter}
                renderItem={({item}) => <VarItems item={item} />}
                contentContainerStyle={{marginVertical: 20}}
              />
            </>
          )}
        </>
      );
    };

    const DataVariation = () => {
      const [key, setKey] = useState('');
      const [dataVariation, setDataVariation] = useState({
        data: [],
        loading: true,
        filter: [],
      });
      useEffect(() => {
        (async () => {
          let req = await axios.get('/service-variations', {
            params: {
              serviceID: 'foreign-airtime',
              product_type_id: varData.product.product_type_id,
              operator_id: varData.operator.operator_id,
            },
          });
          setDataVariation({
            ...dataVariation,
            loading: false,
            data: req.data.content.variations,
          });
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return (
        <>
          {dataVariation.loading ? (
            <MiniLoader />
          ) : (
            <>
              <TextInput
                onChangeText={text => {
                  setKey(text);
                  let searchResult = filter(dataVariation.data, item => {
                    let {name, variation_amount} = item;
                    if (
                      name.toLowerCase().includes(text) ||
                      variation_amount.includes(text)
                    ) {
                      return true;
                    }
                  });

                  setDataVariation({
                    ...dataVariation,
                    filter: searchResult,
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
                    icon="flag"
                    iconColor={sec}
                    style={[styles.bround, {backgroundColor: pry}]}
                  />
                }
              />
              <FlatList
                data={!key ? dataVariation.data : dataVariation.filter}
                renderItem={({item}) => <VarItems item={item} />}
                contentContainerStyle={{marginVertical: 20}}
              />
            </>
          )}
        </>
      );
    };

    return (
      <Modal
        visible={showModal}
        animationType="slide"
        onDismiss={() => toggleModal(!showModal)}
        transparent={true}>
        <View
          style={{
            backgroundColor: pry + 'dd',
            padding: 20,
            width: '100%',
            borderRadius: 5,
            height: '70%',
            top: '30%',
          }}>
          {varData.country.name == '' && <Country />}
          {varData.country.name && varData.product.name == '' && (
            <ProductType />
          )}
          {varData.product.name && varData.operator.name == '' && <Operator />}
          {
            //varData.product.name === 'Mobile Data' &&
            varData.operator.name &&
              varData.variation.variation_amount == 0 && <DataVariation />
          }
        </View>
      </Modal>
    );
  };

  let showContactForm =
    selectedService.serviceID === 'foreign-airtime'
      ? fData.product.name !== ''
        ? true
        : false
      : true;

  let hideServices =
    selectedService.serviceID === 'foreign-airtime'
      ? fData.country.name === ''
        ? true
        : false
      : selectedService.name === ''
      ? true
      : false;

  return (
    <>
      {!data.loading ? (
        <Loader />
      ) : (
        <LinearGradient
          colors={[sec + '44', sec + 'aa']}
          style={{flex: 1, ...styles.p1}}>
          <View style={[styles.frow, styles.fspace, styles.fVertCenter]}>
            <Text variant="titleLarge" style={{marginBottom: 20, color: pry}}>
              {curItem.name}
            </Text>
            {selectedService.serviceID && (
              <IconButton
                icon="swap-vertical"
                iconColor={pry}
                onPress={() => {
                  setSelectedService(service);
                  setForeignData({
                    country: foreignAirtimeCountries,
                    product: foreignAirtimeProduct,
                    operator: foreignAirtimeOperator,
                    variation: foreignAirtimeVariation,
                  });
                }}
              />
            )}
          </View>
          {hideServices && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={data.content}
              renderItem={({item}: {item: selectContactService}) => (
                <ServiceVariation item={item} />
              )}
              numColumns={3}
              contentContainerStyle={{justifyContent: 'center'}}
            />
          )}
          {hideServices && !showContactForm && <ServiceVariationModal />}
          {!hideServices && showContactForm && <ContactInfo />}
          <Others items={others} except={curItem.identifier} />
        </LinearGradient>
      )}
      <Network />
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

export default Airtime;
