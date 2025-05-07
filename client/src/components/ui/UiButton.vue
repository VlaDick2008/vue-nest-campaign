<template>
  <button :class="['px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm focus:outline-none', variantClass]"
    @click.stop.prevent="handleClick" type="button">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps<{ variant?: 'primary' | 'secondary' }>();
const emit = defineEmits(['click']);

const variantClass = computed(() =>
  props.variant === 'secondary'
    ? 'bg-slate-100 hover:bg-slate-300 text-gray-800'
    : 'bg-blue-600 hover:bg-blue-700 text-white'
);

function handleClick(event: Event) {
  event.stopPropagation();
  emit('click');
}
</script>