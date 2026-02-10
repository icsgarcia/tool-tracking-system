import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ToolService } from './tool.service';
import { UpdateToolDto } from './dto/update-tool.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateToolDto } from './dto/create-tool.dto';

@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  createToolByFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      throw new BadRequestException('Only Excel files are allowed');
    }
    return this.toolService.createToolByFile(file);
  }

  @Post()
  createTool(@Body() createToolDto: CreateToolDto) {
    return this.toolService.createTool(createToolDto);
  }

  @Get()
  findAllTools() {
    return this.toolService.findAllTools();
  }

  @Get(':id')
  findTool(@Param('id') id: string) {
    return this.toolService.findToolById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolService.updateTool(id, updateToolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toolService.removeTool(id);
  }
}
