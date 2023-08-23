<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## 🛠️ Scripts

Here's a quick overview of the available scripts:

- `npm run build`: Compiles the TypeScript code.
- `npm run format`: Auto-formats code using Prettier.
- `npm run start`: Starts the application.
- `npm run start:dev`: Starts the application with hot-reload.
- `npm run start:debug`: Starts the application in debug mode with hot-reload.
- `npm run start:prod`: Starts the compiled JavaScript application.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run test`: Runs the test suite using Jest.
- `npm run test:watch`: Runs the test suite in watch mode.
- `npm run test:cov`: Outputs test coverage.
- `npm run test:debug`: Runs tests in debug mode.

## 📦 Dependencies

The API integrates several npm packages to deliver its functionality:

- **Core**: NestJS modules like `@nestjs/common`, `@nestjs/core`, and others.
- **Database**: Mongoose (`mongoose`, `@nestjs/mongoose`) is used for MongoDB interactions.
- **Authentication**: `@nestjs/jwt`, `@nestjs/passport`, and related packages.
- **File Handling**: Multer (`multer`) for handling file uploads.
- **Testing**: Jest (`jest`) for testing, along with related packages.
- **TIntegration esting**: Cyprus for e2e, along with related packages.

## 🚀 Getting Started

1. Clone the repository.
2. Navigate to the project directory and run `npm install` to fetch all the necessary dependencies.
3. Use the provided scripts (mentioned above) to start, build, or test the application.
4. Ensure environment variables or configurations (like `ADMIN_USERNAME` and `ADMIN_PASSWORD`) are set appropriately if needed.





# Common configurations(.env file)
URI MONGO_URI='mongodb://yourhost:yourport/bookstore'
JWT_SECRET=YOUR_JWT_SECRET_HERE
MONGO_HOST=
MONGO_PORT=
MONGO_DATABASE=bookstore
ADMIN_USERNAME=adminTera
ADMIN_PASSWORD=Gloaster@areT
use nvm use v16
# BookApp Authentication 

This module provides authentication endpoints for logging in and signing up users in a NestJS application.

## 🚀 Endpoints

### 📌 POST `/auth/login`

Logs in a user using their username and password.

#### Payload:

- **username**: The user's username. (Required)
- **password**: The user's password. (Required)

#### Response:

- **Successful**: Returns a JWT token or any other login response configured in the AuthService.
- **Unsuccessful**: Returns a 401 Unauthorized response with the message "Invalid credentials".

### 📌 POST `/auth/signup`

Registers a new user.

#### Payload:

- **username**: Desired username for the user. (Required)
- **email**: Email address of the user. (Required)
- **password**: Desired password for the user. (Required)
- **mobileNumber**: Mobile number of the user. (Required)



## 🛠️ Setup

1. Ensure you have the `@nestjs/common` package installed.
2. Implement the `AuthService` with methods `validateUser`, `login`, and `signup`.
3. Integrate this controller into your NestJS application.

# Books Controller in NestJS

This controller provides CRUD and related functionalities for books within a NestJS application.

## 🚀 Endpoints

### 📌 POST `/books/add`
- **Description**: Adds a book.
- **Payload**:
  - Multipart `file`: The uploaded book file.
  - JSON body based on `CreateBookDTO`.
- **Authorization**: No guards applied (commented out).

### 📌 GET `/books/search?q=<query>`
- **Description**: Searches for books based on the provided query string.
- **Authorization**: JWT Token required.

### 📌 POST `/books/filter`
- **Description**: Searches books based on filter criteria.
- **Payload**: JSON object containing title, author, minPrice, maxPrice, and rating.
- **Authorization**: No guards applied (commented out).

### 📌 GET `/books/file/:filename`
- **Description**: Serves the requested file.
- **Parameters**: Filename to fetch.

### 📌 POST `/books/booklist`
- **Description**: Fetches a paginated list of books.
- **Payload**:
  - `page`: Page number (default is '1').
  - `pageSize`: Number of items per page (default is '100').
- **Authorization**: JWT Token required.

### 📌 GET `/books/dump/:dbname`
- **Description**: Dumps the provided database and returns it as a zip.
- **Parameters**: Database name to dump.
- **Authorization**: JWT Token required.

### 📌 POST `/books/import`
- **Description**: Imports data from a provided CSV file to the specified database and collection.
- **Payload**: Multipart `file`: The uploaded CSV file.
- **Query Parameters**:
  - `targetDb`: Target database to import to.
  - `targetCollection`: (optional) Target collection to import to.
- **Authorization**: JWT Token required.

## ⚙️ Dependencies

- **BooksService**: Responsible for business logic related to books.
- **MongodbService**: Handles database dumping and other MongoDB-related operations.

## 🛠️ Setup & Usage

1. Ensure the relevant services (`BooksService` and `MongodbService`) are correctly implemented and injected.
2. For routes that have guards commented out, you can uncomment the `@UseGuards(JwtAuthGuard)` decorator to enable JWT-based authentication for those routes.
3. Ensure you have the necessary middleware and modules for file handling, such as `@nestjs/platform-express` for the `FileInterceptor`.
4. For routes interacting with files, ensure a valid file storage directory exists, and error handling is in place if the file is not found.
## 📖 AdminAuthMiddleware and Image Handling in NestJS

This section provides an overview of the current state of the application, with a focus on the `AdminAuthMiddleware` and image management using Multer.

---

### 🎯 **Current Implementations**

#### 1. **AdminAuthMiddleware**
- This middleware decodes the Authorization header's value, matching the provided credentials against the configured admin credentials

#### 2. **Image Handling with Multer**
- An image upload feature using Multer has been added. This functionality is aimed to receive image uploads from clients and subsequently send the images to the frontend for UI display.

#### 3. **Testing**
-est cases have been written using Jest for the existing functionality.

---

### 🚧 **Current State & Limitations**

#### 1. **Multer Implementation**
- The Multer-based image handling functionality is half-implemented. Currently, it supports receiving images, but the frontend display aspect is incomplete.

#### 2. **Admin Guard**
- An admin guard (AdminAuthMiddleware) has been created. However, it's not fully implemented across routes, making it inactive in its protective role.

#### 3. **Testing with Jest**
- Jest is employed for testing, but not captured any test cases

---

### 🔍 **Recommendations & Improvements**

#### 1. **Modularization**
- The API can benefit from being broken down into multiple modules, segregating functionality for better maintainability.
- 
#### 2. **Middleware & Interfaces for DB**
- Introducing specific middleware and interfaces tailored for database interactions can help centralize and manage database-related calls, ensuring uniformity and potential optimizations.

#### 3. **Admin Guard Implementation**
- The AdminAuthMiddleware should be thoroughly integrated across necessary routes to ensure security

#### 4. **Authentication Methods**
- While the basic authentication provided by the middleware is straightforward, consider leveraging JWT, OAuth, or other advanced methods for increased security.
- 







Nest is [MIT licensed](LICENSE).
