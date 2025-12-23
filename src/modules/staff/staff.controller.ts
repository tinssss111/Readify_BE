import { Controller, Get, Query } from '@nestjs/common';
import { StaffService } from './staff.service';
import { SearchStaffDto } from './dto/search-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly service: StaffService) {}

  @Get()
  getList(@Query() query: SearchStaffDto) {
    return this.service.getStaffList(query);
  }
}
