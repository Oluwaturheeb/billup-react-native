export interface HomeDataProps {
  content: ContentProp[];
  response_description: String;
}

export interface ContentProp {
  identifier: String;
  name: String;
}

export interface User {
  email: string;
  familyName: string;
  givenName: String;
  id: string;
  name: string;
  photo: string;
  logs: Logs[];
  balance: number;
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
  variation_amount: number;
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
  info?: TransactionResponse;
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
  mainToken: string;
  bonusToken: string;
  bonusTokenAmount: any;
}

export interface AdminData {
  commission: number;
  payments: Logs[];
  transactions: AdminLog[];
}

export interface AdminLog {
  transaction: Logs;
  userId: string;
}

interface StatisticsNumbers {
  successAmount: number;
  failedAmount: number;
  paySuccessAmount: number;
  payFailedAmount: number;
  successfulTransactionCount: number;
  failedTransactionCount: number;
}

export interface AdminUser extends User {
  transactions: StatisticsNumbers;
}

export interface Statistics {
  loading: boolean;
  stats: StatisticsNumbers;
  users: AdminUser[];
}

export interface TransactionData {
  amount: number;
  billersCode: string;
  country_code: string;
  email: string;
  operator_id: number;
  phone: string;
  product_type_id: number;
  serviceID: string;
  variation_code: string;
}

export interface TransactionInfo {
  foreign?: TransactionInfoForeign;
  image: string;
  name: string;
  serviceID: string;
  total: number;
  type: string;
  xtra: number;
  action: string;
  userInfo: CustomerInfo;
  varName: string;
}

export interface TransactionInfoForeign {
  service: string;
  image: string;
  product: string;
  variation: string;
  rate: number | null;
}

export interface CustomerInfo {
  Current_Bouquet: string;
  Current_Bouquet_Code: string;
  Customer_Name: string;
  Customer_Number: number;
  Customer_Type: string;
  Due_Date: string;
  Renewal_Amount: number;
  Status: string;
}

export interface BeneficiaryValue {
  data: TransactionData;
  info: TransactionInfo;
  details: Contact;
}

export interface Beneficiary {
  keys: string[];
  value: {
    [key: string]: BeneficiaryValue;
  };
}
