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
}
