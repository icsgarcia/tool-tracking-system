import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import * as XLSX from 'xlsx';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tool } from 'generated/prisma/client';
import { QRCodeUtil } from 'src/common/utils/qrcode';

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

    if (tools.length === 0) {
      return [];
    }

    const toolsWithQrCode = await Promise.all(
      tools.map(async (tool) => {
        const qrCodeBuffer = await QRCodeUtil.generateQRCodeBuffer(tool.qrCode);
        const qrCodeBase64 = `data:image/png;base64,${qrCodeBuffer.toString('base64')}`;
        return {
          id: tool.id,
          qrCode: tool.qrCode,
          qrCodeImage: qrCodeBase64,
          name: tool.name,
          quantity: tool.quantity,
        };
      }),
    );

    return toolsWithQrCode;
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
