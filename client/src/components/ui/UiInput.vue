<template>
  <label class="block">
    <span v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</span>
    <input :type="type" :placeholder="placeholder" :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" :maxlength="maxlength"
      class="mt-1 block w-full p-2 border rounded" />
    <span v-if="maxlength && modelValue" class="text-xs text-gray-500">
      {{ modelValue.length }}/{{ maxlength }}
    </span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
  type?: string;
  placeholder?: string;
  modelValue?: string;
  maxlength?: number;
}>();

defineEmits(['update:modelValue']);
</script>
