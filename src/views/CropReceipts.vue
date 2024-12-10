<template>
  <div class="s-flex manage-container">
    <div v-if="showTable">
      <div class="manage-header">
        <h3>Crop Receipts</h3>
        <div class="manage-header-operations">
          <s-button type="primary" class="s-typography-button--large" :loading="loading" @click="handleCreateCR">
            <s-icon name="el-icon-circle-plus" />
            {{ 'Create CR' }}
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
              <span>{{ 'CR ID' }}</span>
            </template>
            <template v-slot="{ row }">
              <div>
                <div>{{ row.id }}</div>
              </div>
            </template>
          </s-table-column>
          <s-table-column width="120">
            <template #header>
              <span>{{ 'CREATE DATE' }}</span>
            </template>
            <template v-slot="{ row }">
              <div>
                <div>{{ row.date }}</div>
              </div>
            </template>
          </s-table-column>
          <s-table-column width="120">
            <template #header>
              <span>{{ 'FINISH DATE' }}</span>
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
              <span>{{ 'DEBITOR' }}</span>
            </template>
            <template v-slot="{ row }">
              <div>
                <div>{{ row.debitor }}</div>
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
          <s-table-column>
            <s-icon @click.native="processCropReceipt" name="el-icon-arrow-right" />
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
    </div>
    <div v-else>
      <crop-receipt-create @back="handleBackFromCreation" />
    </div>
  </div>
</template>

<script lang="ts">
import { components, mixins } from '@soramitsu/soraneo-wallet-web';
import { Component, Mixins } from 'vue-property-decorator';

import ExplorePageMixin from '@/components/mixins/ExplorePageMixin';
import TranslationMixin from '@/components/mixins/TranslationMixin';
import InvestorDeposit from '@/components/pages/Investor/Deposit.vue';
import InvestorWithdraw from '@/components/pages/Investor/Withdraw.vue';
import { PageNames } from '@/consts';
import router, { goTo } from '@/router';

import CropReceiptCreate from './CropReceiptCreate.vue';

@Component({
  components: {
    HistoryPagination: components.HistoryPagination,
    FormattedAmount: components.FormattedAmount,
    InvestorDeposit,
    InvestorWithdraw,
    CropReceiptCreate,
  },
})
export default class CropReceipts extends Mixins(TranslationMixin, mixins.LoadingMixin, ExplorePageMixin) {
  showTable = true;

  get requests() {
    const fixture = {
      id: '2342',
      type: 'Deposit',
      date: '23.11.2024',
      amount: '343.88',
      debitor: 'Name Surname',
      status: 'Approved',
    };
    return [
      fixture,
      fixture,
      fixture,
      { ...fixture, status: 'Decision' },
      { ...fixture, status: 'Decision' },
      fixture,
      { ...fixture, status: 'Closed' },
      fixture,
      fixture,
      { ...fixture, status: 'New' },
      fixture,
      { ...fixture, status: 'New' },
      fixture,
      { ...fixture, status: 'Closed' },
      fixture,
      fixture,
      fixture,
      fixture,
      fixture,
      fixture,
      fixture,
      fixture,
      fixture,
      fixture,
      fixture,
      fixture,
      fixture,
      fixture,
    ];
  }

  get tableItems() {
    return this.getPageItems(this.requests);
  }

  get total(): number {
    return this.requests.length;
  }

  processCropReceipt(): void {
    router.push({ name: PageNames.CropReceiptDetails, params: { id: 'ididid' } });
  }

  getBalanceIndicatorClass(status): string {
    const base = ['status-indicator'];

    switch (status) {
      case 'Approved':
        base.push('status-indicator--approved');
        break;
      case 'New':
        base.push('status-indicator--new');
        break;
      case 'Closed':
        base.push('status-indicator--closed');
        break;
      case 'Decision':
        base.push('status-indicator--decision');
        break;
      default:
        break;
    }

    return base.join(' ');
  }

  handleCreateCR(): void {
    this.showTable = false;
  }

  handleBackFromCreation(): void {
    this.showTable = true;
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

      &--new {
        background-color: #ff9900;
      }

      &--closed {
        background-color: #bbb;
      }

      &--decision {
        background-color: #1070ca;
      }
    }
  }
}

.el-icon-circle-plus {
  margin-right: 8px;
}

.el-icon-arrow-right {
  &:hover {
    cursor: pointer;
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
