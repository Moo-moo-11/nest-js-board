import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateBoardDto {
  @IsNotEmpty()
  @ApiProperty({
    description: '제목',
    required: true,
    example: '글 제목',
  })
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '내용',
    required: true,
    example: '글 본문',
  })
  contents: string;
}
