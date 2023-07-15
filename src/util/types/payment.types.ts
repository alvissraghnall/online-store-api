
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
