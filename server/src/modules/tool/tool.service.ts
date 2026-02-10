import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import * as XLSX from 'xlsx';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tool } from 'generated/prisma/client';

@Injectable()
export class ToolService {
  constructor(private prismaService: PrismaService) {}

  async createToolByFile(file: Express.Multer.File) {
    try {
      const workbook = XLSX.read(file.buffer, {
        type: 'buffer',
      });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: CreateToolDto[] = XLSX.utils.sheet_to_json(worksheet);

      const createdTools: Tool[] = [];

      for (const row of jsonData) {
        const qrCodeData = `TOOL-${row['name']}-${Date.now()}`;

        const tool = await this.prismaService.tool.create({
          data: {
            qrCode: qrCodeData,
            name: String(row['name']),
            quantity: Number(row['quantity']),
          },
        });
        createdTools.push(tool);
      }

      return {
        message: `Successfully created ${createdTools.length} tools`,
        tools: createdTools,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to process excel file: ${error.message}`,
      );
    }
  }

  async createTool(createToolDto: CreateToolDto) {
    const qrCodeData = `TOOL-${createToolDto.name}-${Date.now()}`;

    const tool = await this.prismaService.tool.create({
      data: {
        qrCode: qrCodeData,
        name: createToolDto.name,
        quantity: createToolDto.quantity,
      },
    });

    return tool;
  }

  async findAllTools() {
    const tools = await this.prismaService.tool.findMany();

    return tools;
  }

  async findToolById(toolId: string) {
    const tool = await this.prismaService.tool.findUnique({
      where: {
        id: toolId,
      },
    });

    if (!tool) {
      throw new BadRequestException('Tool not found');
    }

    return tool;
  }

  updateTool(id: string, updateToolDto: UpdateToolDto) {
    return `This action updates a #${id} tool`;
  }

  removeTool(id: string) {
    return `This action removes a #${id} tool`;
  }
}
