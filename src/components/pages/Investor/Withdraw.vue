<template>
  <dialog-base
    :title="'Withdraw USD'"
    class="investor-withdraw"
    :visible.sync="isVisible"
    :tooltip="'Please specify amount to withdraw as well insert into bank details template all the necessary information.'"
  >
    <p class="investor-withdraw__disclaimer">Please provide your bank details in order to withdraw USD.</p>
    <s-float-input
      class="input-amount"
      :placeholder="'Amount to withdraw'"
      :minlength="1"
      :maxlength="33"
      :disabled="loading"
      v-model="amountToWithdraw"
    />
    <s-input
      class="input-textarea"
      type="textarea"
      rows="17"
      :disabled="loading"
      :placeholder="'Bank account details'"
      :maxlength="1000"
      v-model="bankDetails"
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
    AlertList: lazyComponent(Components.AlertList),
    CreateAlert: lazyComponent(Components.CreateAlert),
    AlertsSelectAsset: lazyComponent(Components.SelectToken),
  },
})
export default class Deposit extends Mixins(mixins.TransactionMixin, mixins.DialogMixin) {
  amountToWithdraw = '';
  bankDetails = `
  Name Lastname:\n
  SWIFT/BIC:\n
  IBAN:\n
  Bank name:\n
  Address of the bank:\n
  City:\n
  Codepost:\n
  Country:\n
  `;

  onCreate(): void {}

  onCancel(): void {}
}
</script>

<style lang="scss">
.investor-withdraw {
  .btn {
    display: block;
    width: 100%;
    margin: 8px 0 0 0;
  }

  .input-textarea {
    margin-top: 16px;
  }

  &__disclaimer {
    color: var(--s-color-base-content-secondary);
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 16px;
  }
}
</style>
