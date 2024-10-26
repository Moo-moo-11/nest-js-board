import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBoardDto } from 'src/routes/board/dto/create-board.dto';
import { UpdateBoardDto } from 'src/routes/board/dto/update-board.dto';
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

  async create(userId: number, data: CreateBoardDto) {
    return await this.boardRepository.save({ userId, ...data });
  }

  async update(userId: number, id: number, data: UpdateBoardDto) {
    const board = await this.getBoardById(id);

    if (!board) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    if (userId !== board.userId) {
      throw new UnauthorizedException();
    }

    return this.boardRepository.update(id, { ...data });
  }

  async delete(userId: number, id: number) {
    const board = await this.getBoardById(id);

    if (!board) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    if (userId !== board.id) {
      throw new UnauthorizedException();
    }
    return this.boardRepository.delete(id);
  }

  async getBoardById(id: number) {
    return this.boardRepository.findOneBy({
      id,
    });
  }
}
