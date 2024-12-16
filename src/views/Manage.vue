<template>
  <div class="s-flex manage-container">
    <div>
      <div class="manage-header">
        <h3>Manage USD</h3>
        <div class="manage-header-operations">
          <s-button type="primary" class="s-typography-button--large" :loading="loading" @click="handleWithdraw">
            {{ 'Withdraw' }}
            <s-icon name="basic-download-bold-24" />
          </s-button>
          <s-button type="primary" class="s-typography-button--large" :loading="loading" @click="handleDeposit">
            {{ 'Deposit' }}
            <s-icon name="basic-download-24" />
          </s-button>
        </div>
      </div>
      <div v-loading="parentLoading" class="container container--manage">
        <s-table
          ref="table"
          v-loading="loadingState"
          :data="tableItems"
          :highlight-current-row="false"
          size="small"
          class="explore-table"
        >
          <s-table-column width="120">
            <template #header>
              <span>{{ 'REQUEST ID' }}</span>
            </template>
            <template v-slot="{ row }">
              <div>
                <div>{{ row.requestId }}</div>
              </div>
            </template>
          </s-table-column>
          <s-table-column width="130">
            <template #header>
              <span>{{ 'TYPE' }}</span>
            </template>
            <template v-slot="{ row }">
              <div>
                <div>{{ row.type }}</div>
              </div>
            </template>
          </s-table-column>
          <s-table-column width="120">
            <template #header>
              <span>{{ 'DATE' }}</span>
            </template>
            <template v-slot="{ row }">
              <div>
                <div>{{ row.date }}</div>
              </div>
            </template>
          </s-table-column>
          <s-table-column width="120">
            <template #header>
              <span>{{ 'AMOUNT' }}</span>
            </template>
            <template v-slot="{ row }">
              <div>
                <formatted-amount :value="row.amount" is-fiat-value />
              </div>
            </template>
          </s-table-column>
          <s-table-column width="160">
            <template #header>
              <span>{{ 'PAYMENT REF...' }}</span>
            </template>
            <template v-slot="{ row }">
              <div>
                <div>{{ row.paymentReference }}</div>
              </div>
            </template>
          </s-table-column>
          <s-table-column width="130">
            <template #header>
              <span>{{ 'STATUS' }}</span>
            </template>
            <template v-slot="{ row }">
              <div class="status">
                <span :class="getBalanceIndicatorClass(row.status)"></span>
                <div>{{ row.status }}</div>
              </div>
            </template>
          </s-table-column>
          <s-table-column width="120">
            <template v-slot="{ row }">
              <s-button
                v-if="row.status === 'Pending'"
                class="investor-cancel-btn s-typography-button--small"
                size="mini"
                type="primary"
                @click="cancelRequest(row.requestId)"
              >
                {{ 'Cancel' }}
              </s-button>
            </template>
          </s-table-column>
        </s-table>

        <history-pagination
          class="explore-table-pagination"
          :current-page="currentPage"
          :page-amount="pageAmount"
          :total="total"
          :last-page="lastPage"
          :loading="loadingState"
          @pagination-click="handlePaginationClick"
        />
      </div>

      <investor-deposit :visible.sync="depositDialogVisibility" />
      <investor-withdraw :visible.sync="withdrawDialogVisibility" />
    </div>
  </div>
</template>

<script lang="ts">
import { FPNumber } from '@sora-substrate/math';
import { api, components, mixins } from '@soramitsu/soraneo-wallet-web';
import { Component, Mixins } from 'vue-property-decorator';

import ExplorePageMixin from '@/components/mixins/ExplorePageMixin';
import TranslationMixin from '@/components/mixins/TranslationMixin';
import InvestorDeposit from '@/components/pages/Investor/Deposit.vue';
import InvestorWithdraw from '@/components/pages/Investor/Withdraw.vue';
import { state } from '@/store/decorators';

@Component({
  components: {
    HistoryPagination: components.HistoryPagination,
    FormattedAmount: components.FormattedAmount,
    InvestorDeposit,
    InvestorWithdraw,
  },
})
export default class ManageView extends Mixins(
  TranslationMixin,
  mixins.LoadingMixin,
  ExplorePageMixin,
  mixins.TransactionMixin
) {
  @state.wallet.account.address accountAddress!: string;

  depositDialogVisibility = false;
  withdrawDialogVisibility = false;
  requests = [] as any;

  get tableItems() {
    return this.getPageItems(this.requests);
  }

  get total(): number {
    return this.requests.length;
  }

  getBalanceIndicatorClass(status): string {
    const base = ['status-indicator'];

    switch (status) {
      case 'Approved':
        base.push('status-indicator--approved');
        break;
      case 'Pending':
        base.push('status-indicator--pending');
        break;
      case 'Cancelled':
        base.push('status-indicator--cancelled');
        break;
      case 'Declined':
        base.push('status-indicator--declined');
        break;
      default:
        break;
    }

    return base.join(' ');
  }

  handleDeposit(): void {
    this.depositDialogVisibility = true;
  }

  handleWithdraw(): void {
    this.withdrawDialogVisibility = true;
  }
  async cancelRequest(requestId): Promise<void> {
    this.withNotifications(async () => {
      await api.presto.cancelRequest(requestId);
    });
  }

  async created(): Promise<void> {
    this.withApi(async () => {
      const requests = await api.presto.getRequests(this.accountAddress);

      const parsedRequests = requests.map((request) => ({
        ...request,
        status: typeof request.status === 'string' ? request.status : Object.keys(request.status)[0],
        date: new Date(Number(request.time.replace(/,/g, ''))).toLocaleDateString('en-US'),
        amount: FPNumber.fromCodecValue(request.amount).toString(),
      }));

      this.requests = parsedRequests;
    });
  }
}
</script>

<style lang="scss">
@include explore-table;

.container--manage {
  margin-top: $basic-spacing;
  max-width: unset;

  .status {
    display: flex;
    justify-content: center;
    align-items: center;

    .status-indicator {
      height: 8px;
      width: 8px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 8px;

      &--approved {
        background-color: #009900;
      }

      &--pending {
        background-color: #ff9900;
      }

      &--cancelled {
        background-color: #bbb;
      }

      &--declined {
        background-color: #ff0000;
      }
    }
  }
}

.investor-cancel-btn {
  font-size: 12px !important;
  margin-left: 24px;

  &.el-button--primary span {
    font-variation-settings: 'wght' 550 !important;
  }
}

.manage {
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &-container {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }
}
</style>
