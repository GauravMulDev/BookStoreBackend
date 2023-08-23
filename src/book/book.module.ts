import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BooksService } from './book.service';
import { BooksController } from './book.controller';
import { Book, BookSchema } from './book.schema';

import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { MongodbService } from 'src/mongodb/mongodb.service';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    MulterModule.register(multerConfig),
  ],
  providers: [BooksService, MongodbService],
  controllers: [BooksController],
})
export class BookModule {}
