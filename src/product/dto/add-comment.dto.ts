import { IsString, IsNumber } from 'class-validator';

export class AddCommentDto {
    @IsString()
    userId: string;

    @IsString()
    username: string;

    @IsNumber()
    star: number;

    @IsString()
    text: string;
  }
  