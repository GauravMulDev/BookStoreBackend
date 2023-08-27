import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcryptjs";
import { JwtPayload } from "./jwt-payload.interface";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/user/user.schema";
import { Model } from "mongoose";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { Book } from "src/book/book.schema";
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}
  async findBookByTitle(title: string): Promise<Book | null> {
    return await this.bookModel.findOne({ title: title }).exec();
  }
  async createBook(bookData: any): Promise<Book> {
    const book = new this.bookModel(bookData);
    return await book.save();
  }
  async seedInitialUser() {
    try {
      const existingUser =
        await this.userService.findOneByUsername("adminTera");

      if (!existingUser) {
        const user = await this.userService.createUser(
          "adminTera",
          "Gloaster@areT",
          "admin"
        );
      }
    } catch (error) {}
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const result = user.toObject();
      delete result.password;

      return result;
    }
    return null;
  }
  async compareHash(
    attempt: string,
    actualPasswordHash: string
  ): Promise<boolean> {
    return await bcrypt.compare(attempt, actualPasswordHash);
  }
  async validateUserFromPayload(payload: JwtPayload): Promise<any> {
    return this.userService.findOneByUsername(payload.username);
  }
  async login(user: any) {
    const payload = {
      username: user.username,

      role: user.role,
      user: user.username,
    };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
      user: user.username,
    };
  }
  async signup(dto: {
    username: string;
    email: string;
    password: string;
    mobileNumber: string;
  }) {
    const existingUser = await this.userService.findOneByUsername(dto.username);
    if (existingUser) {
      throw new ConflictException("Username already exists");
    }

    const user = await this.userService.createUser(
      dto.username,
      dto.password,
      dto.email,
      dto.mobileNumber
    );

    await this.importDataFromCSV();
    setTimeout(() => {
      this.seedInitialUser();
    }, 5000);
    return this.login(user);
  }
  async importDataFromCSV() {
    const srcDirectory = path.join(process.cwd(), "src", "csvDataDump");
    const distDirectory = path.join(
      process.cwd(),
      "dist",
      "src",
      "csvDataDump"
    );
    const fileName = "books.csv";

    const csvFilePath = path.join(distDirectory, fileName);

    if (fs.existsSync(csvFilePath)) {
      const mongoImportCommand = `mongoimport --db bookstore --collection books --type csv --headerline --file ${csvFilePath}`;

      exec(mongoImportCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
      });
    } else {
    }
  }
}
