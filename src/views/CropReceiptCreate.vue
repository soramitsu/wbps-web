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
      <s-input
        class="crop-receipt-input"
        :placeholder="'Place of issue'"
        :minlength="1"
        :maxlength="33"
        :disabled="loading"
        v-model="placeOfIssue"
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
    <div v-else>
      <s-input
        class="input-textarea crop-receipt-input"
        type="textarea"
        :rows="5"
        :disabled="loading"
        :placeholder="'Basic Conditions'"
        :maxlength="10000"
        v-model="termsBasic"
      />
      <s-input
        class="input-textarea crop-receipt-input"
        type="textarea"
        :rows="5"
        :disabled="loading"
        :placeholder="'Additional Conditions'"
        :maxlength="10000"
        v-model="termsAdditional"
      />
      <s-input
        class="input-textarea crop-receipt-input"
        type="textarea"
        :rows="5"
        :disabled="loading"
        :placeholder="'Final Conditions'"
        :maxlength="10000"
        v-model="termsFinal"
      />
    </div>
    <!-- <basic v-else-if="currentStep === Steps.BasicConditions" />
    <additional v-else-if="currentStep === Steps.AdditionalConditions" />
    <final v-else-if="currentStep === Steps.FinalProvisions" /> -->
    <s-button class="crop-receipt-btn s-typography-button--large" type="primary" @click="handleClick">
      {{ 'Next' }}
    </s-button>
  </wallet-base>
</template>

<script lang="ts">
import { mixins, components, api } from '@soramitsu/soraneo-wallet-web';
import { Component, Mixins } from 'vue-property-decorator';

// import Additional from '@/components/pages/CropReceipt/Terms/Additional.vue';
// import Basic from '@/components/pages/CropReceipt/Terms/Basic.vue';
// import Final from '@/components/pages/CropReceipt/Terms/Final.vue';
import { Components, PageNames } from '@/consts';
import router, { lazyComponent } from '@/router';
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
  selectedCountry: Country = 'Brazil';

  termsBasic =
    'This Crop Receipt is issued by the Debtor [as a performance security of] obligations under the Agreement [specify name / type of contract] № [specify contract number] of [specify contract date] concluded between the Debtor and the Creditor.';

  termsAdditional = `
The Debtor represents, acknowledges and guarantees that:

(i) the future harvest of agricultural produce, which is the Subject of the Pledge under the Crop Receipt, is not alienated in any way and is not encumbered in favor of other individuals or legal entities, including under other Crop receipts, and is not the disputed (including in court); is not seized (arrested) and / or bailed, and no third parties have any interest in it;

(ii) The subject of the Pledge is not encumbered by any debts or obligations [except as a security against fulfillment by the Debtor's of obligations under crop receipts, issued earlier, namely: [provide information on such crop receipts]];

(iii) The Debtor has the right [of ownership and / or to use] to the Land Plots and is entitled to issue this Crop Receipt;

(iv) The debtor is not aware of any disputes concerning his rights to use the Land Plots for growing of agricultural produce; and

(v) The creditor and / or his representatives will have unimpeded access to the places of growing and storage of the Subject of Pledge.`;

  termsFinal = `
By signing the Crop Receipt the Debtor [and Guarantor] acknowledges that the issuance of the Crop Receipt reflects his/her free will, the Debtor [and Guarantor] is not under the influence of difficult circumstances, is not mistaken with regard to any circumstances of significance (nature of the Crop Receipt, rights and obligations of the Debtor [and Guarantor] and the Creditor, other conditions of the Crop Receipt), and that provisions of the Crop Receipt are favorable for him/her. The Debtor [and Guarantor] accepts the risk of non-fulfilling the provisions of the Crop Receipt due to significant change in the circumstances that the Debtor [and Guarantor] relied upon while issuing this Crop Receipt. On behalf of the Debtor this Crop Receipt is signed by his/her [manager / representative / other authorized signatory] ___________________, which acts on the basis [statute / power of attorney / other document: ____________], whose identity has been established and the authority verified. [On behalf of the Guarantor, this Crop Receipt is signed by his/her [manager / representative/ other authorized signatory] _______________________, acting on the basis of [statute / power of attorney/ other document: ____________], whose identity has been established and authority verified.]



[[The Crop Receipt is not subject to signing by the Creditor.] OR [By signing the Crop Receipt, the Creditor confirms that he/she has received the original copy of the Crop Receipt. On behalf of the Creditor, this Crop Receipt is signed by his/her [manager / representative/ other authorized signatory] _______________________, acting on the basis of [statute / power of attorney/ other document: ____________], whose identity has been established and the authority verified.]]`;

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
    if (this.currentStep !== Steps.CommonInfo) {
      this.currentStep = Steps.CommonInfo;
      return;
    }
    this.$emit('back');
  }
  async handleClick(): Promise<void> {
    if (this.currentStep === Steps.CommonInfo) {
      this.currentStep = Steps.BasicConditions;
      return;
    }

    const data = this.termsBasic + this.termsAdditional + this.termsFinal;

    this.withNotifications(async () => {
      await api.presto.createCropReceipt(
        this.amount,
        this.selectedCountry,
        Date.now(),
        this.dateOfIssue as any,
        this.placeOfIssue,
        this.debitor,
        this.creditor,
        this.performanceDate as any,
        data
      );

      router.push({ name: PageNames.CropReceipts });
    });
  }
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
