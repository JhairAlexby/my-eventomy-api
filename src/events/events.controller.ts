import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Events')
@ApiBearerAuth('JWT-auth')
@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

 @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid event data' })
  @ApiBody({ type: CreateEventDto })
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of user events' })
  findAll(@Request() req) {
    return this.eventsService.findAll(req.user.id);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming events for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of upcoming events' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit number of events returned' })
  findUpcoming(
    @Request() req,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.eventsService.findUpcoming(req.user.id, limit);
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Get events within a date range' })
  @ApiResponse({ status: 200, description: 'List of events in date range' })
  @ApiQuery({ name: 'startDate', description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', description: 'End date (ISO string)' })
  findByDateRange(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.eventsService.findByDateRange(req.user.id, startDate, endDate);
  }

  @Get('month/:year/:month')
  @ApiOperation({ summary: 'Get events for a specific month' })
  @ApiResponse({ status: 200, description: 'List of events for the month' })
  @ApiParam({ name: 'year', description: 'Year (e.g., 2024)' })
  @ApiParam({ name: 'month', description: 'Month (1-12)' })
  findByMonth(
    @Request() req,
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    return this.eventsService.findByMonth(req.user.id, year, month);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific event by ID' })
  @ApiResponse({ status: 200, description: 'Event details' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.eventsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({ status: 200, description: 'Event successfully updated' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 403, description: 'Not authorized to update this event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiBody({ type: UpdateEventDto })
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req,
  ) {
    return this.eventsService.update(id, updateEventDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({ status: 200, description: 'Event successfully deleted' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 403, description: 'Not authorized to delete this event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  remove(@Param('id') id: string, @Request() req) {
    return this.eventsService.remove(id, req.user.id);
  }
}