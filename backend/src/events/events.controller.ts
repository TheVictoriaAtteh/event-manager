import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type RequestUser } from '../common/decorators/current-user.decorator';
import { AssignHallDto } from './dto/assign-hall.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@ApiTags('events')
@ApiBearerAuth()
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() dto: CreateEventDto, @CurrentUser() user: RequestUser) {
    return this.eventsService.create(dto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: RequestUser) {
    return this.eventsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.eventsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.eventsService.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.eventsService.remove(id, user.id);
  }

  @Patch(':id/hall')
  assignHall(
    @Param('id') id: string,
    @Body() dto: AssignHallDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.eventsService.assignHall(id, dto.hallId, user.id);
  }
}
