import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBoardDto } from 'src/dto/create-board.dto';
import { UpdateBoardDto } from 'src/dto/update-board.dto';
import { Board } from 'src/entity/board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async findAll() {
    return this.boardRepository.find();
  }

  async find(id: number) {
    const board = await this.boardRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });

    if (!board) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return board;
  }

  async create(data: CreateBoardDto) {
    return await this.boardRepository.save(data);
  }

  async update(id: number, data: UpdateBoardDto) {
    const board = await this.boardRepository.findOneBy({ id });

    if (!board) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    return this.boardRepository.update(id, { ...data });
  }

  delete(id: number) {
    return this.boardRepository.delete(id);
  }
}
