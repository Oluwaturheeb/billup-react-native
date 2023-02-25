import axios from 'axios';

let baseURL = 'https://sandbox.vtpass.com/api';
let apiKey = '51987664e27fa9eb7c56e145aaa67b60';
let pKey = 'PK_266ef3e3b1d8cf5aee81bc8e78ac6bad69a4faee1fb';
let sKey = 'SK_8109c4755c84bd69c62c07c3f283b00d86148dd23dc';

axios.defaults.baseURL = baseURL;
axios.defaults.headers = {
  ...axios.defaults.headers,
  'api-key': apiKey,
  'secret-key': sKey,
  'public-key': pKey,
};

let date = new Date();
let cal = date.getMonth() + 1,
  month = cal < 10 ? '0' + cal : cal;
export default axios;
export const requestId = `${date.getFullYear()}${month}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
