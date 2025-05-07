import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCampaignDto } from "./dto/create-campaign.dto";

@Injectable()
export class CampaignService {
	constructor(private prisma: PrismaService) {}

	async create(dto: CreateCampaignDto) {
		const data = {
			channels: {
				create: dto.channels.map((ch) => ({
					channelId: ch.channelId,
					text: ch.text,
					keyboardMode: ch.keyboardMode,
					buttons: { create: ch.buttons },
				})),
			},
		};
		return this.prisma.campaign.create({
			data,
			include: { channels: { include: { buttons: true } } },
		});
	}

	findAll() {
		return this.prisma.campaign.findMany({
			include: { channels: { include: { channel: true, buttons: true } } },
		});
	}

	async findOne(id: string) {
		const campaign = await this.prisma.campaign.findUnique({
			where: { id },
			include: { channels: { include: { channel: true, buttons: true } } },
		});
		if (!campaign) throw new NotFoundException();
		return campaign;
	}

	async update(id: string, dto: CreateCampaignDto) {
		await this.prisma.campaignChannel.deleteMany({ where: { campaignId: id } });
		return this.create(dto);
	}

	async remove(id: string) {
		return this.prisma.campaign.delete({ where: { id } });
	}
}
