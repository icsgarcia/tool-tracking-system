import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
  Res,
  Body,
} from '@nestjs/common';
import { type Response } from 'express';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  createUserByFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      throw new BadRequestException('Only Excel files are allowed');
    }
    return this.userService.createUserByFile(file);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id/qrcode')
  async getUserQRCode(@Param('id') id: string) {
    return this.userService.getUserQRCode(id);
  }

  @Get(':id/qrcode/download')
  async downloadUserQRCode(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.userService.getUserQRCodeBuffer(id);

    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="qrcode-${id}.png"`,
    });

    res.send(buffer);
  }

  @Get('scan')
  async scanQRCode(@Query('qrCode') qrCode: string) {
    return this.userService.findUserByQRCode(qrCode);
  }

  @Get()
  findAll() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
