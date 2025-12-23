import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { StaffStatus } from '../schemas/staff.schema';

export enum     AccountRole {
  USER = 0,
  ADMIN = 1,
  SELLER = 2,
  WAREHOUSE = 3,
}

export enum StaffSortBy {
  CREATED_AT = 'createdAt',
  FULL_NAME = 'fullName',
  EMAIL = 'email',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SearchStaffDto {
  @IsOptional()
  @IsString()
  q?: string; // name / phone / email

  @IsOptional()
  @IsEnum(StaffStatus)
  status?: StaffStatus;

  @IsOptional()
  @Type(() => Number)
  @IsEnum(AccountRole)
  role?: AccountRole;

  @IsOptional()
  @IsEnum(StaffSortBy)
  sortBy: StaffSortBy = StaffSortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.DESC;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;
}
