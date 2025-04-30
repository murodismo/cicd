import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Res,
  Render,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Roʻyxatdan oʻtish' })
  @ApiBody({ type: CreateAuthDto })
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Patch('verify/:id')
  @ApiOperation({ summary: 'Email orqali tasdiqlash' })
  @ApiParam({ name: 'id', description: 'Foydalanuvchi IDsi' })
  @ApiBody({ schema: { example: { code: 123456 } } })
  verify(@Body('code') code: number, @Param('id') id: string) {
    return this.authService.verify(code, id);
  }

  @Put('login')
  @ApiOperation({ summary: 'Tizimga kirish' })
  @ApiBody({ type: UpdateAuthDto })
  login(@Body() updateAuthDto: UpdateAuthDto, @Res() res: Response) {
    return this.authService.login(updateAuthDto, res);
  }

  @Patch('forget_verify')
  @ApiOperation({ summary: 'Parolni tiklash uchun kod yuborish' })
  @ApiBody({ type: UpdateAuthDto })
  forgetPasswordSendMessage(@Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.forgetPasswordSendMessage(updateAuthDto);
  }

  @Get('forget_password/:id')
  @ApiOperation({ summary: 'Parolni tiklash sahifasini ko‘rsatish' })
  @ApiParam({ name: 'id', description: 'Foydalanuvchi IDsi' })
  @Render('forget_password')
  getForgetPasswordPage(@Param('id') id: string) {
    return { id };
  }

  @Post('forget_password/:id')
  @ApiOperation({ summary: 'Yangi parolni saqlash' })
  @ApiParam({ name: 'id', description: 'Foydalanuvchi IDsi' })
  @ApiBody({ schema: { example: { new_password: 'newSecret123' } } })
  async submitForgetPassword(
    @Param('id') id: string,
    @Body() body: { new_password: string },
    @Res() res: Response,
  ) {
    await this.authService.forgetPassword({ new_password: body.new_password }, id);
    return res.redirect('https://kun.uz');
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Foydalanuvchi maʼlumotlarini yangilash' })
  @ApiParam({ name: 'id', description: 'Foydalanuvchi IDsi' })
  @ApiBody({ type: UpdateAuthDto })
  renameUserData(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.renameUserData(updateAuthDto, id);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Foydalanuvchi akkauntini oʻchirish' })
  @ApiParam({ name: 'id', description: 'Foydalanuvchi IDsi' })
  deleteAccount(@Param('id') id: string) {
    return this.authService.deleteAccount(id);
  }

  @Get('logout/:id')
  @ApiOperation({ summary: 'Chiqish (logout)' })
  @ApiParam({ name: 'id', description: 'Foydalanuvchi IDsi' })
  logout(@Param('id') id: string, @Req() req: Request) {
    return this.authService.logout(id, req);
  }
}
