import { Type } from "class-transformer";
import {
	IsArray,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested,
} from "class-validator";

export class ButtonDto {
	@IsString() label: string;
	@IsEnum(["quick_reply", "url"]) type: string;
	@IsOptional() @IsString() payload?: string;
	@IsInt() position: number;
}
export class CampaignChannelDto {
	@IsUUID() channelId: string;
	@IsOptional() @IsString() text?: string;
	@IsEnum(["standard", "inline"]) keyboardMode: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ButtonDto)
	buttons: ButtonDto[];
}
export class CreateCampaignDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CampaignChannelDto)
	channels: CampaignChannelDto[];
}
