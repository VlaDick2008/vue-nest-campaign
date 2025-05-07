import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { CreateChannelDto } from "./dto/create-channel.dto";

@Controller("channels")
export class ChannelController {
	constructor(private service: ChannelService) {}

	@Get()
	list() {
		return this.service.findAll();
	}

	@Post()
  create(@Body() dto: CreateChannelDto) {
    return this.service.create(dto);
  }

	@Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
