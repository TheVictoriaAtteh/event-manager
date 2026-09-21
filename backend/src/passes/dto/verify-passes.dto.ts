import { IsUUID } from 'class-validator';

export class VerifyPassDto {
  /** Internal pass ID returned to an event organizer. */
  @IsUUID()
  passId!: string;
}
