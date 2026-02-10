import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as XLSX from 'xlsx';
import { QRCodeUtil } from 'src/common/utils/qrcode';
import { CreateUserDto } from './dto/create-user.dto';
import { User, Role } from 'generated/prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUserByFile(file: Express.Multer.File) {
    try {
      const workbook = XLSX.read(file.buffer, {
        type: 'buffer',
      });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: CreateUserDto[] = XLSX.utils.sheet_to_json(worksheet);

      const createdUsers: User[] = [];

      for (const row of jsonData) {
        const qrCodeData = `USER-${row['schoolNumber']}-${Date.now()}`;

        const user = await this.prismaService.user.create({
          data: {
            qrCode: qrCodeData,
            schoolNumber: String(row['schoolNumber']),
            firstName: String(row['firstName']),
            middleName: String(row['middleName'] || ''),
            lastName: String(row['lastName']),
            role: row['role'] as Role,
            department: String(row['department']),
            yearLevel: Number(row['yearLevel']),
            email: String(row['email']),
            number: row['number'] ? String(row['number']) : null,
          },
        });
        createdUsers.push(user);
      }

      return {
        message: `Successfully created ${createdUsers.length} users`,
        users: createdUsers,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to process excel file: ${error.message}`,
      );
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    const qrCodeData = `USER-${createUserDto.schoolNumber}-${Date.now()}`;

    const user = await this.prismaService.user.create({
      data: {
        qrCode: qrCodeData,
        schoolNumber: createUserDto.schoolNumber,
        firstName: createUserDto.firstName,
        middleName: createUserDto.middleName,
        lastName: createUserDto.lastName,
        role: createUserDto.role,
        department: createUserDto.department,
        yearLevel: createUserDto.yearLevel,
        email: createUserDto.email,
        number: createUserDto.number,
      },
    });

    return user;
  }

  async getUserQRCode(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate QR code as base64 data URL for display
    const qrCodeDataUrl = await QRCodeUtil.generateQRCode(user.qrCode);

    return {
      user: {
        id: user.id,
        fullName: `${user.firstName} ${user.middleName} ${user.lastName}`,
        schoolNumber: user.schoolNumber,
        role: user.role,
      },
      qrCode: qrCodeDataUrl,
    };
  }

  async getUserQRCodeBuffer(userId: string): Promise<Buffer> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate QR code as buffer for download/print
    return await QRCodeUtil.generateQRCodeBuffer(user.qrCode);
  }

  async findAllUsers() {
    const users = await this.prismaService.user.findMany();
    return users;
  }

  async findUserById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findUserByQRCode(qrCode: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        qrCode,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found with this QR Code');
    }

    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
