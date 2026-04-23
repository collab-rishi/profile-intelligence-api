# Profile Intelligence API

A production-grade Node.js & TypeScript backend designed to manage, enrich, and query user demographic data. This system utilizes parallel API integration and a custom rule-based Natural Language Processing (NLP) engine to provide deep insights into profile data.

## Key Technical Features

### 1. Intelligence & Search

- **NLP Parser**  
  A rule-based interpreter that translates natural language (e.g., "young males from Nigeria") into structured database queries without external AI dependencies.

- **Advanced Filtering**  
  Support for 7+ simultaneous filters including age ranges, gender confidence scores, and country probabilities.

- **Dynamic Sorting**  
  Flexible ordering by age, creation date, or data confidence levels.

---

### 2. High-Performance Architecture

- **UUID v7**  
  Implementation of time-sortable Universally Unique Identifiers for optimized database indexing and primary key performance.

- **Parallel Enrichment**  
  Utilizes `Promise.all` to fetch data from Genderize, Agify, and Nationalize simultaneously, reducing API latency by ~60%.

- **Composite Indexing**  
  Database-level optimization for frequent filter combinations (Gender + Country + Age Group).

- **Idempotent Seeding**  
  A robust seeding script that manages 2,026 initial records with conflict resolution to prevent duplicates.

---

### 3. Reliability & Validation

- **Strict Typing**  
  End-to-end type safety using TypeScript.

- **Schema Validation**  
  All incoming requests (Body, Query, and Params) are sanitized and validated using Zod.

- **Standardized Errors**  
  Global error handling middleware providing consistent RFC-compliant JSON responses.

## 🛠️ Tech Stack

- **Runtime:** Node.js (v20+)
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod


## 📋 API Reference

### Profile Management

|**Method**|**Endpoint**|**Description**|
| - | - | - |
|POST|/api/profiles|Create an enriched profile from a name.|
|GET|/api/profiles|List all profiles with filtering and pagination.|
|GET|/api/profiles/:id|Retrieve a specific profile by ID.|
|DELETE|/api/profiles/:id|Remove a profile record.|

## Intelligence Search

**Endpoint:**

GET ```/api/profiles/search?q={query}```

**Example Queries:**

?q=males from nigeria

?q=young women

?q=seniors under 80


## 🚦 Setup & Installation

### Prerequisites
- Node.js v20+
- PostgreSQL database

1. **Clone the repository**

   ```bash
   git clone https://github.com/collab-rishi/profile-intelligence-api.git
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
   # Generate Prisma Client
   npx prisma generate

   # Run Migrations
   npx prisma migrate dev --name init

   # Seed the 2026 Profile Records
   npm run seed
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

  The API implements strict schema validation via **Zod**. 


- **422 Unprocessable Entity** : Triggered for schema mismatches (e.g., incorrect data types) or when the NLP engine cannot interpret a search query.
- **404 Not Found** : Triggered when a requested UUID does not exist.
- **502 Bad Gateway** : Triggered if an upstream service (Agify, Genderize, or Nationalize) fails or returns null. This "Fail-Fast" approach ensures the database remains populated with high-quality, complete records only.
## 📂 Architecture

The project follows a modular **Controller-Service-Data Layer** pattern:

- **Controllers:** Handle HTTP request/response logic.
- **Services:** Orchestrate business logic and external API calls.
- **Validations:** Zod schemas for "Data at Rest" and "Data in Motion.
- **Middlewares:** Centralized validation and error catchers.


