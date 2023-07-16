
export interface PaystackTxnInitResponse {
  status: boolean;
  message: string;
  data: PaystackTxnInitData;
}

export interface PaystackTxnInitData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaystackTxnVerifyData {
  id: number;
  domain: 'test' | 'live';
  status: 'failed' | 'success';
  reference: string;
  receipt_number: number;
  amount: number;
  message: string;
  paid_at: string;
  created_at: string;
  channel: 'card' | 'bank';
  currency: 'NGN' | 'GHS' | 'ZAR';
  ip_address: string;
  metadata: Record<string, unknown>;
  log: Record<string, unknown[] | string | number | boolean>;
  
  [x: string]: any;
}

export interface PaystackTxnVerifyResponse {
  status: boolean;
  message: string;
  data: PaystackTxnVerifyData;
}
