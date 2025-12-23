import { Controller, Get, Param } from '@nestjs/common';
import { StockService } from './stock.service';
import { ApiResponse } from '../../shared/responses/api-response';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  async list() {
    const items = await this.stockService.findAll();
    return ApiResponse.success(items);
  }

  @Get(':id')
  async detail(@Param('id') id: string): Promise<any> {
    const result = await this.stockService.findOne(id);
    return ApiResponse.success(result);
  }
}
