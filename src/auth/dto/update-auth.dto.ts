import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @ApiPropertyOptional({
    example: 'oldPassword123',
    description: 'Joriy (eski) parol',
  })
  old_password?: string;

  @ApiPropertyOptional({
    example: 'newPassword456',
    description: 'Yangi parol',
  })
  new_password?: string;

  @ApiPropertyOptional({
    example: 'updated_username',
    description: 'Yangi foydalanuvchi nomi (majburiy emas)',
  })
  username?: string | undefined;
}
