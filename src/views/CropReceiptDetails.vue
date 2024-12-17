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
        <div class="status">
          <span :class="getBalanceIndicatorClass(details.status)"></span>
          <div>{{ details.status }}</div>
        </div>
      </div>
      <s-divider />
      <s-scrollbar class="crop-receipt-scrollbar">
        <div class="crop-receipt-details-section">
          <div class="section-title">Common section</div>
          <div class="grid">
            <div class="date">
              <div class="subtitle">Date of issue</div>
              <div>{{ details.dateOfIssue }}</div>
            </div>
            <div class="debitor">
              <div class="subtitle">Debitor</div>
              {{ details.debtor }}
            </div>
            <div class="amount">
              <div class="subtitle">Amount of loan, USD</div>
              <div>{{ details.amount }}</div>
            </div>
            <div class="place">
              <div class="subtitle">Place of issue</div>
              <div>{{ details.placeOfIssue }}</div>
            </div>
            <div class="creditor">
              <div class="subtitle">Creditor</div>
              {{ details.creditor }}
            </div>
            <div class="performance">
              <div class="subtitle">Performance time</div>
              <div>{{ details.performanceTime }}</div>
            </div>
            <div class="rating">
              <div class="subtitle">Country</div>
              <div>{{ details.country }}</div>
            </div>
            <div class="rating">
              <div class="subtitle">Rating</div>
              <div>{{ details.score?.rating || 'Unset' }}</div>
            </div>
          </div>
          <s-divider />
          <div class="conditions">
            <h5>Basic conditions</h5>
            <div v-for="(condition, idx) in conditions.basic" :key="idx + 100">
              <div class="subtitle">{{ condition.field }}</div>
              <div>{{ condition.value }}</div>
            </div>
            <h5>Additional conditions</h5>
            <div v-for="(condition, idx) in conditions.additional" :key="idx + 200">
              <div class="subtitle">{{ condition.field }}</div>
              <div>{{ condition.value }}</div>
            </div>
            <h5>Final provision</h5>
            <div v-for="(condition, idx) in conditions.final" :key="idx + 300">
              <div class="subtitle">{{ condition.field }}</div>
              <div>{{ condition.value }}</div>
            </div>
          </div>
        </div>
      </s-scrollbar>
    </div>

    <div v-if="details.status === 'Decision'" class="crop-receipt-actions">
      <s-button class="btn s-typography-button--large" type="secondary" @click="onDecline">
        {{ 'Decline' }}
      </s-button>
      <s-button class="btn s-typography-button--large" type="primary" @click="onPublish">
        {{ 'Publish' }}
      </s-button>
    </div>
  </div>
</template>

<script lang="ts">
import { FPNumber } from '@sora-substrate/math';
import { api, components, mixins } from '@soramitsu/soraneo-wallet-web';
import { Component, Mixins } from 'vue-property-decorator';

import TranslationMixin from '@/components/mixins/TranslationMixin';
import { PageNames } from '@/consts';
import router from '@/router';
import { state } from '@/store/decorators';

@Component({
  components: {},
})
export default class CropReceiptDetails extends Mixins(mixins.TransactionMixin, TranslationMixin, mixins.LoadingMixin) {
  @state.wallet.account.address accountAddress!: string;

  details = {} as any;

  getBalanceIndicatorClass(status): string {
    const base = ['status-indicator'];

    switch (status) {
      case 'Published':
        base.push('status-indicator--published');
        break;
      case 'Rating':
        base.push('status-indicator--rating');
        break;
      case 'Declined':
        base.push('status-indicator--declined');
        break;
      case 'Decision':
        base.push('status-indicator--decision');
        break;
      default:
        break;
    }

    return base.join(' ');
  }

  handleBack(): void {
    router.push({ name: PageNames.CropReceipts });
  }

  onDecline(): void {
    this.withNotifications(async () => {
      const { id: crId } = this.$route.params;

      if (crId) {
        await api.presto.declineCropReceipt(Number(crId));
      }
    });
  }

  onPublish(): void {
    this.withNotifications(async () => {
      const { id: crId } = this.$route.params;

      if (crId) {
        await api.presto.publishCropReceipt(Number(crId), new FPNumber(this.details.amount).toCodecString());
      }
    });
  }

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
    additional: [
      {
        field: "Debtor's Guarantees:",
        value: `
The Debtor represents, acknowledges and guarantees that:

(i) the future harvest of agricultural produce, which is the Subject of the Pledge under the Crop Receipt, is not alienated in any way and is not encumbered in favor of other individuals or legal entities, including under other Crop receipts, and is not the disputed (including in court); is not seized (arrested) and / or bailed, and no third parties have any interest in it;

(ii) The subject of the Pledge is not encumbered by any debts or obligations [except as a security against fulfillment by the Debtor's of obligations under crop receipts, issued earlier, namely: [provide information on such crop receipts]];

(iii) The Debtor has the right [of ownership and / or to use] to the Land Plots and is entitled to issue this Crop Receipt;

(iv) The debtor is not aware of any disputes concerning his rights to use the Land Plots for growing of agricultural produce; and

(v) The creditor and / or his representatives will have unimpeded access to the places of growing and storage of the Subject of Pledge.`,
      },
      {
        field: 'Insurance:',
        value:
          'The Debtor is [obliged / entitled] at its own expense to insure in favor of the Creditor the future harvest and / or the harvested crop, which is the Subject of Pledge, having previously agreed in writing with the Creditor the list of insurance cases and the insurance company.',
      },
      {
        field: 'Production Technology:',
        value: `The Debtor undertakes to comply with the agrotechnology specified in Annex №3 for growing produce on the Land Plots. In the event of a dispute between the Debtor and the Creditor regarding the Debtor's compliance with the technology of growing the Subject of Pledge, they will seek [recommendation / dispute resolution] tfrom the following person: [[name or title of the person who will resolve the technology dispute] or [the person whose candidacy will be additionally agreed between the Debtor and the Creditor, and in case of disagreement of any candidacy - the dispute will be resolved in court] - choose what applies].`,
      },
    ],
    final: [
      {
        field: 'Advisal of Rights:',
        value: `By signing this Crop Receipt [each] signatory acknowledges that he/she has read and understood all the provisions of this Crop Receipt, and legal consequences of this document, that is corresponds to his/her real intentions, he/she has no objections to any part of this Crop Receipt, the content of which corresponds to the current legislation and contains all information on the relationship between the Debtor [and Guarantor] and the Creditor; the notary explained the meaning of signing this Crop Receipt and all provisions of the current legislation governing the relations under crop receipts; and that for certification of this Crop Receipt all relevant documents, which are of their final and current version have been made available.`,
      },
      {
        field: 'Signature:',
        value: `	
By signing the Crop Receipt the Debtor [and Guarantor] acknowledges that the issuance of the Crop Receipt reflects his/her free will, the Debtor [and Guarantor] is not under the influence of difficult circumstances, is not mistaken with regard to any circumstances of significance (nature of the Crop Receipt, rights and obligations of the Debtor [and Guarantor] and the Creditor, other conditions of the Crop Receipt), and that provisions of the Crop Receipt are favorable for him/her. The Debtor [and Guarantor] accepts the risk of non-fulfilling the provisions of the Crop Receipt due to significant change in the circumstances that the Debtor [and Guarantor] relied upon while issuing this Crop Receipt. On behalf of the Debtor this Crop Receipt is signed by his/her [manager / representative / other authorized signatory] ___________________, which acts on the basis [statute / power of attorney / other document: ____________], whose identity has been established and the authority verified. [On behalf of the Guarantor, this Crop Receipt is signed by his/her [manager / representative/ other authorized signatory] _______________________, acting on the basis of [statute / power of attorney/ other document: ____________], whose identity has been established and authority verified.]

 

[[The Crop Receipt is not subject to signing by the Creditor.] OR [By signing the Crop Receipt, the Creditor confirms that he/she has received the original copy of the Crop Receipt. On behalf of the Creditor, this Crop Receipt is signed by his/her [manager / representative/ other authorized signatory] _______________________, acting on the basis of [statute / power of attorney/ other document: ____________], whose identity has been established and the authority verified.]]`,
      },
    ],
  };

  async created(): Promise<void> {
    // optimize when coming from another place

    this.withApi(async () => {
      const cropReceipts = await api.presto.getCropReceipts(this.accountAddress);

      const parsedCropReceipts = cropReceipts.map((request) => ({
        ...request,
        status: typeof request.status === 'string' ? request.status : Object.keys(request.status)[0],
        dateOfIssue: new Date(Number(request.time?.replace(/,/g, ''))).toLocaleDateString('en-US'),
        performanceTime: new Date(Number(request.perfomanceTime?.replace(/,/g, '') * 1000)).toLocaleDateString('en-US'), // typo on backend
        closeInitialPeriod: new Date(Number(request.closeInitialPeriod?.replace(/,/g, ''))).toLocaleDateString('en-US'),
        amount: FPNumber.fromCodecValue(request.amount).toString(),
      }));

      const id = this.$route.params.id;
      if (id) this.details = parsedCropReceipts.find((cr) => cr.crId === id);
    });
  }
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

    &--published {
      background-color: #009900;
    }

    &--declined {
      background-color: #ff0000;
    }

    &--rating {
      background-color: #ff9900;
    }

    &--decision {
      background-color: #1070ca;
    }
  }
}
</style>
