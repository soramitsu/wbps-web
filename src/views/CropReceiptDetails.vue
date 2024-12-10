<template>
  <div>
    <div class="container crop-receipt">
      <div class="button-back-from-details">
        <s-button
          class="crop-receipt-details-back"
          type="action"
          size="small"
          alternative
          :tooltip="t('assets.details')"
          @click="handleBack"
        >
          <s-icon name="arrows-chevron-left-rounded-24" size="24" />
        </s-button>
      </div>
      <div class="crop-receipt-header">
        <h3>Crop receipt</h3>
        <div>{{ status }}</div>
      </div>
      <s-divider />
      <s-scrollbar class="crop-receipt-scrollbar">
        <div class="crop-receipt-details-section">
          <div class="section-title">Common section</div>
          <div class="grid">
            <div class="date">
              <div class="subtitle">Date of issue</div>
              <div>12.12.2024</div>
            </div>
            <div class="debitor">
              <div class="subtitle">Debitor</div>
              <div>Carl O’Connell</div>
              <div>Tokyo, Shibuya 72</div>
              <div>123-456-789</div>
            </div>
            <div class="amount">
              <div class="subtitle">Amount of loan, USD</div>
              <div>500 000</div>
            </div>
            <div class="place">
              <div class="subtitle">Place of issue</div>
              <div>Porto, Portugal</div>
            </div>
            <div class="creditor">
              <div class="subtitle">Creditor</div>
              <div>Carl O’Connell</div>
              <div>Tokyo, Shibuya 72</div>
              <div>123-456-789</div>
            </div>
            <div class="performance">
              <div class="subtitle">Performance time</div>
              <div>12.12.2024</div>
            </div>
            <div class="rating">
              <div class="subtitle">Rating</div>
              <div>Unset</div>
            </div>
          </div>
          <s-divider />
          <div class="conditions">
            <h5>Basic conditions</h5>
            <div v-for="(condition, idx) in conditions.basic" :key="idx">
              <div class="subtitle">{{ condition.field }}</div>
              <div>{{ condition.value }}</div>
            </div>
            <h5>Additional conditions</h5>
            <div v-for="(condition, idx) in conditions.basic" :key="idx">
              <div class="subtitle">{{ condition.field }}</div>
              <div>{{ condition.value }}</div>
            </div>
            <h5>Final provision</h5>
            <div v-for="(condition, idx) in conditions.basic" :key="idx">
              <div class="subtitle">{{ condition.field }}</div>
              <div>{{ condition.value }}</div>
            </div>
          </div>
        </div>
      </s-scrollbar>
    </div>

    <div class="crop-receipt-actions">
      <s-button class="btn s-typography-button--large" type="secondary" @click="onCancel">
        {{ 'Cancel' }}
      </s-button>
      <s-button class="btn s-typography-button--large" type="primary" @click="onProcess">
        {{ 'Rate' }}
      </s-button>
    </div>
  </div>
</template>

<script lang="ts">
import { components, mixins } from '@soramitsu/soraneo-wallet-web';
import { Component, Mixins } from 'vue-property-decorator';

import TranslationMixin from '@/components/mixins/TranslationMixin';
import { PageNames } from '@/consts';
import router from '@/router';

@Component({
  components: {},
})
export default class CropReceiptDetails extends Mixins(TranslationMixin, mixins.LoadingMixin) {
  get status(): string {
    return 'New';
  }

  handleBack(): void {
    router.push({ name: PageNames.CropReceipts });
  }

  onCancel(): void {}
  onProcess(): void {}

  conditions = {
    basic: [
      {
        field: 'The Crop Receipt underlying agreement:',
        value:
          'This Crop Receipt is issued by the Debtor [as a performance security of] obligations under the Agreement [specify name / type of contract] № [specify contract number] of [specify contract date] concluded between the Debtor and the Creditor.',
      },
      {
        field: 'Unconditional Obligation:',
        value:
          'This Crop Receipt establishes unconditional obligation of the Debtor, secured by the collateral [and surety], to pay the Creditor the amount calculated according to the formula given in Appendix №1.',
      },
      {
        field: 'Terms and Place of Performance:',
        value: `The Debtor shall pay funds as performance of the unconditional obligation under the Crop Receipt (hereinafter - "Payment") by transferring funds in non-cash form in ] to the Creditor’s bank account ], indicated by the Creditor in writing. Other payments under this Crop Receipt are made in the same way.

[On the date of issuance of this Crop Receipt, the Creditor indicated the following bank account: [indicate the details of the Creditor's bank account, if no assignment of the Creditor’s rights under this crop receipt is envisaged]].

All service fees charged by the Debtor's bank [and intermediary bank (if any)] during such funds transfer shall be covered by the Debtor.`,
      },
      {
        field: 'Pledge:',
        value: `
To secure its obligations under the Crop Receipt, the Debtor pledges (hereinafter - "Pledge") the future harvest [name the farm produce used as a pledge] (hereinafter - "Subject of Pledge") grown on land plots located in [specify district name] district of [] , [[owned by the Debtor by virtue of [document certifying ownership title to the land]] and / or [leased or otherwise used by the Debtor on the basis of lease agreements or other transactions]], (hereinafter - "the Land Plots").

On the day of harvest, the subject of the Pledge becomes the corresponding volume of harvested farm produce in the total amount of not less [specify number] [specify units of measurement - tons / kilogram / liters / pieces / heads / other]], grown on the Land Plots.

[The Pledge shall also apply to the future harvest of other farm produce grown or to be grown by the Debtor on the Land, as well as all harvested farm produce grown on the Land Plots.]

On the date of issuance of this Crop Receipt, the value of the Subject of Pledge is estimated at ….. [indicate the value of the future harvest excluding VAT], without VAT. `,
      },
      {
        field: 'Secured Claims:',
        value: `Secured Claims details: The Pledge secures all Creditor's claims to the Debtor to fulfill each and all of its payment obligations under the Crop Receipt in such amount, in such currency, within such term and in such order as established in the Crop Receipt (hereinafter - "Secured Claims"). The Creditor’s claims secured by the Pledge include (but are not limited to) the following:

(i) Payment under the Crop Receipt as provided in paragraphs [2] (Unconditional obligation), [3] (Term of performance) and [4] (Terms and place of performance) specified above;

(ii) [reimbursement of the Creditor's expenses to complete crop growing works and / or eliminate breaches in the farming technology for producing agricultural produce, as provided in paragraph [13] (Completion of Future Crops Production) below;

(iii) reimbursement of the Creditor's expenses related to obtaining the notary enforcement writ, as specified in paragraph [26] (Expenses for the Notary Enforcement Writ) below;

(iv)] payment of penalties, as provided by current legislation [and in paragraph [22] (Penalties) below].

Term of Fulfillment of the Obligation: Each Secured Claim has a term established for it by the relevant provisions of the Crop Receipt.

Secured Claims Value: The Pledge secures the full value of the Secured Claims, regardless of what this value may be at any time during the term of this Crop Receipt. Without limiting the above, on the date of issuance of this Crop Receipt, the value of the Secured Claims is equal to [  ] (hereinafter - the "Estimated Value"), which is the value of the right of claim under this Crop Receipt on the day of its issuance for accounting purposes. `,
      },
      {
        field: 'Endorsement:',
        value:
          'Creditor is [not] entitled to assign its rights under the Crop Receipt [without the prior written consent of the Debtor] / [in the absence / presence of the following conditions: ________________________] to any third party [(except [specify the name of the specific individual or legal entity to whom the rights can be assigned])] by making an Inscription of Assignment. Change of the Debtor under the Crop Receipt is not allowed',
      },
    ],
  };
}
</script>

<style lang="scss">
.crop-receipt {
  @include scrollbar;

  max-width: 800px;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-actions {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn {
      width: 22%;
    }
  }

  .section-title {
    font-weight: 650;
    margin-bottom: 16px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    .subtitle {
      color: var(--s-color-base-content-secondary);
      margin-bottom: 8px;
    }
  }

  .conditions {
    h5 {
      margin-top: 24px;
    }
    margin-top: 24px;

    .subtitle {
      color: var(--s-color-base-content-secondary);
      margin-top: 16px;
      margin-bottom: 8px;
    }
  }
}
.crop-receipt-details-container {
  display: flex;
  margin: auto;
}

.button-back-from-details {
  position: relative;

  .crop-receipt-details-back {
    position: absolute;
    left: -70px;
  }
}

.crop-receipt-scrollbar {
  height: 400px;
}
</style>
