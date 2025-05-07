import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const channels = [
		{
			name: "VK",
			textLimit: 4096,
			standardButtons: 40,
			inlineButtons: 10,
			labelMaxLength: null,
			inlineLabelMaxLength: null,
			supportsUrl: true,
			supportsQuickReply: true,
		},
		{
			name: "WhatsApp",
			textLimit: 1000,
			standardButtons: 10,
			inlineButtons: 3,
			labelMaxLength: 20,
			inlineLabelMaxLength: 20,
			supportsUrl: false,
			supportsQuickReply: true,
		},
		{
			name: "Telegram",
			textLimit: 4096,
			standardButtons: 1000,
			inlineButtons: 1000,
			labelMaxLength: null,
			inlineLabelMaxLength: 64,
			supportsUrl: true,
			supportsQuickReply: true,
		},
		{
			name: "SMS",
			textLimit: null,
			standardButtons: 0,
			inlineButtons: 0,
			labelMaxLength: null,
			inlineLabelMaxLength: null,
			supportsUrl: false,
			supportsQuickReply: false,
		},
	];

	for (const ch of channels) {
		await prisma.channelDefinition.upsert({
			where: { name: ch.name },
			update: {},
			create: ch,
		});
	}

	await prisma.campaign.create({
		data: {
			channels: {
				create: [
					{
						channel: { connect: { name: "VK" } },
						text: "Привет из VK!",
						keyboardMode: "standard",
						buttons: {
							create: [
								{ label: "Да", type: "quick_reply", position: 0 },
								{ label: "Нет", type: "quick_reply", position: 1 },
							],
						},
					},
					{
						channel: { connect: { name: "SMS" } },
						text: "SMS-альтернатива",
						keyboardMode: "standard",
						buttons: { create: [] },
					},
				],
			},
		},
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
