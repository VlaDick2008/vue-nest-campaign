<script setup lang="ts">
import { onMounted } from 'vue';
import { useCampaignStore } from './stores/campaign';

const store = useCampaignStore();

onMounted(() => {
  store.loadDefinitions();

  console.log(store.definitions);

})
</script>

<template>
  <main>
    <h1 class="text-red-500 text-5xl">Biba!</h1>
  </main>
</template>