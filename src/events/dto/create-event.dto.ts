import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEnum,
  IsHexColor,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReminderType } from '../entities/event.entity';

export class CreateEventDto {
  @ApiProperty({
    description: 'Event title',
    example: 'Team Meeting',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'Weekly team sync meeting to discuss project progress',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Event start date and time',
    example: '2024-01-15T10:00:00Z',
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    description: 'Event end date and time',
    example: '2024-01-15T11:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Event location',
    example: 'Conference Room A',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'Event reminders',
    example: ['FIFTEEN_MINUTES', 'ONE_HOUR'],
    enum: ReminderType,
    isArray: true,
  })
  @IsArray()
  @IsEnum(ReminderType, { each: true })
  @IsOptional()
  reminders?: ReminderType[];

  @ApiPropertyOptional({
    description: 'Whether the event is all day',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isAllDay?: boolean;

  @ApiPropertyOptional({
    description: 'Event color in hex format',
    example: '#3498db',
    default: '#3498db',
  })
  @IsHexColor()
  @IsOptional()
  color?: string;
}