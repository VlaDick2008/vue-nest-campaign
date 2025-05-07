import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class CreateChannelDto {
	@IsString() name: string;
	@IsOptional() @IsInt() textLimit?: number;
	@IsInt() standardButtons: number;
	@IsInt() inlineButtons: number;
	@IsOptional() @IsInt() labelMaxLength?: number;
	@IsOptional() @IsInt() inlineLabelMaxLength?: number;
	@IsBoolean() supportsUrl: boolean;
	@IsBoolean() supportsQuickReply: boolean;
}
