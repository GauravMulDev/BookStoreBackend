import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { UserService } from "./user/user.service";
import { AuthService } from "./auth/auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "./database/database.module";
import { User, UserSchema } from "./user/user.schema";
import { BookModule } from "./book/book.module";
import { ConfigModule } from "@nestjs/config";
import { AdminModule } from "./guards/admin/admin.module";
import { MongodbService } from "./mongodb/mongodb.service";

let mongoUri: string;
const MONGO_HOST = process.env.MONGO_HOST || "localhost";
const MONGO_PORT = process.env.MONGO_PORT || "27017";
const MONGO_DATABASE = process.env.MONGO_DATABASE || "bookstore";
const JWT_SECRET = process.env.JWT_SECRET || "YOUR_JWT_SECRET_HERE";

if (process.env.DB_AUTHENTICATION === "true") {
  mongoUri = `mongodb://${process.env.MONGO_USER}:${encodeURIComponent(
    process.env.MONGO_PASSWORD
  )}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${
    process.env.MONGO_DATABASE
  }`;
} else {
  mongoUri = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;
}

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: "YOUR_JWT_SECRET_HERE",
      signOptions: { expiresIn: "60m" },
    }),
    UserModule,
    AuthModule,
    DatabaseModule,
    BookModule,
    UserModule,
    AdminModule,
  ],
  providers: [UserService, AuthService, MongodbService],
})
export class AppModule {}
