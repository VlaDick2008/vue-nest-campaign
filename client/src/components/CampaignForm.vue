<template>
  <div class="space-y-4">
    <div class="bg-white p-4 rounded-lg shadow-sm">
      <h2 class="text-lg font-medium mb-2">Выберите каналы</h2>
      <ChannelSelector :definitions="definitions" :selected="selected" @toggle="toggleChannel" />

      <div v-if="store.getValidationErrors().length > 0" class="mt-2 text-red-500 text-sm">
        <div v-for="(error, index) in store.getValidationErrors()" :key="index">
          {{ error }}
        </div>
      </div>
    </div>

    <div v-if="selected.length > 0" class="bg-white p-4 rounded-lg shadow-sm">
      <h2 class="text-lg font-medium mb-2">Порядок каналов</h2>
      <Sortable :list="selected" tag="div" class="flex flex-wrap gap-2" @change="onSortChange">
        <template #item="{ element }">
          <div class="p-2 bg-gray-100 rounded cursor-move">
            {{ getName(element) }}
          </div>
        </template>
      </Sortable>
    </div>

    <div v-for="chId in selected" :key="chId" class="bg-white p-4 rounded-lg shadow-sm">
      <h2 class="text-lg font-medium mb-2">{{ getName(chId) }}</h2>

      <div v-if="store.getValidationErrors(chId).length > 0" class="mb-3 p-2 bg-red-50 text-red-600 rounded text-sm">
        <div v-for="(error, index) in store.getValidationErrors(chId)" :key="index">
          {{ error }}
        </div>
      </div>

      <UiInput label="Текст сообщения" v-model="configs[chId].text" :maxlength="getLimits(chId).textLimit"
        class="mb-2" />

      <div class="flex items-center gap-2 my-3">
        <input id="kb-{{ chId }}" type="checkbox" v-model="configs[chId].keyboardEnabled" />
        <label :for="'kb-' + chId">Включить клавиатуру</label>
      </div>

      <div v-if="configs[chId].keyboardEnabled" class="space-y-3 mt-2 p-3 bg-gray-50 rounded">
        <div class="flex items-center gap-2">
          <span class="text-sm">Тип клавиатуры:</span>
          <select v-model="configs[chId].mode" class="p-1 border rounded">
            <option value="standard">Стандарт</option>
            <option value="inline">Inline</option>
          </select>
        </div>

        <div class="text-sm text-gray-500">
          Макс. кнопок: {{ configs[chId].mode === 'inline'
            ? getLimits(chId).inlineButtons
            : getLimits(chId).standardButtons }}
        </div>

        <div class="space-y-2">
          <div v-for="(btn, idx) in configs[chId].buttons" :key="idx" class="flex gap-2 items-center">
            <UiInput v-model="btn.label" placeholder="Текст кнопки" :maxlength="configs[chId].mode === 'inline'
              ? getLimits(chId).inlineLabelMaxLength
              : getLimits(chId).labelMaxLength" />

            <select v-if="getLimits(chId).supportsUrl" v-model="btn.type" class="p-1 border rounded">
              <option value="quick_reply">Быстрый ответ</option>
              <option value="url">Ссылка</option>
            </select>

            <UiInput v-if="btn.type === 'url'" v-model="btn.payload" placeholder="https://..." />

            <button type="button" class="text-red-500" @click="removeButton(chId, idx)">✕</button>
          </div>
        </div>

        <UiButton type="button" @click="addButton(chId)" :disabled="isButtonLimitReached(chId)"
          :variant="isButtonLimitReached(chId) ? 'secondary' : 'primary'">
          + Добавить кнопку
        </UiButton>
      </div>
    </div>

    <!-- Save Campaign Button -->
    <div class="mt-6 flex justify-end">
      <UiButton variant="primary" @click="saveCampaign" :disabled="loading">
        <span v-if="loading">Сохранение...</span>
        <span v-else>Сохранить кампанию</span>
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCampaignStore } from '../stores/campaign';
import ChannelSelector from './ChannelSelector.vue';
import UiButton from './ui/UiButton.vue';
import UiInput from './ui/UiInput.vue';
import { Sortable } from 'sortablejs-vue3';

const store = useCampaignStore();
const { selected, configs, definitions, loading } = storeToRefs(store);

onMounted(() => {
  store.loadDefinitions();
});

function toggleChannel(id: string) {
  store.toggleChannel(id);
}

function getName(id: string) {
  return store.getDefinition(id)?.name || '—';
}

function getLimits(id: string) {
  const def = store.getDefinition(id);
  return {
    textLimit: def?.textLimit ?? null,
    labelMaxLength: def?.labelMaxLength ?? null,
    inlineLabelMaxLength: def?.inlineLabelMaxLength ?? null,
    standardButtons: def?.standardButtons ?? 0,
    inlineButtons: def?.inlineButtons ?? 0,
    supportsUrl: def?.supportsUrl ?? false,
    supportsQuickReply: def?.supportsQuickReply ?? true,
  };
}

function isButtonLimitReached(channelId: string) {
  const config = configs.value[channelId];
  const limits = getLimits(channelId);
  const maxButtons = config.mode === 'inline' ? limits.inlineButtons : limits.standardButtons;
  return config.buttons.length >= maxButtons;
}

function addButton(channelId: string) {
  if (!isButtonLimitReached(channelId)) {
    store.addButton(channelId);
  }
}

function removeButton(channelId: string, idx: number) {
  store.removeButton(channelId, idx);
}

async function saveCampaign() {
  await store.saveCampaign();
}

function onSortChange(evt: { oldIndex: number; newIndex: number }) {
  const list = [...selected.value];
  const [moved] = list.splice(evt.oldIndex, 1);
  list.splice(evt.newIndex, 0, moved);
  store.setOrder(list);
}
</script>