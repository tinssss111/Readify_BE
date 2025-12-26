import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schemas/book.schema';
import { BooksAdminController } from './controllers/books.admin.controller';
import { BooksAdminService } from './services/books.admin.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }])],
  controllers: [BooksAdminController],
  providers: [BooksAdminService],
})
export class BookModule {}
