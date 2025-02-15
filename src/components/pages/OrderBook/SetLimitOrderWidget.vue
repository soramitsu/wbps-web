<template>
  <base-widget extensive v-loading="loadingState">
    <div class="order-book-tabs">
      <s-tabs :value="currentTab" type="card" @input="handleChangeTab">
        <s-tab
          v-for="bookTab in LimitOrderTabsItems"
          :key="bookTab"
          :label="t(`orderBook.${bookTab}`)"
          :name="bookTab"
        />
      </s-tabs>
    </div>
    <div>
      <buy-sell />
    </div>
  </base-widget>
</template>

<script lang="ts">
import { PriceVariant } from '@sora-substrate/liquidity-proxy';
import { mixins } from '@soramitsu/soraneo-wallet-web';
import { Component, Mixins, Watch } from 'vue-property-decorator';

import TranslationMixin from '@/components/mixins/TranslationMixin';
import { Components } from '@/consts';
import { lazyComponent } from '@/router';
import { mutation, state } from '@/store/decorators';

@Component({
  components: {
    BaseWidget: lazyComponent(Components.BaseWidget),
    BuySell: lazyComponent(Components.BuySell),
  },
})
export default class SetLimitOrderWidget extends Mixins(TranslationMixin, mixins.LoadingMixin) {
  @state.orderBook.side side!: PriceVariant;

  @mutation.orderBook.setSide setSide!: (side: PriceVariant) => void;

  readonly LimitOrderTabsItems = PriceVariant;

  currentTab = PriceVariant.Buy;

  @Watch('side')
  private handleSideChange(side: PriceVariant): void {
    this.handleChangeTab(side);
  }

  get loadingState(): boolean {
    return this.parentLoading || this.loading;
  }

  handleChangeTab(side: PriceVariant): void {
    this.currentTab = side;
    this.setSide(side);
  }
}
</script>

<style lang="scss">
$book-tabs-height: 64px;

.order-book-tabs {
  border-radius: var(--s-border-radius-small);
  padding-top: 0;
  padding-right: 0;
  padding-left: 0;
  .s-tabs {
    background-color: inherit;
    &,
    .el-tabs__header,
    .el-tabs__nav-wrap,
    .el-tabs__active-bar {
      border-top-right-radius: inherit;
      border-top-left-radius: inherit;
    }
  }
  .el-tabs__header,
  .el-tabs__nav {
    width: 100%;
  }
  .el-tabs__header {
    margin: 0 0 $inner-spacing-mini;
    .el-tabs {
      &__nav,
      &__nav-wrap,
      &__item {
        height: $book-tabs-height;
        line-height: $book-tabs-height;
      }
      &__nav {
        .el-tabs__item {
          width: 50%;
        }
      }
      &__nav-wrap {
        .el-tabs__item {
          &,
          &.is-active {
            border-top-right-radius: 0;
            border-top-left-radius: inherit;

            @include page-header-title(true);
          }
          &:last-child {
            border-top-right-radius: inherit;
            border-top-left-radius: 0;
          }
        }
      }
    }
  }
  .s-tabs + * {
    padding-top: $inner-spacing-big;
    padding-right: $inner-spacing-big;
    padding-left: $inner-spacing-big;
  }
}
</style>
