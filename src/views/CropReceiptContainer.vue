<template>
  <router-view
    v-bind="{
      parentLoading: subscriptionsDataLoading,
      ...$attrs,
    }"
    v-on="$listeners"
    v-loading="subscriptionsDataLoading"
  />
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';

import SubscriptionsMixin from '@/components/mixins/SubscriptionsMixin';
import { PageNames } from '@/consts';
import { goTo } from '@/router';
import { action, getter } from '@/store/decorators';

@Component
export default class CropReceiptContainer extends Mixins(SubscriptionsMixin) {}
</script>
