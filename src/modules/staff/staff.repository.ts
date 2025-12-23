import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Staff, StaffDocument } from './schemas/staff.schema';
import { SearchStaffDto, StaffSortBy } from './dto/search-staff.dto';

@Injectable()
export class StaffRepository {
  constructor(
    @InjectModel(Staff.name)
    private readonly staffModel: Model<StaffDocument>,
  ) {}

  async findMany(query: SearchStaffDto) {
    const { 
      q, 
      status, 
      role, 
      sortBy = 'createdAt', 
      order = 'desc', 
      page = 1, 
      limit = 10 
    } = query;
    
    // Validate page and limit
    const validPage = Math.max(1, page);
    const validLimit = Math.min(50, Math.max(1, limit));
    const skip = (validPage - 1) * validLimit;

    const pipeline: any[] = [];

    // Join Account
    pipeline.push({
      $lookup: {
        from: 'accounts',
        localField: 'accountId',
        foreignField: '_id',
        as: 'account',
      },
    });
    
    pipeline.push({
      $unwind: { 
        path: '$account', 
        preserveNullAndEmptyArrays: true 
      },
    });

    // Filter
    const match: any = {};
    
    if (status) match.status = status;
    
    if (role !== undefined) {
      const roleString = String(role);
      if (roleString === '' || roleString === 'null') {
        match.$or = [
          { account: { $exists: false } },
          { account: null },
          { 'account.role': { $exists: false } },
          { 'account.role': null },
          { 'account.role': '' }
        ];
      } else {
        match['account.role'] = role;
      }
    }

    if (q?.trim()) {
      const kw = q.trim();
      match.$or = [
        { fullName: { $regex: kw, $options: 'i' } },
        { phone: { $regex: kw, $options: 'i' } },
        { 'account.email': { $regex: kw, $options: 'i' } },
      ];
    }
    
    if (Object.keys(match as Record<string, unknown>).length) {
      pipeline.push({ $match: match });
    }

    // Sort
    const sortMap: Record<StaffSortBy, string> = {
      createdAt: 'createdAt',
      fullName: 'fullName',
      email: 'account.email',
    };
    
    const sortField = sortMap[sortBy];
    const sortOrder = (order as string) === 'asc' ? 1 : -1;
    
    const sortStage: any = { _id: 1 };
    
    if (sortField) {
      sortStage[sortField] = sortOrder;
    }
    
    pipeline.push({ $sort: sortStage });

    // Pagination + total + project
    pipeline.push({
      $facet: {
        items: [
          { $skip: skip },
          { $limit: validLimit },
          {
            $project: {
              _id: 1,
              fullName: 1,
              phone: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
              note: 1,
              account: {
                $cond: {
                  if: { 
                    $and: [
                      { $ne: ['$account', null] }, 
                      { $ne: ['$account', {}] }
                    ] 
                  },
                  then: {
                    _id: '$account._id',
                    email: '$account.email',
                    phone: '$account.phone',
                    dateOfBirth: '$account.dateOfBirth',
                    sex: "$account.sex",
                    address: '$account.address',
                    role: '$account.role',
                  },
                  else: null,
                },
              },
            },
          },
        ],
        total: [{ $count: 'count' }],
      },
    });

    const [aggregationResult] = await this.staffModel.aggregate(pipeline);

    return {
      items: aggregationResult?.items ?? [],
      total: aggregationResult?.total?.[0]?.count ?? 0,
      page: validPage,
      limit: validLimit,
    };
  }
}