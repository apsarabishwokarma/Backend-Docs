# Prisma Setup Guide for Express.js

## Prerequisites

Before you start, make sure you have:

- An Express.js project
- CommonJS modules (`require` and `module.exports`)
- pnpm installed
- A database available, such as PostgreSQL, MySQL, or SQLite

## What Prisma Is

Prisma is an ORM for Node.js that helps you work with databases using type-safe queries, migrations, and schema files instead of writing raw SQL everywhere.

Example:

```js
const users = await prisma.user.findMany();
```

## Setup Flow

1. Install Prisma
2. Initialize Prisma
3. Configure the database URL
4. Define your schema
5. Create a model
6. Run a migration or sync the schema
7. Generate the Prisma Client
8. Use Prisma in Express

## Step 1: Install Prisma

```bash
pnpm add -D prisma
pnpm add @prisma/client
```

Check the installation:

```bash
pnpm prisma --version
```

## Step 2: Initialize Prisma

Run:

```bash
pnpm prisma init
```

This creates:

```text
prisma/
  schema.prisma

.env
```

Use `npx prisma init` only if you want to run Prisma without relying on the local package manager setup.

## Step 3: Configure the Database URL

Open `.env` and set `DATABASE_URL` for your database.

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

## Step 4: Configure `schema.prisma`

Example PostgreSQL schema:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Supported providers:

```text
postgresql
mysql
sqlite
sqlserver
mongodb
cockroachdb
```

## Step 5: Create Your First Model

Example `User` model:

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

Field summary:

- `@id` marks the primary key
- `@unique` prevents duplicate values
- `@default(now())` sets the current timestamp when a record is created
- `@updatedAt` updates the timestamp whenever the record changes

## Step 6: Apply the Schema

If you want a quick sync during learning or early development:

```bash
pnpm prisma db push
```

If you want migrations and version history:

```bash
pnpm prisma migrate dev --name init
```

## Step 7: Generate Prisma Client

```bash
pnpm prisma generate
```

Prisma usually runs this automatically after `migrate dev` or `db push`, but it is useful to run manually when needed.

## Step 8: Use Prisma in Express

Create a reusable Prisma client file, for example:

```text
src/config/prisma.js
```

```js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;
```

Example usage in a controller or service:

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

Other common queries:

```js
await prisma.user.findUnique({
  where: { email: "john@gmail.com" },
});

await prisma.user.findMany();

await prisma.user.update({
  where: { id: 1 },
  data: { name: "Updated Name" },
});

await prisma.user.delete({
  where: { id: 1 },
});
```

## Common Prisma Commands

| Action                 | Command                               |
| ---------------------- | ------------------------------------- |
| Initialize Prisma      | `pnpm prisma init`                    |
| Sync schema            | `pnpm prisma db push`                 |
| Create migration       | `pnpm prisma migrate dev --name init` |
| Generate client        | `pnpm prisma generate`                |
| Open Studio            | `pnpm prisma studio`                  |
| Reset database         | `pnpm prisma migrate reset`           |
| Check migration status | `pnpm prisma migrate status`          |

## Recommended Project Structure

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
```

## Key Takeaway

- Use `pnpm prisma init` in pnpm-based projects
- Use `npx prisma init` only when you intentionally want a one-off CLI run
- Keep Prisma client setup in a shared module
- Prefer migrations once the schema is stable
