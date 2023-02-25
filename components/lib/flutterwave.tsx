import React, {useEffect, useState} from 'react';
import {FlutterwaveInit} from 'flutterwave-react-native';
import {WebView} from 'react-native-webview';

const forkParams = url => {
  if (url.indexOf('billup')) {
    var res = {};
    if (url.split('?').length > 1) {
      var params = url.split('?')[1].split('&');
      for (var i = 0; i < params.length; i++) {
        var param = params[i].split('=');
        var val = decodeURIComponent(param[1]).trim();
        res[param[0]] = String(val);
      }
    }
    // return result
    return res;
  }
};

const Payment = ({user}) => {
  let [go, setGo] = useState('');
  const ref = (() => {
    let str = '';
    let characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 32; i++) {
      str += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `flw_tx_ref_${str}`;
  })();

  useEffect(() => {
    (async () => {
      let url = await FlutterwaveInit({
        authorization: 'FLWPUBK_TEST-3ffa62793f521b1e3134650390f7ea97-X',
        tx_ref: ref,
        amount: user?.amount,
        customer: {
          name: user?.name,
          email: user?.email,
        },
        currency: 'NGN',
        payment_options: 'card,banktransfer',
        redirect_url: 'https://billup.ng',
        customizations: {
          title: 'Billup',
          description: 'Wallet payment',
        },
      });
      console.error(url);
      setGo(url);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {go == null && (
        <WebView
          source={{uri: go}}
          onNavigationStateChange={event => {
            let state = forkParams(event.url);
            console.log(state);
            if (state.status == 'successful') {
              setGo(false);
            }
            // setStatus(state);
          }}
        />
      )}
    </>
  );
};

export default Payment;
