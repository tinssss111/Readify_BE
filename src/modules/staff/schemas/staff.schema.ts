import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StaffDocument = HydratedDocument<Staff>;

export enum StaffStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({
  timestamps: true,
  collection: 'staffs',
})
export class Staff {
  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  accountId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  fullName: string;

  @Prop({
    trim: true,
  })
  phone?: string;

  @Prop({
    type: String,
    enum: StaffStatus,
    default: StaffStatus.ACTIVE,
  })
  status: StaffStatus;

  @Prop({
    trim: true,
    maxlength: 500,
  })
  note?: string;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);

/**
 * Indexes
 */
StaffSchema.index({ accountId: 1 }, { unique: true });
StaffSchema.index({ status: 1, createdAt: -1 });
StaffSchema.index({ fullName: 'text', phone: 'text' });
