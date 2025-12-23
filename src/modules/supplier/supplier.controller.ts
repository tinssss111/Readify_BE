import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ApiResponse } from '../../shared/responses/api-response';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  async list() {
    const items = await this.supplierService.findAll();
    return ApiResponse.success(items);
  }

    @Get(':id')
  async detail(@Param('id') id: string) {
    const item = await this.supplierService.findOne(id);
    return ApiResponse.success(item);
  }


    @Post()
  async create(@Body() dto: CreateSupplierDto) {
    const created = await this.supplierService.create(dto);
    return ApiResponse.success(created, 'Supplier created', 201);
  }

    @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    const updated = await this.supplierService.update(id, dto);
    return ApiResponse.success(updated, 'Supplier updated');
  }
}
