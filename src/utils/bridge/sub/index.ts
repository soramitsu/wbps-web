import { Operation } from '@sora-substrate/util';
import { BridgeTxStatus } from '@sora-substrate/util/build/bridgeProxy/consts';

import store from '@/store';
import { Bridge } from '@/utils/bridge/common/classes';
import type { RemoveTransactionByHash, IBridgeConstructorOptions } from '@/utils/bridge/common/types';
import { SubBridgeOutgoingReducer, SubBridgeIncomingReducer } from '@/utils/bridge/sub/classes/reducers';
import type { SubBridgeReducer } from '@/utils/bridge/sub/classes/reducers';
import { getTransaction, updateTransaction } from '@/utils/bridge/sub/utils';

import type { SubHistory } from '@sora-substrate/util/build/bridgeProxy/sub/types';

interface SubBridgeConstructorOptions extends IBridgeConstructorOptions<SubHistory, SubBridgeReducer> {
  removeTransactionByHash: RemoveTransactionByHash<SubHistory>;
}

type SubBridge = Bridge<SubHistory, SubBridgeReducer, SubBridgeConstructorOptions>;

const subBridge: SubBridge = new Bridge({
  reducers: {
    [Operation.SubstrateIncoming]: SubBridgeIncomingReducer,
    [Operation.SubstrateOutgoing]: SubBridgeOutgoingReducer,
  },
  signExternal: {
    [Operation.SubstrateIncoming]: async (id: string) => store.dispatch.bridge.signSubBridgeIncomingSub(id),
  },
  signSora: {
    [Operation.SubstrateOutgoing]: async (id: string) => store.dispatch.bridge.signSubBridgeOutgoingSora(id),
  },
  // states
  boundaryStates: {
    done: BridgeTxStatus.Done,
    failed: [BridgeTxStatus.Failed],
  },
  // assets
  addAsset: (assetAddress: string) => store.dispatch.wallet.account.addAsset(assetAddress),
  getAssetByAddress: (address: string) => store.getters.assets.assetDataByAddress(address),
  // transaction
  getTransaction: (id: string) => (getTransaction(id) || store.getters.bridge.history[id]) as SubHistory,
  updateTransaction,
  // ui integration
  showNotification: (tx: SubHistory) => store.commit.bridge.setNotificationData(tx),
  updateHistory: () => store.dispatch.bridge.updateInternalHistory(),
  getActiveTransaction: () => store.getters.bridge.historyItem as SubHistory,
  addTransactionToProgress: (id: string) => store.commit.bridge.addTxIdInProgress(id),
  removeTransactionFromProgress: (id: string) => store.commit.bridge.removeTxIdFromProgress(id),
  // custom
  removeTransactionByHash: (options: { tx: Partial<SubHistory>; force: boolean }) =>
    store.dispatch.bridge.removeHistory(options),
});

export default subBridge;
