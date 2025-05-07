import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { CampaignModule } from "./campaign/campaign.module";
import { ChannelModule } from "./channel/channel.module";

@Module({
	imports: [PrismaModule, CampaignModule, ChannelModule],
})
export class AppModule {}
