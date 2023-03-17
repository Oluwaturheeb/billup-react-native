import firestore from '@react-native-firebase/firestore';

export const field = firestore.FieldValue;
export const users = firestore().collection('billup_users_001');
export const money = (num: number, currency = 'NGN') => {
  let format = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  });

  return format.format(num);
};

export const ref = (num = 32, flw = true) => {
  let str = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    str += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return flw ? `flw_tx_ref_${str}` : str;
};

export const keys = (length: number, charLength = 10) => {
  return Array(length).fill(ref(charLength, false));
};

export const updateFirebase = async (
  ...info: [id: string, balance: number, logs: object, type: boolean]
) => {
  let [id, balance, logs, type] = info;

  if (!type) {
    (async () => {
      let user = await users.doc(id).get();
      balance = Number(user?.data().balance) - balance;

      await users.doc(id).update({
        logs: field.arrayUnion(logs),
        balance: Number(balance),
      });
    })();
  } else {
    await users.doc(id).update({
      logs: field.arrayUnion(logs),
      balance: field.increment(Number(balance)),
    });
  }
};

export const adminTransaction = async (data: any, which = 'Payment') => {
  let obj =
    which != 'Payment'
      ? {
          commission: field.increment(data.commission),
          transactions: field.arrayUnion({
            userId: data.id,
            transaction: data.transaction,
          }),
        }
      : {
          payments: field.arrayUnion({
            userId: data.id,
            transaction: data.info,
          }),
        };
  await users.doc('PXlO3KDmrEwbDTwsprSM').update(obj);
};

export const dateFormat = (date: number) => {
  let newDate = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    hour12: true,
    minute: 'numeric',
  });
  // time formatting

  return newDate.format(new Date(date * 1000));
};

export const chunk = (string: string) => string.match(/.{1,4}/g)?.join(' - ');
export const capFirst = (str: string) =>
  str ? str.replace(str[0], str[0].toUpperCase()) : '';
