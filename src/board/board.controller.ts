import { ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('board')
@ApiTags('Board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  findAll() {
    return this.boardService.findAll();
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.boardService.find(Number(id));
  }

  @Post()
  create(@Body() data) {
    return this.boardService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data) {
    return this.boardService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.boardService.delete(Number(id));
  }
}
