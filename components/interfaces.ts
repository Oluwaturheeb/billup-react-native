export interface HomeDataProps {
  content: ContentProp[];
  response_description: String;
}

export interface ContentProp {
  identifier: String;
  name: String;
}

export interface User {
  email: String;
  familyName: String;
  givenName: String;
  id: String;
  name: String;
  photo: String;
  logs: Logs[];
  balance: Number;
}

export interface SelectedService {
  serviceID: string;
  name: string;
  minimium_amount: string | number;
  maximum_amount: string | number;
  convinience_fee: string;
  product_type: string;
  image: string;
}

export interface SelectedVariation {
  variation_code: string;
  name: string;
  variation_amount: string;
  fixedPrice: string;
}

export interface Contact {
  biller: string;
  email: string;
  name: string;
  amount: number;
  phone: string;
}

export interface ServiceData {
  content: SelectedService[];
  response_description: String;
  loading: Boolean;
}

export interface Logs {
  amount: number;
  createdAt: {nanoseconds: number; seconds: number};
  desc: String;
  info?: any;
  status: String;
  title: String;
}

export interface Country {
  code: string;
  currency: string;
  flag: string;
  name: string;
  prefix: number | string;
}

export interface ProductType {
  name: string;
  product_type_id: number;
}

export interface ForeignDataVariationResponse {
  response_description: string;
  content: ForeignDataVariation;
}

export interface ForeignDataVariation {
  ServiceName: string;
  serviceID: string;
  convinience_fee: '0 %';
  currency: string;
  variations: Variation[];
}

export interface Operator {
  operator_id: number;
  name: string;
  operator_image: string;
}

export interface Variation {
  variation_code: number;
  name: string;
  fixedPrice: string;
  variation_amount: number;
  variation_amount_min: number;
  variation_amount_max: number;
  variation_rate: number;
  charged_amount: number | null;
  charged_currency: string;
  convinience_fee: string;
}

interface TransactionSuccess {
  status: string;
  product_name: string;
  unique_element: number;
  unit_price: number;
  quantity: number;
  service_verification: null;
  channel: string;
  commission: number;
  total_amount: number;
  discount: null;
  type: string;
  email: string;
  phone: string;
  name: null;
  convinience_fee: number;
  amount: number;
  platform: string;
  method: string;
  transactionId: number;
}

interface TransactionDate {
  date: string;
  timezone_type: number;
  timezone: string;
}

interface Cards {
  Serial: string;
  Pin: string;
}

export interface TransactionResponse {
  code: string;
  content: {
    transactions: TransactionSuccess;
  };
  response_description: string;
  requestId: string;
  amount: number | string;
  transaction_date: TransactionDate;
  purchased_code: string;
  customerName: string;
  customerAddress: string;
  token: string;
  tokenAmount: number;
  tokens: string;
  exchangeReference: number;
  resetToken: null;
  configureToken: null;
  units: string;
  fixChargeAmount: null;
  tariff: string;
  taxAmount: null;
  cards: Cards[];
  Pin: string;
}
