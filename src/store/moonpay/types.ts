import type { MoonpayApi, MoonpayCurrency, MoonpayTransaction } from '@/utils/moonpay';

import type { EthHistory } from '@sora-substrate/sdk/build/bridgeProxy/eth/types';

export type MoonpayState = {
  api: MoonpayApi;
  dialogVisibility: boolean;
  notificationVisibility: boolean;
  notificationKey: any | '';
  confirmationVisibility: boolean;
  pollingTimestamp: number;
  transactions: Array<MoonpayTransaction>;
  transactionsFetching: boolean;
  bridgeTransactionData: Nullable<EthHistory>;
  startBridgeButtonVisibility: boolean;
  currencies: Array<MoonpayCurrency>;
};

export type BridgeTxData = Partial<{
  data: Nullable<EthHistory>;
  startBridgeButtonVisibility: boolean;
}>;
