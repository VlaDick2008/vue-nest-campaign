import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from "@nestjs/common";
import { CampaignService } from "./campaign.service";
import { CreateCampaignDto } from "./dto/create-campaign.dto";

@Controller("campaign")
export class CampaignController {
	constructor(private readonly service: CampaignService) {}

	@Post()
  create(@Body() dto: CreateCampaignDto) {
    return this.service.create(dto);
  }

	@Get()
	list() {
		return this.service.findAll();
	}

	@Get(':id')
  get(@Param('id') id: string) {
    return this.service.findOne(id);
  }

	@Put(":id")
	update(@Param('id') id: string, @Body() dto: CreateCampaignDto) {
		return this.service.update(id, dto);
	}

	@Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
