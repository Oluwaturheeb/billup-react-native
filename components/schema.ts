import {
  User,
  Contact,
  SelectedVariation,
  SelectedService,
  ServiceData,
  HomeDataProps,
  Logs,
  ProductType,
  Country,
  Variation,
  Operator,
  TransactionResponse,
  AdminData,
  AdminLog,
} from './interfaces';

export const UserSchema: User = {
  email: '',
  familyName: '',
  givenName: '',
  id: '',
  name: '',
  photo: '',
  logs: [],
  balance: 0,
};

export const homeData: HomeDataProps = {
  content: [],
  response_description: '',
};

export const contact: Contact = {
  biller: '',
  email: '',
  name: '',
  amount: 50,
  phone: '',
};

export const service: SelectedService = {
  serviceID: '',
  name: '',
  minimium_amount: 0,
  maximum_amount: 0,
  convinience_fee: '',
  product_type: '',
  image: '',
};

export const selectedVariation: SelectedVariation = {
  variation_code: '',
  name: '',
  variation_amount: '',
  fixedPrice: '',
};

export const serviceData: ServiceData = {
  content: [],
  response_description: '',
  loading: false,
};

export const foreignAirtimeCountries: Country = {
  code: '',
  currency: '',
  flag: '',
  name: '',
  prefix: 0,
};

export const foreignAirtimeProduct: ProductType = {
  name: '',
  product_type_id: -1,
};

export const foreignAirtimeVariation: Variation = {
  variation_code: 0,
  name: 'Airtime',
  fixedPrice: '',
  variation_amount: 0,
  variation_amount_min: 1,
  variation_amount_max: 120,
  variation_rate: 0,
  charged_amount: 0,
  charged_currency: '',
  convinience_fee: '',
};

export const foreignAirtimeOperator: Operator = {
  operator_id: 0,
  name: '',
  operator_image: '',
};

export const transactionResponse: TransactionResponse = {
  code: '',
  content: {
    transactions: {
      status: '',
      product_name: '',
      unique_element: 0,
      unit_price: 0,
      quantity: 0,
      service_verification: null,
      channel: '',
      commission: 0,
      total_amount: 0,
      discount: null,
      type: '',
      email: '',
      phone: '',
      name: null,
      convinience_fee: 0,
      amount: 0,
      platform: '',
      method: '',
      transactionId: 0,
    },
  },
  response_description: '',
  requestId: '',
  amount: '',
  transaction_date: {
    date: '',
    timezone_type: 0,
    timezone: '',
  },
  purchased_code: '',
  customerName: '',
  customerAddress: '',
  token: '',
  tokenAmount: 0,
  exchangeReference: 0,
  resetToken: null,
  configureToken: null,
  units: '',
  fixChargeAmount: null,
  tariff: '',
  taxAmount: null,
  tokens: '',
  cards: [
    {
      Serial: '',
      Pin: '',
    },
  ],
  Pin: '',
  bonusToken: '',
  bonusTokenAmount: '',
  mainToken: '',
};

export const logs: Logs = {
  createdAt: {nanoseconds: 0, seconds: 0},
  desc: '',
  info: transactionResponse,
  title: '',
  status: '',
  amount: 0,
};

export const adminData: AdminData = {
  commission: 0,
  transactions: [
    {
      transaction: logs,
      userId: '',
    },
  ],
  payments: [logs],
};

export const adminLog: AdminLog = {
  transaction: logs,
  userId: '',
};

export const statistics = {
  loading: true,
  stats: {
    successAmount: 0,
    failedAmount: 0,
    paySuccessAmount: 0,
    payFailedAmount: 0,
    successfulTransactionCount: 0,
    failedTransactionCount: 0,
  },
  users: {
    ...UserSchema,
    transactions: {
      successAmount: 0,
      failedAmount: 0,
      paySuccessAmount: 0,
      payFailedAmount: 0,
      successfulTransactionCount: 0,
      failedTransactionCount: 0,
    },
  },
};
