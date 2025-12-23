import { Injectable } from '@nestjs/common';
import { StaffRepository } from './staff.repository';
import { SearchStaffDto } from './dto/search-staff.dto';
import { ApiResponse } from '../../shared/responses/api-response';

@Injectable()
export class StaffService {
  constructor(private readonly repo: StaffRepository) {}

  async getStaffList(query: SearchStaffDto) {
    const result = await this.repo.findMany(query);
    
    return ApiResponse.paginated(
      result.items,
      {
        page: result.page,
        limit: result.limit,
        total: result.total,
      },
      'Lấy danh sách nhân viên thành công',
    );
  }
}
