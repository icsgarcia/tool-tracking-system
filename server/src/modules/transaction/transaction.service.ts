import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { create } from 'domain';

@Injectable()
export class TransactionService {
  constructor(private prismaService: PrismaService) {}

  async borrowTool(createTransactionDto: CreateTransactionDto) {
    const tool = await this.prismaService.tool.findUnique({
      where: {
        qrCode: createTransactionDto.toolQrCode,
      },
    });

    if (!tool) {
      throw new BadRequestException('Tool Not Found');
    }

    const toolBorrowedCount = await this.prismaService.transaction.count({
      where: {
        toolId: tool.id,
        status: 'BORROWED',
      },
    });

    if (toolBorrowedCount >= tool.quantity) {
      throw new BadRequestException('No Available Tools To Borrow');
    }

    const isBorrowed = await this.prismaService.transaction.findFirst({
      where: {
        userId: createTransactionDto.userId,
        toolId: tool.id,
        status: 'BORROWED',
      },
    });

    if (isBorrowed) {
      throw new BadRequestException('You Already Borrowed This Tool');
    }

    const transaction = await this.prismaService.transaction.create({
      data: {
        userId: createTransactionDto.userId,
        toolId: tool.id,
      },
      include: {
        user: true,
        tool: true,
      },
    });

    return {
      message: `Successfully borrowed ${tool.name}`,
      transaction,
    };
  }

  async returnTool(createTransactionDto: CreateTransactionDto) {
    const tool = await this.prismaService.tool.findFirst({
      where: { qrCode: createTransactionDto.toolQrCode },
    });

    if (!tool) {
      throw new BadRequestException('Tool Not Found');
    }

    const transaction = await this.prismaService.transaction.findFirst({
      where: {
        userId: createTransactionDto.userId,
        toolId: tool.id,
        status: 'BORROWED',
      },
    });

    if (!transaction) {
      throw new BadRequestException('You Have Not Borrowed This Tool');
    }

    const updatedTransaction = await this.prismaService.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        status: 'RETURNED',
        returnedAt: new Date(),
      },
      include: {
        user: true,
        tool: true,
      },
    });

    return {
      message: `Successfully returned ${tool.name}`,
      transaction: updatedTransaction,
    };
  }

  async scanToolQrCode(createTransactionDto: CreateTransactionDto) {
    const tool = await this.prismaService.tool.findUnique({
      where: {
        qrCode: createTransactionDto.toolQrCode,
      },
    });

    if (!tool) {
      throw new BadRequestException('Tool Not Found');
    }

    const isBorrowed = await this.prismaService.transaction.findFirst({
      where: {
        userId: createTransactionDto.userId,
        toolId: tool.id,
        status: 'BORROWED',
      },
    });

    if (isBorrowed) {
      return this.returnTool(createTransactionDto);
    } else {
      return this.borrowTool(createTransactionDto);
    }
  }

  async getAllTransactions() {
    const transactions = await this.prismaService.transaction.findMany({
      include: {
        tool: true,
        user: true,
      },
      orderBy: {
        borrowedAt: 'desc',
      },
    });
    return transactions;
  }

  async getUserTransactions(userId: string) {
    const userTransactions = await this.prismaService.transaction.findMany({
      where: {
        userId,
      },
      include: {
        tool: true,
      },
      orderBy: {
        borrowedAt: 'desc',
      },
    });

    return userTransactions;
  }
}
