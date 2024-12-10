<template>
  <wallet-base
    v-loading="loading"
    :title="'Create'"
    :show-back="true"
    :title-center="true"
    @back="handleBack"
    class="crop-receipt-create"
  >
    <div v-if="currentStep === Steps.CommonInfo" class="crop-receipt-form">
      <p>{{ 'Date of issue:' }}</p>
      <s-date-picker
        v-model="dateOfIssue"
        class="crop-receipt-input"
        :placeholder="datePlaceholder"
        value-format="timestamp"
        type="date"
      />
      <p>{{ 'Performance date:' }}</p>
      <s-date-picker
        v-model="performanceDate"
        class="crop-receipt-input"
        :placeholder="datePlaceholder"
        value-format="timestamp"
        type="date"
      />
      <s-dropdown class="crop-receipt-input" trigger="click" :size="18" popper-class="stock-book-switcher">
        {{ selectedCountry }}
        <template slot="menu">
          <s-dropdown-item v-for="{ name } in Country" :key="name" @click.native="handleSelectCountry(name)">{{
            name
          }}</s-dropdown-item>
        </template>
      </s-dropdown>
      <s-input
        class="input-textarea crop-receipt-input"
        type="textarea"
        :rows="5"
        :disabled="loading"
        :placeholder="'Debitor'"
        :maxlength="1000"
        v-model="debitor"
      />
      <s-input
        class="input-textarea crop-receipt-input"
        type="textarea"
        :rows="5"
        :disabled="loading"
        :placeholder="'Creditor'"
        :maxlength="1000"
        v-model="creditor"
      />
      <s-float-input
        class="input-amount crop-receipt-input"
        :placeholder="'Amount of Loan, USD'"
        :disabled="loading"
        v-model="amount"
      />
    </div>
    <basic v-else-if="currentStep === Steps.BasicConditions" />
    <additional v-else-if="currentStep === Steps.AdditionalConditions" />
    <final v-else-if="currentStep === Steps.FinalProvisions" />
    <s-button class="crop-receipt-btn s-typography-button--large" type="primary" @click="handleClick">
      {{ 'Next' }}
    </s-button>
  </wallet-base>
</template>

<script lang="ts">
import { mixins, components } from '@soramitsu/soraneo-wallet-web';
import { Component, Mixins } from 'vue-property-decorator';

// import Additional from '@/components/pages/CropReceipt/Terms/Additional.vue';
// import Basic from '@/components/pages/CropReceipt/Terms/Basic.vue';
// import Final from '@/components/pages/CropReceipt/Terms/Final.vue';
import { Components } from '@/consts';
import { lazyComponent } from '@/router';
import { mutation, state } from '@/store/decorators';

enum Steps {
  CommonInfo = 'CommonInfo',
  BasicConditions = 'BasicConditions',
  AdditionalConditions = 'AdditionalConditions',
  FinalProvisions = 'FinalProvisions',
}

@Component({
  components: {
    // Additional,
    // Basic,
    // Final,
    DialogBase: components.DialogBase,
    WalletBase: components.WalletBase,
    InfoLine: components.InfoLine,
  },
})
export default class CropReceiptCreate extends Mixins(mixins.TransactionMixin, mixins.DialogMixin) {
  dateOfIssue = '';
  performanceDate = '';
  placeOfIssue = '';
  debitor = '';
  creditor = '';
  amount = '';
  invoiceNumber = '';
  datePlaceholder = 'Pick date';
  selectedCountry = 'Brazil';

  Country = [
    { name: 'Brazil' },
    { name: 'Indonesia' },
    { name: 'Nigeria' },
    { name: 'Ukraine' },
    { name: 'Usa' },
    { name: 'Other' },
  ];

  readonly Steps = Steps;
  currentStep = Steps.CommonInfo;

  handleBack(): void {
    this.$emit('back');
  }
  handleClick(): void {}
  handleSelectCountry(country: string): void {
    this.selectedCountry = country;
  }
}
</script>

<style lang="scss">
.crop-receipt-create {
  display: flex;
  min-width: 464px;
  flex-direction: column;

  textarea {
    resize: none;
    white-space: pre-wrap;
  }
}

.crop-receipt {
  &-input {
    margin-bottom: 16px;
  }
}

.crop-receipt-btn {
  width: 100%;
}
</style>
