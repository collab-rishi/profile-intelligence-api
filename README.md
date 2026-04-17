# Profile Intelligence API

A high-performance RESTful API built with the **NEPT stack** (Node.js, Express, Prisma, TypeScript). This service orchestrates data from multiple external sources (Genderize, Agify, and Nationalize) to create enriched user profiles while ensuring idempotency and strict type safety.

##  Features

- **Data Orchestration:** Parallelized fetching from three external REST APIs.
- **Idempotency:** Intelligent checks to prevent duplicate data entry while maintaining 200/210 response accuracy.
- **Strict Validation:** Modern Zod integration for input sanitization and external data verification.
- **Error Standardization:** Centralized error handling providing consistent JSON responses.
- **Database Management:** Type-safe queries using Prisma ORM with PostgreSQL.

## 🛠️ Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod


## 📋 API Reference

### Profiles

|**Method**|**Endpoint**|**Description**|
| - | - | - |
|POST|/api/profiles|Create an enriched profile from a name.|
|GET|/api/profiles|List all profiles (supports filtering).|
|GET|/api/profiles/:id|Retrieve a specific profile by UUID.|
|DELETE|/api/profiles/:id|Remove a profile from the database.|


## 🚦 Setup & Installation

### Prerequisites
- Node.js v18+
- PostgreSQL database

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

      Create a  .env file in the root directory:

   ```bash
      DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
      PORT=8080
   ```

4. **Database Migration**
   ```bash
  
   npx prisma migrate dev --name init
   ```

5. **Run the application**
   ```bash
    # Development
   npm run dev
   ```
   
   ```bash
   # Production
   npm run build
   npm start
   ```

  ## 🧪 Validation & Errors

   The API uses Zod for schema validation. If an input is invalid (e.g., name is not a string), the API returns a 422 Unprocessable Entity.

   If an external API (like Agify) returns a null value for a valid name, the system interprets this as a data failure and returns a 502 Bad Gateway to maintain database quality.

```json
   {
      "status": "error",
      "message": "Name parameter is required"
   }
```

- 422 Unprocessable Entity : Schema validation failures.
- 404 Not Found : Resource does not exist.
- 502 Bad Gateway : External API failure or null response.

## 📂 Architecture

The project follows a modular **Controller-Service-Repository** pattern:

- **Controllers:** Handle HTTP request/response logic.
- **Services:** Orchestrate business logic and external API calls.
- **Validations:** Zod schemas for "Data at Rest" and "Data in Motion.
- **Middlewares:** Centralized validation and error catchers.


