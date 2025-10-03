import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto, userId: string): Promise<Event> {
    const startDate = new Date(createEventDto.startDate);
    const endDate = createEventDto.endDate ? new Date(createEventDto.endDate) : undefined;

    if (endDate && endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const event = this.eventRepository.create({
      ...createEventDto,
      startDate,
      endDate,
      userId,
    });

    return this.eventRepository.save(event);
  }

  async findAll(userId: string): Promise<Event[]> {
    return this.eventRepository.find({
      where: { userId },
      order: { startDate: 'ASC' },
    });
  }

  async findByDateRange(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<Event[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      throw new BadRequestException('End date must be after start date');
    }

    return this.eventRepository.find({
      where: {
        userId,
        startDate: Between(start, end),
      },
      order: { startDate: 'ASC' },
    });
  }

  async findUpcoming(userId: string, limit: number = 10): Promise<Event[]> {
    const now = new Date();
    
    return this.eventRepository.find({
      where: {
        userId,
        startDate: MoreThanOrEqual(now),
      },
      order: { startDate: 'ASC' },
      take: limit,
    });
  }

  async findOne(id: string, userId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id, userId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    userId: string,
  ): Promise<Event> {
    const event = await this.findOne(id, userId);

    // Create a copy to avoid modifying the original DTO
    const updateData: any = { ...updateEventDto };

    if (updateData.startDate) {
      const startDate = new Date(updateData.startDate);
      const endDate = updateData.endDate 
        ? new Date(updateData.endDate) 
        : event.endDate;

      if (endDate && endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }

      updateData.startDate = startDate;
    }

    if (updateData.endDate) {
      const endDate = new Date(updateData.endDate);
      const startDate = updateData.startDate 
        ? new Date(updateData.startDate) 
        : event.startDate;

      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }

      updateData.endDate = endDate;
    }

    Object.assign(event, updateData);
    return this.eventRepository.save(event);
  }

  async remove(id: string, userId: string): Promise<void> {
    const event = await this.findOne(id, userId);
    await this.eventRepository.remove(event);
  }

  async findByMonth(userId: string, year: number, month: number): Promise<Event[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return this.eventRepository.find({
      where: {
        userId,
        startDate: Between(startDate, endDate),
      },
      order: { startDate: 'ASC' },
    });
  }
}