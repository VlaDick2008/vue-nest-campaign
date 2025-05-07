import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateChannelDto } from "./dto/create-channel.dto";

@Injectable()
export class ChannelService {
	constructor(private prisma: PrismaService) {}

	findAll() {
		return this.prisma.channelDefinition.findMany();
	}

	async create(dto: CreateChannelDto) {
		return this.prisma.channelDefinition.create({ data: dto });
	}

	async remove(id: string) {
		await this.prisma.channelDefinition.delete({ where: { id } });
	}
}
