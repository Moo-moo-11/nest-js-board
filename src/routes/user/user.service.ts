import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/entity/board.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hash, compare } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(data: CreateUserDto) {
    const { username, name, password } = data;

    const encryptPassword = await this.encryptPassword(password);

    return this.userRepository.save({
      username,
      name,
      password: encryptPassword,
    });
  }

  async getUserByUsername(username: string) {
    return this.userRepository.findOneBy({
      username,
    });
  }

  async login(data: LoginUserDto) {
    const { username, password } = data;

    const user = await this.getUserByUsername(username);

    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    const match = await compare(password, user.password);

    if (!match) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const payload = {
      username,
      name: user.name,
    };

    const accessToken = jwt.sign(payload, 'secret_key', {
      expiresIn: '1h',
    });

    return {
      accessToken,
    };
  }

  async getUsers() {
    const qb = this.userRepository.createQueryBuilder();

    qb.addSelect((subQuery) => {
      return subQuery
        .select('count(id)')
        .from(Board, 'Board')
        .where('Board.userId = User.id');
    }, 'User_boardCount');

    return qb.getMany();
  }

  async encryptPassword(password: string) {
    const DEFAULT_SALT = 11;
    return hash(password, 11);
  }
}
