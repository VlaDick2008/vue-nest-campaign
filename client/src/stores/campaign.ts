import axios from "axios";
import { defineStore } from "pinia";
import { toast } from "vue3-toastify";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface ChannelDefinition {
	id: string;
	name: string;
	textLimit: number | null;
	standardButtons: number;
	inlineButtons: number;
	labelMaxLength: number | null;
	inlineLabelMaxLength: number | null;
	supportsUrl: boolean;
	supportsQuickReply: boolean;
}

export interface ButtonConfig {
	label: string;
	type: "quick_reply" | "url";
	payload?: string;
	event: string;
}

export interface MessageConfig {
	text: string;
	keyboardEnabled: boolean;
	mode: "standard" | "inline";
	buttons: ButtonConfig[];
}

export const useCampaignStore = defineStore("campaign", {
	state: () => ({
		definitions: [] as ChannelDefinition[],
		selected: [] as string[],
		configs: {} as Record<string, MessageConfig>,
		loading: false,
		error: null as string | null,
    validationErrors: {} as Record<string, string[]>,
	}),

	actions: {
		async loadDefinitions() {
      try {
        this.loading = true;
        this.error = null;
        const res = await axios.get<ChannelDefinition[]>(`${apiUrl}/channels`);
        this.definitions = res.data;
      } catch (err) {
        console.error("Failed to load channel definitions:", err);
        this.error = "Не удалось загрузить каналы";
        toast.error("Не удалось загрузить определения каналов");
        throw err;
      } finally {
        this.loading = false;
      }
    },

		toggleChannel(id: string) {
      if (this.selected.includes(id)) {
        this.selected = this.selected.filter((ch) => ch !== id);
        delete this.configs[id];
      } else {
        this.selected = [...this.selected, id];
        
        const definition = this.getDefinition(id);
        this.configs[id] = {
          text: "",
          keyboardEnabled: false,
          mode: (definition?.standardButtons ?? 0) > 0 ? "standard" : "inline",
          buttons: [],
        };
      }
    },

		setOrder(newOrder: string[]) {
      this.selected = newOrder;
    },

		addButton(channelId: string) {
			const definition = this.getDefinition(channelId);
			const config = this.configs[channelId];

			const maxButtons =
				config.mode === "inline"
					? (definition?.inlineButtons ?? 0)
					: (definition?.standardButtons ?? 0);

			if (config.buttons.length < maxButtons) {
				const buttonType = definition?.supportsUrl
					? "quick_reply"
					: definition?.supportsQuickReply
						? "quick_reply"
						: "quick_reply";

				this.configs[channelId].buttons.push({
					label: "",
					type: buttonType,
					event: "button_click",
				});
			}
		},

		removeButton(channelId: string, index: number) {
      this.configs[channelId].buttons.splice(index, 1);
    },

    validateCampaign() {
      this.validationErrors = {};
      
      if (this.selected.length === 0) {
        this.validationErrors['general'] = ['Выберите хотя бы один канал'];
        return false;
      }
      
      let isValid = true;
      
      this.selected.forEach(channelId => {
        const config = this.configs[channelId];
        const definition = this.getDefinition(channelId);
        const channelErrors: string[] = [];
        
        if (!config.text || config.text.trim() === '') {
          channelErrors.push('Текст сообщения обязателен');
          isValid = false;
        } else if (definition?.textLimit && config.text.length > definition.textLimit) {
          channelErrors.push(`Текст превышает лимит в ${definition.textLimit} символов`);
          isValid = false;
        }
        
        if (config.keyboardEnabled && config.buttons.length > 0) {
          const maxButtons = config.mode === 'inline' 
            ? (definition?.inlineButtons ?? 0) 
            : (definition?.standardButtons ?? 0);
            
          if (config.buttons.length > maxButtons) {
            channelErrors.push(`Максимальное количество кнопок: ${maxButtons}`);
            isValid = false;
          }
          
          config.buttons.forEach((btn, index) => {
            if (!btn.label || btn.label.trim() === '') {
              channelErrors.push(`Кнопка ${index + 1}: Отсутствует текст`);
              isValid = false;
            }
            
            const labelMaxLength = config.mode === 'inline'
              ? definition?.inlineLabelMaxLength
              : definition?.labelMaxLength;
              
            if (labelMaxLength && btn.label.length > labelMaxLength) {
              channelErrors.push(`Кнопка ${index + 1}: Текст превышает лимит в ${labelMaxLength} символов`);
              isValid = false;
            }
            
            if (btn.type === 'url' && (!btn.payload || !btn.payload.startsWith('http'))) {
              channelErrors.push(`Кнопка ${index + 1}: Некорректная ссылка`);
              isValid = false;
            }
          });
        }
        
        if (channelErrors.length > 0) {
          this.validationErrors[channelId] = channelErrors;
        }
      });
      
      return isValid;
    },

		async saveCampaign() {
      try {
        this.loading = true;
        this.error = null;
    
        const payload = this.selected.map((channelId, channelIndex) => {
          const channelConfig = this.configs[channelId];
          
          const buttonsWithPosition = channelConfig.buttons.map((button, buttonIndex) => {
            const { event, ...buttonWithoutEvent } = button;
            
            return {
              ...buttonWithoutEvent,
              position: buttonIndex
            };
          });
          
          return {
            channelId,
            position: channelIndex,
            text: channelConfig.text,
            keyboardEnabled: channelConfig.keyboardEnabled,
            mode: channelConfig.mode,
            buttons: buttonsWithPosition
          };
        });
    
        await axios.post(`${apiUrl}/campaign`, { channels: payload });
        toast.success('Кампания успешно сохранена');
        return true;
      } catch (err) {
        console.error("Failed to save campaign:", err);
        this.error = "Не удалось сохранить кампанию";
        toast.error('Ошибка при сохранении кампании');
        return false;
      } finally {
        this.loading = false;
      }
    }
	},

	getters: {
		getDefinition: (state) => (id: string) =>
			state.definitions.find((ch) => ch.id === id),

		getConfig: (state) => (id: string) => state.configs[id],

		isLoading: (state) => state.loading,

		hasError: (state) => state.error !== null,

    hasValidationErrors: (state) => Object.keys(state.validationErrors).length > 0,
    
    getValidationErrors: (state) => (channelId?: string) => channelId ? state.validationErrors[channelId] || [] : state.validationErrors['general'] || [],
	},
});
