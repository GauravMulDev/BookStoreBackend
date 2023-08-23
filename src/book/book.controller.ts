import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
  InternalServerErrorException,
  Get,
  Query,
  Res,
  Param,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { CreateBookDTO } from './dto/create-book.dto/create-book.dto';
import { BooksService } from './book.service';
import { SearchBookDTO } from './dto/create-book.dto/search-book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

import { exec } from 'child_process';
import { Response } from 'express';
import { MongodbService } from 'src/mongodb/mongodb.service';
import * as path from 'path';
import { join } from 'path';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly mongodbService: MongodbService,
  ) {}

  @Post('add')
  @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(JwtAuthGuard)
  async addBook(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBookDTO: CreateBookDTO,
  ) {
    try {
      createBookDTO.filePath = file.path;
      return await this.booksService.addBook(createBookDTO);
    } catch (error) {
      console.error('Error:', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchBooks(@Query('q') query: string) {
    return await this.booksService.searchBooks(query);
  }
  @Post('filter')
  // @UseGuards(JwtAuthGuard)
  async searchBooksFilter(@Body() body: any): Promise<any> {
    const searchCriteria: SearchBookDTO = {
      title: body.title,
      author: body.author,
      minPrice: body.minPrice ? parseFloat(body.minPrice) : undefined,
      maxPrice: body.maxPrice ? parseFloat(body.maxPrice) : undefined,
      rating: body.rating ? parseFloat(body.rating) : undefined,
    };

    return this.booksService.searchBooksFilter(searchCriteria);
  }

  @Get('file/:filename')
  async serveFile(@Param('filename') filename: string, @Res() res: Response) {
    if (!filename) {
      return res.status(400).send('Filename is required.');
    }

    const filePath = path.join(__dirname, '..', '..', 'uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found.');
    }

    return res.sendFile(filePath);
  }
  @Post('booklist')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Body('page') page: string = '1',
    @Body('pageSize') pageSize: string = '100',
  ) {
    const pageNum = parseInt(page, 10);
    const pageSizeNum = parseInt(pageSize, 10);

    return await this.booksService.findAll(pageNum, pageSizeNum);
  }

  @Get('dump/:dbname')
  @UseGuards(JwtAuthGuard)
  async dumpDatabase(@Res() res: Response, @Param('dbname') dbName: string) {
    try {
      const dumpPath = await this.mongodbService.dumpDatabase(dbName);
      const zipPath = await this.mongodbService.zipDirectory(dumpPath);

      res.download(zipPath, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Download failed.');
        } else {
          fs.unlinkSync(zipPath);
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to create dump.');
    }
  }

  @Post('import')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async importDataFromCSV(
    @UploadedFile() file: Express.Multer.File,
    @Query('targetDb') targetDb: string,
    @Res() response: Response,
    @Query('targetCollection') targetCollection?: string,
  ) {
    if (!file || !file.path) {
      return response.status(400).send('No CSV file uploaded.');
    }

    if (!targetDb) {
      return response
        .status(400)
        .send('TargetDb is required as a query parameter.');
    }

    const importPath = file.path;

    let collectionName = targetCollection;

    if (!targetCollection) {
      collectionName = join(file.originalname, '').replace(/\..+$/, '');
    }

    const command = `mongoimport --db=${targetDb} --collection=${collectionName} --type=csv --headerline --file=${importPath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command executed: ${command}`);
        console.error(`Error: ${error}`);
        console.error(`Stdout: ${stdout}`);
        console.error(`Stderr: ${stderr}`);
        return response
          .status(500)
          .send('Failed to import data. Error: ' + stderr);
      }
      console.error(`Command executed: ${command}`);
      console.error(`Error: ${error}`);
      console.error(`Stdout: ${stdout}`);
      console.error(`Stderr: ${stderr}`);
      response.send('Data imported successfully');
    });
  }
}
