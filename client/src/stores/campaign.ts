import axios from "axios";
import { defineStore } from "pinia";

const apiUrl = import.meta.env.VITE_API_URL;

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
	}),

	actions: {
		async loadDefinitions() {
			const res = await axios.get<ChannelDefinition[]>(`${apiUrl}/channels`);
			this.definitions = res.data;
		},

		toggleChannel(id: string) {
			if (this.selected.includes(id)) {
				this.selected = this.selected.filter((ch) => ch !== id);
				delete this.configs[id];
			} else {
				this.selected.push(id);

				this.configs[id] = {
					text: "",
					keyboardEnabled: false,
					mode: "standard",
					buttons: [],
				};
			}
		},

		setOrder(newOrder: string[]) {
			this.selected = newOrder;
		},

		addButton(channelId: string) {
			this.configs[channelId].buttons.push({
				label: "",
				type: "quick_reply",
			});
		},

		removeButton(channelId: string, index: number) {
			this.configs[channelId].buttons.splice(index, 1);
		},

		async saveCampaign() {
			const payload = this.selected.map((channelId) => ({
				channelId,
				...this.configs[channelId],
			}));
			await axios.post(`${apiUrl}/campaign`, { channels: payload });
		},
	},

	getters: {
		getDefinition: (state) => (id: string) =>
			state.definitions.find((ch) => ch.id === id),

		getConfig: (state) => (id: string) => state.configs[id],
	},
});
