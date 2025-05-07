<template>
  <div class="flex flex-wrap gap-2">
    <UiButton v-for="ch in definitions" :key="ch.id" :variant="selected.includes(ch.id) ? 'primary' : 'secondary'"
      @click="handleButtonClick(ch.id)">
      {{ ch.name }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import UiButton from './ui/UiButton.vue';

defineProps<{
  definitions: { id: string; name: string }[];
  selected: string[];
}>();

const emit = defineEmits(['toggle']);

function handleButtonClick(id: string) {
  emit('toggle', id);
}
</script>
