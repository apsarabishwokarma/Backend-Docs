# TypeORM — Why ORM?

## 1. What problem are we solving?

A Node.js backend usually needs to store and retrieve data from a database.

For this series, the stack is roughly:

```text
Client
  ↓
Express / Node.js
  ↓
TypeORM
  ↓
PostgreSQL
```

But technically, TypeORM is **not required**.

Node can talk to PostgreSQL directly using a database driver such as `pg`.

So the real question is:

> Why put TypeORM between our application and PostgreSQL?

---

# 2. Database Driver

A **database driver** is a library that allows your application to communicate directly with a database.

For PostgreSQL in Node.js, a common driver is:

```bash
npm install pg
```

Then you can execute SQL directly:

```ts
import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "my_app",
});

export async function getUsers() {
  const result = await pool.query("SELECT id, name, email FROM users");

  return result.rows;
}
```

Here we are directly writing:

```sql
SELECT id, name, email FROM users;
```

So:

```text
Node.js
   ↓
pg driver
   ↓
SQL
   ↓
PostgreSQL
```

---

# 3. Creating Data Without an ORM

Suppose we want to create a user.

Using the PostgreSQL driver directly:

```ts
export async function createUser(name: string, email: string) {
  const result = await pool.query(
    `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING *
    `,
    [name, email],
  );

  return result.rows[0];
}
```

This is completely valid.

There is nothing wrong with using SQL directly.

But as an application grows, you may end up writing a lot of:

```text
SELECT
INSERT
UPDATE
DELETE
JOIN
WHERE
ORDER BY
GROUP BY
```

inside your application code.

---

# 4. Problems That Appear With Direct Database Access

Imagine a larger application:

```text
users
messages
posts
comments
payments
orders
products
appointments
```

Each feature may contain many SQL queries.

You start getting code such as:

```ts
await pool.query("SELECT ...");

await pool.query("INSERT ...");

await pool.query("UPDATE ...");

await pool.query("DELETE ...");
```

Common problems include:

- lots of repetitive SQL
- manually mapping database rows into application objects
- repeated CRUD code
- SQL spread throughout the application
- harder refactoring when table structures change
- stronger coupling between application code and a specific database
- more boilerplate for relationships

This is one reason ORMs exist.

---

# 5. ORM

ORM stands for:

> **Object Relational Mapping**

Break the name down:

```text
Object
↓
JavaScript / TypeScript objects and classes

Relational
↓
relational databases such as PostgreSQL

Mapping
↓
connecting the two worlds
```

So an ORM maps:

```text
Application world        Database world

User class        ↔       users table

user.id           ↔       id column
user.name         ↔       name column
user.email        ↔       email column

User object       ↔       database row
```

---

# 6. Without ORM vs With ORM

## Without ORM

You think mainly in SQL:

```ts
const result = await pool.query(
  `
    SELECT id, name, email
    FROM users
    WHERE id = $1
  `,
  [id],
);
```

## With ORM

You work through objects/repositories:

```ts
const user = await userRepository.findOne({
  where: {
    id,
  },
});
```

TypeORM generates the required SQL for you.

Conceptually:

```text
TypeScript code

userRepository.findOne(...)
        ↓
TypeORM
        ↓
SQL generated internally
        ↓
PostgreSQL
```

---

# 7. TypeORM

**TypeORM** is an ORM for TypeScript and JavaScript.

It gives us concepts such as:

```text
Entity
Repository
Relations
Migrations
Query Builder
DataSource
```

The most important ones initially are:

```text
Entity
↓
describes stored data

Repository
↓
reads/writes that data
```

---

# 8. Entity

Suppose PostgreSQL has this table:

```text
users
────────────────────────
id
name
email
```

In TypeORM we can describe it using a class:

```ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;
}
```

Now we have a mapping:

```text
TypeScript                 PostgreSQL

User class          ↔      users table

id                  ↔      id
name                ↔      name
email               ↔      email
```

That is the **Object Relational Mapping**.

---

# 9. What Do the Entity Decorators Mean?

## `@Entity()`

```ts
@Entity()
export default class User {}
```

Tells TypeORM:

> This class represents data stored in the database.

---

## `@PrimaryGeneratedColumn()`

```ts
@PrimaryGeneratedColumn()
id: number;
```

Represents a generated primary key.

Conceptually:

```sql
id SERIAL PRIMARY KEY
```

or the database-specific equivalent.

---

## `@Column()`

```ts
@Column()
name: string;
```

Tells TypeORM that:

```text
name
```

should be stored as a database column.

---

# 10. Repository

Once TypeORM knows about the `User` entity, we can get a repository.

```ts
const userRepository = dataSource.getRepository(User);
```

The repository provides methods for working with users.

For example:

```ts
const users = await userRepository.find();
```

instead of manually writing:

```sql
SELECT * FROM users;
```

---

# 11. CRUD With TypeORM

## Find All

```ts
const users = await userRepository.find();
```

Conceptually:

```sql
SELECT * FROM users;
```

---

## Find One

```ts
const user = await userRepository.findOne({
  where: {
    id: 5,
  },
});
```

Conceptually:

```sql
SELECT *
FROM users
WHERE id = 5;
```

---

## Create

First create an object:

```ts
const user = userRepository.create({
  name: "Rupesh",
  email: "rupesh@example.com",
});
```

Then save it:

```ts
await userRepository.save(user);
```

Conceptually TypeORM generates an:

```sql
INSERT INTO users ...
```

---

## Update

```ts
await userRepository.update(
  {
    id: 5,
  },
  {
    name: "Updated name",
  },
);
```

Conceptually:

```sql
UPDATE users
SET name = 'Updated name'
WHERE id = 5;
```

---

## Delete

```ts
await userRepository.delete({
  id: 5,
});
```

Conceptually:

```sql
DELETE FROM users
WHERE id = 5;
```

---

# 12. The Main Difference

## Database Driver

A database driver gives you:

```text
Connection to PostgreSQL
+
ability to execute SQL
```

You decide exactly what SQL should run.

```text
Node
 ↓
pg
 ↓
your SQL
 ↓
PostgreSQL
```

---

## ORM

An ORM gives you a higher-level abstraction:

```text
Node
 ↓
TypeORM
 ↓
generated SQL
 ↓
database driver
 ↓
PostgreSQL
```

Important:

> TypeORM still needs a database driver underneath.

TypeORM does **not replace PostgreSQL's driver at the lowest level**.

It sits above it.

For PostgreSQL, the architecture is roughly:

```text
Your application
      ↓
TypeORM
      ↓
pg PostgreSQL driver
      ↓
PostgreSQL
```

---

# 13. Why Use an ORM?

The major advantage is developer productivity.

Instead of repeatedly thinking:

```text
How do I write this SELECT?
How do I map this row?
How do I insert this object?
How do I manage this relationship?
```

you can work with TypeScript objects:

```ts
userRepository.find();

userRepository.findOne(...);

userRepository.save(...);

userRepository.delete(...);
```

Benefits include:

```text
less repetitive SQL

cleaner application code

object ↔ table mapping

built-in CRUD APIs

relationship handling

migrations

query builders

better TypeScript integration

centralized database models
```

---

# 14. Relationships Are Another Big Benefit

Suppose:

```text
User
 ↓
has many Posts
```

Database:

```text
users
  │
  │ id
  │
  └──────────────┐
                 │
posts            │
  │              │
  └── user_id ───┘
```

TypeORM can represent this relationship in application code:

```ts
@OneToMany(
  () => Post,
  (post) => post.user,
)
posts: Post[];
```

and:

```ts
@ManyToOne(
  () => User,
  (user) => user.posts,
)
user: User;
```

Instead of manually dealing with foreign-key mapping everywhere.

---

# 15. Does ORM Mean We Never Need SQL?

No.

This is important.

Using TypeORM does **not mean SQL knowledge becomes unnecessary**.

You should still understand:

```text
tables
rows
columns
primary keys
foreign keys
indexes
joins
transactions
constraints
SQL queries
```

Why?

Because TypeORM ultimately generates SQL.

For simple operations:

```ts
repository.find();
```

is great.

For more complicated queries you may use:

```ts
repository
  .createQueryBuilder("user")
  .where("user.age > :age", {
    age: 18,
  })
  .getMany();
```

And in some situations raw SQL can still be the best solution.

---

# 16. ORM Is an Abstraction

A useful way to think about TypeORM is:

```text
HIGH LEVEL

TypeORM

repository.find()
repository.save()

──────────── abstraction ────────────

SQL

SELECT
INSERT
UPDATE

──────────── abstraction ────────────

PostgreSQL Driver

pg

──────────── abstraction ────────────

PostgreSQL

LOW LEVEL
```

The higher level is usually easier to work with.

The lower level gives you more direct control.

---

# 17. Raw SQL Is Not Bad

ORM should not be understood as:

```text
SQL = bad

ORM = good
```

That would be incorrect.

Raw SQL can be excellent when you need:

```text
very complex queries
fine-grained performance optimization
database-specific functionality
maximum control
```

An ORM trades some low-level control for convenience and abstraction.

---

# 18. Driver vs Query Builder vs ORM

There are roughly three levels.

## Driver

Example:

```text
pg
```

You write SQL yourself:

```ts
pool.query("SELECT * FROM users");
```

Maximum SQL control.

---

## Query Builder

Example concept:

```ts
db
  .select()
  .from(users)
  .where(...);
```

You build SQL through code.

---

## ORM

Example:

```ts
userRepository.find({
  where: {
    active: true,
  },
});
```

You think more in terms of application objects/entities.

---

# 19. Why TypeORM Fits TypeScript Well

TypeORM uses TypeScript classes and decorators.

Example:

```ts
@Entity()
export default class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;
}
```

You already work with:

```text
classes
properties
types
decorators
```

and TypeORM maps those concepts to your relational database.

So instead of thinking only:

```text
TABLE
ROW
COLUMN
```

your application can often think:

```text
Message
User
Appointment
Payment
```

while TypeORM handles much of the translation.

---

# 20. How This Connects to NestJS

In a NestJS application, you'll commonly see:

```text
Controller
   ↓
Service
   ↓
TypeORM Repository
   ↓
Entity
   ↓
PostgreSQL
```

Example:

```ts
@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }
}
```

So the repository you were learning about earlier can often be provided by TypeORM.

---

# 21. Important Mental Model

Remember this:

```text
Database Driver
=
"Let me communicate with PostgreSQL."

ORM
=
"Let me work with database data using application objects."

TypeORM
=
"A TypeScript ORM that maps classes/entities to relational database data."
```

---

# 22. Complete Flow

Without ORM:

```text
Request
  ↓
Express
  ↓
Application code
  ↓
Write SQL manually
  ↓
pg driver
  ↓
PostgreSQL
  ↓
rows returned
  ↓
manually use/map rows
```

With TypeORM:

```text
Request
  ↓
Express / NestJS
  ↓
Service
  ↓
TypeORM Repository
  ↓
TypeORM generates SQL
  ↓
pg driver
  ↓
PostgreSQL
  ↓
TypeORM maps result
  ↓
TypeScript object
```

---

# 23. One Small Example

Imagine:

```text
GET /users/5
```

## Direct driver

```ts
const result = await pool.query(
  `
    SELECT *
    FROM users
    WHERE id = $1
  `,
  [5],
);

const user = result.rows[0];
```

## TypeORM

```ts
const user = await userRepository.findOne({
  where: {
    id: 5,
  },
});
```

Both ultimately retrieve the same data.

The difference is the abstraction you work with.

---

# 24. What You Should Remember From This Video

```text
ORM
=
Object Relational Mapping
```

It maps:

```text
class  ↔ table
object ↔ row
field  ↔ column
```

A database driver such as `pg` lets Node communicate directly with PostgreSQL.

TypeORM sits above the driver and provides a higher-level API.

```text
Application
   ↓
TypeORM
   ↓
PostgreSQL driver
   ↓
PostgreSQL
```

The main reason to use an ORM is:

> Make database-related application development easier to structure, maintain, and work with by representing relational data using application-level objects.

But:

> Learn SQL as well. An ORM is an abstraction over SQL, not a replacement for understanding databases.

---

# Quick Revision

```text
Database
→ stores data

PostgreSQL
→ relational database

Database Driver (`pg`)
→ lets Node communicate with PostgreSQL

SQL
→ language used to query PostgreSQL

ORM
→ maps application objects to relational database data

TypeORM
→ ORM for JavaScript/TypeScript

Entity
→ class mapped to database data/table

Repository
→ API used to find/save/update/delete entities
```
