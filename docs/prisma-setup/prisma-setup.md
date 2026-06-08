# Prisma Setup Guide for Express.js (CommonJS + pnpm + PostgreSQL + Docker)

## Prerequisites

Before you start, make sure you have:

- Node.js installed
- An Express.js project
- CommonJS modules (`require` and `module.exports`)
- pnpm installed
- A database available (PostgreSQL, MySQL, SQLite, etc.)
- Optional: Docker installed if you want to run the database inside a container
- Optional: omarchy configured for environment management

---

# What Is Prisma?

Prisma is a modern ORM (Object Relational Mapper) for Node.js.

It allows you to work with databases using JavaScript instead of writing raw SQL for every operation.

Example:

```js
const users = await prisma.user.findMany();
```

Benefits:

- Type-safe queries
- Database migrations
- Auto-generated client
- Schema-based development
- Supports PostgreSQL, MySQL, SQLite, MongoDB, SQL Server, and CockroachDB

---

# Docker Database Setup

## Important

Docker is **not** a database.

Docker is a container platform that runs applications such as:

- PostgreSQL
- MySQL
- MongoDB
- Redis

Example:

```text
Docker
 └── PostgreSQL Container
      └── PostgreSQL Database
```

If you don't want to install PostgreSQL directly on your machine, Docker can run PostgreSQL for you.

---

## Using Docker Compose

Create a file named:

```text
docker-compose.yml
```

in your project root.

```yaml
services:
  postgres:
    image: postgres:16
    container_name: express_db

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb

    ports:
      - "5432:5432"

    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Start PostgreSQL:

```bash
docker compose up -d
```

Verify:

```bash
docker ps
```

Stop PostgreSQL:

```bash
docker compose down
```

View logs:

```bash
docker compose logs postgres
```

---

## PostgreSQL Connection String

Your Prisma connection string will be:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"
```

---

## Using Omarchy for Environment Variables

If you use omarchy, you can store environment variables in:

```bash
~/.config/omarchy/env
```

Example:

```bash
export DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"
export NODE_ENV="development"
```

Load them:

```bash
source ~/.config/omarchy/env
```

You may also use a regular `.env` file.

---

# Prisma Setup Flow

```text
Install Prisma
       ↓
Initialize Prisma
       ↓
Configure DATABASE_URL
       ↓
Create Models
       ↓
Apply Schema
       ↓
Generate Prisma Client
       ↓
Use Prisma in Express
```

---

# Step 1: Install Prisma

Install Prisma CLI:

```bash
pnpm add -D prisma
```

Install Prisma Client:

```bash
pnpm add @prisma/client
```

Check installation:

```bash
pnpm prisma --version
```

---

# Step 2: Initialize Prisma

Run:

```bash
pnpm prisma init
```

This creates:

```text
prisma/
└── schema.prisma

.env
```

### pnpm vs npx

Preferred in pnpm projects:

```bash
pnpm prisma init
```

Alternative:

```bash
npx prisma init
```

`npx` can download and execute Prisma temporarily if needed.

---

# Step 3: Configure Database URL

Open:

```text
.env
```

PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"
```

MySQL:

```env
DATABASE_URL="mysql://root:password@localhost:3306/mydb"
```

SQLite:

```env
DATABASE_URL="file:./dev.db"
```

---

# Step 4: Configure schema.prisma

Example PostgreSQL setup:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

```prisma
generator client {
provider = "prisma-client"
output = "../src/generated/prisma"
}

datasource db {
provider = "postgresql"
}
```

These two Prisma schemas are using **different Prisma Client generation approaches**.

---

## Example 1 (Traditional / Most Common)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### What happens?

Prisma generates the client into:

```text
node_modules/@prisma/client
```

Then you use it like:

```js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
```

### Generate command

```bash
pnpm prisma generate
```

### Pros

- Most tutorials use it
- Simple setup
- No extra configuration
- Works well with CommonJS

### Cons

- Generated code is hidden inside `node_modules`
- Harder to inspect generated files

---

## Example 2 (New Prisma Generator)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

### What happens?

Prisma generates files into:

```text
src/
└── generated/
    └── prisma/
```

instead of:

```text
node_modules/@prisma/client
```

You import from your generated folder:

```js
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();
```

---

## Why `output` Is Required Here?

With:

```prisma
provider = "prisma-client"
```

Prisma needs to know where to generate the client.

Example:

```prisma
output = "../src/generated/prisma"
```

Without an output path, Prisma doesn't know where to place generated files.

---

## Missing `url` in Example 2

You wrote:

```prisma
datasource db {
  provider = "postgresql"
}
```

This is incomplete.

Normally it should be:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Otherwise Prisma doesn't know how to connect to the database.

---

## Folder Comparison

### `prisma-client-js`

```text
project/
├── prisma/
│   └── schema.prisma
├── node_modules/
│   └── @prisma/client
```

Generated client lives in:

```text
node_modules/@prisma/client
```

---

### `prisma-client`

```text
project/
├── prisma/
│   └── schema.prisma
├── src/
│   └── generated/
│       └── prisma/
```

Generated client lives in:

```text
src/generated/prisma
```

---

## Which Should You Use?

### For Express.js + CommonJS Beginners

Use:

```prisma
generator client {
  provider = "prisma-client-js"
}
```

and:

```js
const { PrismaClient } = require("@prisma/client");
```

This is still the most common setup you'll see in Express.js tutorials and codebases.

---

### For Modern Projects (especially TypeScript)

Many newer Prisma projects use:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

because:

- Generated code is inside the project
- Easier to inspect
- Better control over generated files
- Better fit for monorepos and advanced setups

---

## Quick Summary

| Feature                           | `prisma-client-js`            | `prisma-client` |
| --------------------------------- | ----------------------------- | --------------- |
| Generated Location                | `node_modules/@prisma/client` | Custom folder   |
| Requires `output`                 | No                            | Yes             |
| Most tutorials use                | ✅ Yes                        | ❌ Not yet      |
| CommonJS friendly                 | ✅ Yes                        | ✅ Yes          |
| TypeScript friendly               | ✅ Yes                        | ✅ Yes          |
| Easier to inspect generated files | ❌ No                         | ✅ Yes          |
| Recommended for beginners         | ✅ Yes                        | ⚠️ Usually no   |

For your current stack (**Express.js + CommonJS + pnpm + PostgreSQL**), I'd recommend starting with:

```prisma
generator client {
  provider = "prisma-client-js"
}
```

and moving to `prisma-client` later once you're comfortable with Prisma's basics.

Supported providers:

```text
postgresql
mysql
sqlite
sqlserver
mongodb
cockroachdb
```

---

# Step 5: Create Your First Model

Example:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Field Explanation

| Attribute                   | Purpose                                        |
| --------------------------- | ---------------------------------------------- |
| `@id`                       | Primary Key                                    |
| `@default(autoincrement())` | Auto increments integer IDs                    |
| `@unique`                   | Prevents duplicate values                      |
| `@default(now())`           | Sets creation timestamp                        |
| `@updatedAt`                | Updates automatically whenever the row changes |

---

# Step 6: Apply the Schema

## Option 1: Quick Development Sync

Push schema directly to database:

```bash
pnpm prisma db push
```

Best for:

- Learning
- Prototypes
- Small projects

---

## Option 2: Migrations (Recommended)

Create migration files:

```bash
pnpm prisma migrate dev --name init
```

Benefits:

- Version history
- Team collaboration
- Rollback support
- Production friendly

---

# Step 6B: Existing Database Already Exists

If your PostgreSQL database and tables already exist:

## Option 1: Introspect Existing Database

Run:

```bash
pnpm prisma db pull
```

Prisma will:

```text
Database
    ↓
db pull
    ↓
schema.prisma generated
```

Then generate the client:

```bash
pnpm prisma generate
```

Recommended workflow:

```bash
pnpm prisma db pull
pnpm prisma generate
```

---

## Option 2: Manual Schema Mapping

Verify existing tables:

```bash
docker exec -it express_db psql -U postgres -d mydb -c "\dt"
```

Manually create matching models:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Generate Prisma Client:

```bash
pnpm prisma generate
```

---

# Step 7: Generate Prisma Client

Run:

```bash
pnpm prisma generate
```

Prisma automatically runs this after:

```bash
pnpm prisma migrate dev
```

or

```bash
pnpm prisma db push
```

but it is useful to know the command.

---

# Step 8: Use Prisma in Express

Create:

```text
src/config/prisma.js
```

```js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;
```

---

## Create User

```js
const prisma = require("../config/prisma");

await prisma.user.create({
  data: {
    name: "John",
    email: "john@gmail.com",
    password: "123456",
  },
});
```

---

## Find User

```js
await prisma.user.findUnique({
  where: {
    email: "john@gmail.com",
  },
});
```

---

## Get All Users

```js
await prisma.user.findMany();
```

---

## Update User

```js
await prisma.user.update({
  where: {
    id: 1,
  },
  data: {
    name: "Updated Name",
  },
});
```

---

## Delete User

```js
await prisma.user.delete({
  where: {
    id: 1,
  },
});
```

---

# Common Prisma Commands

| Action              | Command                               |
| ------------------- | ------------------------------------- |
| Initialize Prisma   | `pnpm prisma init`                    |
| Push Schema         | `pnpm prisma db push`                 |
| Create Migration    | `pnpm prisma migrate dev --name init` |
| Generate Client     | `pnpm prisma generate`                |
| Introspect Database | `pnpm prisma db pull`                 |
| Open Prisma Studio  | `pnpm prisma studio`                  |
| Reset Database      | `pnpm prisma migrate reset`           |
| Migration Status    | `pnpm prisma migrate status`          |

---

# Docker Commands

| Action                  | Command                                               |
| ----------------------- | ----------------------------------------------------- |
| Start Containers        | `docker compose up -d`                                |
| Stop Containers         | `docker compose down`                                 |
| View Logs               | `docker compose logs postgres`                        |
| View Running Containers | `docker ps`                                           |
| View All Containers     | `docker ps -a`                                        |
| Enter PostgreSQL        | `docker exec -it express_db psql -U postgres -d mydb` |

---

# Recommended Project Structure

```text
src/
├── config/
│   └── prisma.js
├── controllers/
├── services/
├── routes/
├── middlewares/
├── index.js
└── swagger.js

prisma/
└── schema.prisma

.env
```

---

# Key Takeaways

- Prisma is an ORM for Node.js.
- Docker is not a database; it runs databases inside containers.
- Prefer `pnpm prisma init` in pnpm projects.
- Use `docker compose` instead of the older `docker-compose`.
- Use migrations for long-term projects.
- Use `db push` for learning and prototypes.
- For existing databases, use:

```bash
pnpm prisma db pull
pnpm prisma generate
```

- Keep a shared Prisma client instance.
- Store sensitive values such as `DATABASE_URL` in environment variables.
- Docker + PostgreSQL + Prisma is one of the most common Express.js development setups.
