<template>
  <dialog-base
    class="investor-deposit"
    :title="'Deposit USD'"
    :visible.sync="isVisible"
    :tooltip="'Please specify amount and invoice number'"
  >
    <p class="investor-deposit__disclaimer">
      Please make payment transaction from your account to the bank associated with the PRESTO platform.
    </p>
    <info-line class="total-line" :label="'SWIFT'" :value="'AAAA-BB-CC-123'" />
    <info-line class="total-line" :label="'BIC'" :value="'HBUKGB4B - HBUK'" />
    <s-float-input
      class="input-amount"
      :placeholder="'Amount sent'"
      :minlength="1"
      :maxlength="33"
      :disabled="loading"
      v-model="amountSent"
    />
    <s-input
      class="input-invoice"
      :placeholder="'Invoice number'"
      :minlength="1"
      :maxlength="33"
      :disabled="loading"
      v-model="invoiceNumber"
    />
    <s-button class="btn s-typography-button--large" type="primary" @click="onCreate">
      {{ 'Create' }}
    </s-button>
    <s-button class="btn s-typography-button--large" type="secondary" @click="onCancel">
      {{ 'Cancel' }}
    </s-button>
  </dialog-base>
</template>

<script lang="ts">
import { mixins, components } from '@soramitsu/soraneo-wallet-web';
import { Component, Mixins } from 'vue-property-decorator';

import { Components } from '@/consts';
import { lazyComponent } from '@/router';
import { mutation, state } from '@/store/decorators';

@Component({
  components: {
    DialogBase: components.DialogBase,
    InfoLine: components.InfoLine,
    AlertList: lazyComponent(Components.AlertList),
    CreateAlert: lazyComponent(Components.CreateAlert),
    AlertsSelectAsset: lazyComponent(Components.SelectToken),
  },
})
export default class Deposit extends Mixins(mixins.TransactionMixin, mixins.DialogMixin) {
  amountSent = '';
  invoiceNumber = '';

  onCreate(): void {}

  onCancel(): void {}
}
</script>

<style lang="scss">
.investor-deposit {
  .input-amount {
    margin-top: 16px;
    margin-bottom: 16px;
  }

  .input-invoice {
    margin-bottom: 16px;
  }

  .btn {
    display: block;
    width: 100%;
    margin: 8px 0 0 0;
  }

  &__disclaimer {
    color: var(--s-color-base-content-secondary);
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 16px;
  }
}
</style>
