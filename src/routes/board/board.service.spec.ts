import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { Repository } from 'typeorm';
import { Board } from 'src/entity/board.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';

describe('BoardService', () => {
  let boardService: BoardService;
  let boardRepository: Repository<Board>;
  const boardREpositoryToken = getRepositoryToken(Board);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: boardREpositoryToken,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    boardService = module.get<BoardService>(BoardService);
    boardRepository = module.get<Repository<Board>>(boardREpositoryToken);
  });

  it('boardService should be defined', () => {
    expect(boardService).toBeDefined();
  });

  it('boardRepository should be defined', () => {
    expect(boardRepository).toBeDefined();
  });

  describe('게시글 조회', () => {
    it('2번 게시글의 작성자는 홍길동이다', async () => {
      jest.spyOn(boardRepository, 'findOneBy').mockResolvedValue({
        id: 1,
        userId: 2,
        contents: '게시글',
        title: '제목',
        user: {
          id: 2,
          username: '아무개',
          name: '홍길동',
        } as User,
      } as Board);
      const board = await boardService.getBoardById(1);

      expect(board.user.name).toBe('홍길동');
    });
  });
});
