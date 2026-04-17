<h1 align="center">NEPT - Node Express Prisma TypeScript Template</h1>

<p align="center">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
</p>

## Overview

This is a Node.js, Express, Prisma, and TypeScript template designed to help you quickly set up a robust and scalable backend application.

## Features

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: A minimal and flexible Node.js web application framework.
- **Prisma**: A next-generation ORM that helps you query your database in a type-safe way.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (or any other supported database)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Thund3rHawk/NEPT-Template.git
   ```
2. Install dependencies:
   ```sh
   cd NEPT-Template
   npm install
   ```
3. **Set Up Environment Variables**:

   This project uses environment variables to manage configuration. You can find a sample configuration file named `.env.sample` in the root directory. To set up your environment variables, follow these steps:

   1. Copy the `.env.sample` file to a new file named `.env`:
      ```sh
      cp .env.sample .env
      ```
   2. Open the `.env` file and update the values as needed for your local development environment.

   Make sure not to commit your `.env` file to version control to keep your sensitive information secure.

4. Set up the database:
   ```sh
   npx prisma generate
   ```

### Running the Application

1. Start the development server:
   ```sh
   npm run dev
   ```
2. The server will be running at `http://localhost:8080`.

## Project Structure

```
NEPT
├── prisma
│   └── schema.prisma
├── src
│   ├── controllers
│   │   └── user.controller.ts
│   ├── db
│   │   └── index.ts
│   ├── middlewares
│   │   └── errorHandler.moddleware.ts
│   ├── routes
│   │   └── user.routes.ts
│   ├── services
│   │   └── userService.ts
│   ├── utils
│   │   └── asyncHandler.ts
│   └── index.ts
├── .env.sample
├── .gitignore
├── .prettierignore
├── .prettierrc
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
