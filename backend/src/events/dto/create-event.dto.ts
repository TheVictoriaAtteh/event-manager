import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  /** Calendar day shown to users (YYYY-MM-DD). */
  @IsDateString()
  date!: string;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;

  @IsString()
  location!: string;

  @IsInt()
  @Min(1)
  capacity!: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  logoUrl?: string;

  @IsOptional()
  @IsString()
  brandColor?: string;

  @IsOptional()
  @IsUUID()
  hallId?: string;
}
