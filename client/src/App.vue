<script setup lang="ts">
import { onMounted } from 'vue';
import { useCampaignStore } from './stores/campaign';
import CampaignForm from './components/CampaignForm.vue';

const store = useCampaignStore();

onMounted(() => {
  store.loadDefinitions();
})
</script>

<template>
  <section class="bg-slate-100 min-h-screen flex p-2">
    <div class="bg-white w-full max-w-4xl mx-auto my-8 rounded-xl shadow-md p-6">
      <header class="border-b border-slate-200 pb-4 mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Создание Кампании</h1>
        <p class="text-gray-600">Настройте каналы и сообщения для вашей Кампании</p>
      </header>

      <CampaignForm />
    </div>
  </section>
</template>
