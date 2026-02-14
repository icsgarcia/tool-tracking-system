import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('scan')
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.scanToolQrCode(createTransactionDto);
  }

  @Get()
  getAllTransactions() {
    return this.transactionService.getAllTransactions();
  }

  @Get('user/:userId')
  getUserTransaction(@Param('userId') userId: string) {
    return this.transactionService.getUserTransactions(userId);
  }
}
