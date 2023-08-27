import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateBookDTO } from "./dto/create-book.dto/create-book.dto";
import { SearchBookDTO } from "./dto/create-book.dto/search-book.dto";
import { Book } from "./book.schema";

@Injectable()
export class BooksService {
  constructor(@InjectModel("Book") private readonly bookModel: Model<any>) {}

  async addBook(createBookDTO: CreateBookDTO): Promise<Book> {
    const newBook = new this.bookModel(createBookDTO);
    return await newBook.save();
  }
  async searchBooks(query: string): Promise<any> {
    const searchRegex = new RegExp(query, "i");

    const queryAsNumber = Number(query);

    let searchObj;

    if (isNaN(queryAsNumber)) {
      searchObj = { title: searchRegex };
    } else {
      searchObj = {
        $or: [
          { title: searchRegex },
          { author: searchRegex },
          { description: searchRegex },
          { price: queryAsNumber },
          { rating: queryAsNumber },
        ],
      };
    }
    return await this.bookModel.find(searchObj);
  }

  async searchBooksFilter(criteria: SearchBookDTO): Promise<Book[]> {
    const query = {};

    if (criteria.title) {
      query["title"] = new RegExp(criteria.title, "i");
    }

    if (criteria.author) {
      query["author"] = new RegExp(criteria.author, "i");
    }

    if (criteria.minPrice || criteria.maxPrice) {
      query["price"] = {};

      if (criteria.minPrice) {
        query["price"]["$gte"] = criteria.minPrice;
      }

      if (criteria.maxPrice) {
        query["price"]["$lte"] = criteria.maxPrice;
      }
    }

    if (criteria.rating) {
      query["rating"] = criteria.rating;
    }

    return await this.bookModel.find(query);
  }

  findAll(page = 1, pageSize = 10) {
    try {
      const skip = (page - 1) * pageSize;
      return this.bookModel.find().skip(skip).limit(pageSize).exec();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
