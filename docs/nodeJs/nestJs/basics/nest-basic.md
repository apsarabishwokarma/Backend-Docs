### What is NestJS?

NestJS is a Node.js framework for building backend APIs like Express, but way more structured useful for creating efficient, scalable server-side applications.

- It uses progressive JavaScript, is built with and fully supports TypeScript (while still allowing pure JavaScript),and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

Think of it as "Express + Angular's architecture philosophy" — it gives us:

- TypeScript by default — catches bugs before runtime
- Modular architecture — your app is split into Modules, Controllers, and Services (also called "providers")
- Dependency Injection (DI) — built-in, so your code stays testable and decoupled
- Decorators — @Controller(), @Injectable(), @Get() etc. define behavior declaratively

### Summary

- **NestJS** is a framework for building **Node.js backend applications**.
- It mainly uses **TypeScript**, but you can also use JavaScript.
- **Node.js** must be installed first.
- NestJS currently requires a recent Node.js version (the latest active LTS is recommended).

#### Main idea

Think of NestJS like this:

**NestJS = Node.js + TypeScript + organized structure for building backends**

And the basic flow is:

**Request → Controller → Service → Response**

## Why Nest Js ? Comparison between Nest and Express.

## Setup

- npm init -y -> install package.json
- npm install dependencies list

## Require dependencies

- @nestjs/common : Contains vast majority of functions, classes, etc, that we need from Nest
- @nestjs/core :
- @nestjs/platform-express:Lets Nest use Express JS for handling HTTP requests
- reflect-metadata :Helps make decorators work.
- typescript : we write nest js with typescript

# Core NestJS Dependencies Explained

## `@nestjs/common`

The **shared toolbox** of Nest — contains almost everything you use daily when writing Nest code.

Includes:

- Decorators: `@Controller()`, `@Injectable()`, `@Get()`, `@Post()`, `@Body()`, `@Param()`, etc.
- Pipes, guards, interceptors, exception filters (base classes)
- HTTP exception classes (`BadRequestException`, `NotFoundException`, etc.)

**In short:** if you're importing something from `@nestjs/...` in your controllers/services, it's very likely coming from here.

```ts
import { Controller, Get, Injectable } from "@nestjs/common";
```

---

## `@nestjs/core`

The **engine room** of Nest — this is what actually _runs_ your application.

Includes:

- `NestFactory` (used to bootstrap the app in `main.ts`)
- The **Dependency Injection (DI) container** — resolves and injects services into controllers/other services
- Module resolution logic — figures out how your `@Module()`s connect to each other

**In short:** `@nestjs/common` gives you the _building blocks_, `@nestjs/core` is what _assembles and runs_ them.

```ts
import { NestFactory } from "@nestjs/core";
```

---

## `@nestjs/platform-express`

Nest is **platform-agnostic** — it doesn't run HTTP servers itself. It delegates that to an underlying HTTP library.

This package is the **adapter** that connects Nest to **Express.js** under the hood.

- When you call `NestFactory.create(AppModule)`, Nest internally spins up an Express app and wires your controllers' routes into Express's routing system.
- If you swapped this package for `@nestjs/platform-fastify`, your app would run on Fastify instead — with **zero changes** to your controllers/services. That's the whole point of the platform-agnostic design.

**In short:** this is the bridge between Nest's abstractions and the actual Express server doing the HTTP work.

---

## `reflect-metadata`

This one is more subtle and important to actually understand — **not just install-and-forget**.

### What it is

A polyfill that implements the **Metadata Reflection API** — an experimental JS/TS feature that lets you **attach and read metadata on classes, methods, and properties at runtime**.

### Why Nest needs it

Nest's **entire Dependency Injection system runs on this**.

When you write:

```ts
@Injectable()
class UsersService {}

@Controller("users")
class UsersController {
  constructor(private usersService: UsersService) {}
}
```

Nest needs to know, **at runtime**, that `UsersController`'s constructor expects a `UsersService`. TypeScript normally erases type information when compiling to JS — types don't exist at runtime by default.

But when you enable `emitDecoratorMetadata: true` in `tsconfig.json`, TypeScript uses `reflect-metadata` to **stamp constructor parameter types onto the class as metadata**. Nest then reads that metadata at runtime to know _what to inject_.

**Without `reflect-metadata`, Nest's DI simply cannot function** — this is why it's imported once, right at the top of `main.ts`:

```ts
import "reflect-metadata";
```

This is a good example of "how frameworks work underneath" — DI isn't magic, it's decorators + compiler-emitted metadata + a runtime reflection library reading that metadata.

---

## `typescript`

The **TypeScript compiler** (`tsc`) itself — converts your `.ts` files into plain `.js` that Node.js can actually execute, and provides the type-checking during development.

Nest is written in and designed around TypeScript — decorators, interfaces, DI typing all depend on TS's compiler features (especially `emitDecoratorMetadata` and `experimentalDecorators`).

---

## Quick Reference Table

| Package                    | Role                                               | Analogy                                  |
| -------------------------- | -------------------------------------------------- | ---------------------------------------- |
| `@nestjs/common`           | Decorators, pipes, guards, exceptions              | The toolbox                              |
| `@nestjs/core`             | DI container, app bootstrapping, module resolution | The engine                               |
| `@nestjs/platform-express` | Adapter connecting Nest to Express                 | The bridge to the HTTP server            |
| `reflect-metadata`         | Runtime metadata for DI to work                    | The engine's memory of "what needs what" |
| `typescript`               | Compiles `.ts` → `.js`, type checking              | The translator                           |

## TS config File

This is a **TypeScript `tsconfig.json`** configuration.

our config is:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2017",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Let's understand each one and, more importantly, **why we'd need it**.

---

## 1. `"module": "commonjs"`

```json
"module": "commonjs"
```

This tells TypeScript:

> "When you compile my TypeScript, use the CommonJS module system."

For example, you write:

```ts
import { User } from "./user";
```

TypeScript needs to turn that into JavaScript that your runtime understands.

With CommonJS, it roughly becomes:

```js
const user_1 = require("./user");
```

CommonJS is the module system traditionally used by **Node.js**.

### Think of it as:

```text
TypeScript
   ↓
import/export
   ↓
CommonJS
   ↓
require() / module.exports
```

However, **you don't automatically need CommonJS in modern projects**. Modern Node.js and bundlers can use ES modules (`"module": "NodeNext"`, `"ESNext"`, etc.).

So whether you need this depends on your project setup.

---

# 2. `"target": "es2017"`

```json
"target": "es2017"
```

This tells TypeScript:

> "What version of JavaScript should I generate?"

You might write modern TypeScript:

```ts
const user = {
  name: "Apsara",
};
```

TypeScript needs to decide what JavaScript version to output.

For example:

```text
TypeScript
    ↓
compile
    ↓
ES2017 JavaScript
```

`ES2017` is a JavaScript standard from 2017.

### Why does this matter?

Different environments support different JavaScript features.

If you're targeting an old browser, you might use:

```json
"target": "es5"
```

For a modern Node.js application, you might use something newer:

```json
"target": "es2022"
```

or

```json
"target": "es2023"
```

So:

```json
"target": "es2017"
```

basically means:

> "Generate JavaScript that should work in an ES2017-compatible environment."

---

# 3. `"experimentalDecorators": true`

This is the important one if you're learning **decorators**.

```json
"experimentalDecorators": true
```

It tells TypeScript:

> "Allow me to use decorator syntax."

For example:

```ts
class UserController {
  @Get("/users")
  getUsers() {
    return [];
  }
}
```

That:

```ts
@Get("/users")
```

is a **decorator**.

Another example:

```ts
@Injectable()
class UserService {}
```

You see this heavily in frameworks such as NestJS.

Without:

```json
"experimentalDecorators": true
```

TypeScript may complain about the decorator syntax.

### Conceptually:

```text
@Injectable()
     ↓
  decorator
     ↓
TypeScript compiler
     ↓
needs decorator support enabled
```

That's why you see:

```json
"experimentalDecorators": true
```

---

# 4. `"emitDecoratorMetadata": true`

This one is a little more advanced.

```json
"emitDecoratorMetadata": true
```

It tells TypeScript:

> "When decorators are used, generate extra metadata about things like the types of parameters and properties."

For example:

```ts
@Injectable()
class UserService {}

@Controller()
class UserController {
  constructor(private userService: UserService) {}
}
```

TypeScript knows that:

```ts
userService: UserService;
```

has the type:

```text
UserService
```

With decorator metadata enabled, TypeScript can emit information that frameworks can inspect at runtime(TypeScript can generate information in the compiled JavaScript output, so frameworks can look at it while the program is running).

This is especially useful for **dependency injection**.

---

## Why would a framework need that?

Imagine NestJS sees:

```ts
class UserController {
  constructor(private userService: UserService) {}
}
```

NestJS needs to figure out:

> "The constructor needs a `UserService`. Which object should I provide?"

Decorator metadata can provide information that helps the framework do this automatically.

Conceptually:

```text
Your code
   ↓
UserService
   ↓
TypeScript compiler
   ↓
metadata
   ↓
framework
   ↓
"Ah, UserController needs UserService"
```

---

### Easy mental model

```text
tsconfig.json
      │
      ├── target
      │      └── "Which JS version?Which JavaScript version TypeScript generates
      │
      ├── module
      │      └── "How should modules work? How `import` / `export` becomes JavaScript modules""
      │
      ├── experimentalDecorators
      │      └── "Allows decorator syntax like `@Injectable() Can I use @decorators?"
      │
      └── emitDecoratorMetadata
             └── "Generates runtime type metadata used by some decorator-based frameworks .Should TS generate type information
                  for decorators?"
```

So this:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2017",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

roughly says:

> **"Compile my TypeScript into ES2017 JavaScript, use CommonJS modules, allow decorators, and generate metadata for those decorators."**

## NestJS request flow

A request entering a **NestJS server** as going through several checkpoints.

```text
Client
  │
  ▼
Pipe
  │
  ▼
Guard
  │
  ▼
Controller
  │
  ▼
Service
  │
  ▼
Repository
  │
  ▼
Database
```

Nest has tool to help us write all these

### 1. Pipe - Validate the request

**Purpose:** Validate or transform incoming data contained in the request.

For example, suppose the client sends:

```json
{
  "email": "apsara@example.com",
  "age": "20"
}
```

A DTO and validation pipe can check that:

- `email` is a valid email
- `age` is a number
- required fields exist
- unwanted fields are rejected

Typical NestJS code:

```ts
@Post()
createUser(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

With:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
  }),
);
```

So the **Pipe answers:**

> "Is the incoming data valid ?"

---

### 2. Guard - Check authentication/authorization

The Guard determines whether the request is allowed to continue.
Make sure the user is authenticated or not . But for public apis we can skip.
For example:

```text
Request
   │
   ▼
Is user authenticated?
   │
   ├── No  →  401 Unauthorized
   │
   └── Yes
         │
         ▼
      Continue
```

A JWT authentication guard might inspect the user's token.

A useful distinction:

- **Authentication** → Who are you?
- **Authorization** → Are you allowed to do this?
  The **Guard answers:**

> "Is this user allowed to access this endpoint?"

---

### 3. Controller - Route the request

The Controller is responsible for handling the HTTP endpoint. It routes the request to the particular functions.

For example:

```ts
@Controller("users")
export class UsersController {
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
```

A request such as:

```http
POST /users
```

gets routed to:

```ts
create();
```

The Controller should generally **not contain complicated business logic**.

It primarily handles things like:

```text
HTTP request
     ↓
Controller
     ↓
Call appropriate service
     ↓
Return response
```

The **Controller answers:**

> "Which application function should handle this request?"

---

### 4. Service - Business logic

This is where the application's actual business rules usually live.

For example:

```ts
@Injectable()
export class UsersService {
  async create(dto: CreateUserDto) {
    // Business logic
    // Check rules
    // Prepare data

    return this.usersRepository.create(dto);
  }
}
```

Imagine a banking application:

```text
Controller
    ↓
TransferService
    ↓
Check balance
    ↓
Check transfer rules
    ↓
Calculate fees
    ↓
Transfer money
```

The **Service answers:**

> "What should the application actually do?"

---

### 5. Repository - Database access

The Repository handles persistence/data access.
Handles data stored in a DB
For example:

```ts
@Injectable()
export class UsersRepository {
  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }
}
```

The service doesn't need to know exactly how the database works.

Instead:

```text
Service
   │
   │ createUser()
   ▼
Repository
   │
   │ SQL / Prisma / TypeORM
   ▼
Database
```

The **Repository answers:**

> "How do I store or retrieve this data?"

### Other terminologies

## Module - Organize everything

A Module groups related parts of your application.
Groups together code
For example:

```text
UsersModule
 ├── UsersController
 ├── UsersService
 └── UsersRepository
```

Example:

```ts
@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
```

You might have:

```text
AppModule
│
├── UsersModule
├── AuthModule
├── ProductsModule
├── OrdersModule
└── PaymentsModule
```

### Responsibility

> **Which pieces belong together?**

---

## Interceptor - "Do something before/after"

Interceptors wrap around the request/response process.
Adds extra logic to incoming requests or outgoing responses

Conceptually:

```text
       Interceptor
       ┌───────────────┐
       │               ↓
Request → Controller → Response
       │               ↑
       └───────────────┘
```

They can be used for things such as:

- Logging
- Measuring execution time
- Transforming responses
- Caching
- Adding extra behavior before/after a handler

Example idea:

```text
Request
   ↓
Start timer
   ↓
Controller
   ↓
Service
   ↓
Response
   ↓
Calculate elapsed time
   ↓
Return response
```

### Responsibility

> **Do something around the request/response lifecycle.**

---

## Exception Filter — "Handle errors"

- handles errors that occur during request handling.
  Suppose something goes wrong:

```text
Controller
    ↓
Service
    ↓
Database
    X
  Error
```

An exception filter can catch the exception and produce an appropriate HTTP response.

For example:

```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

### Responsibility

> **How should application exceptions/errors be handled and returned?**

---

# Putting everything together

Here's the mental model I recommend remembering:

```text
                    ┌──────────────┐
                    │    Module    │
                    │   organizes  │
                    │    things    │
                    └──────┬───────┘
                           │
Client                     │
  │                        │
  ▼                        │
Interceptor                │
  │                        │
  ▼                        │
Guard                      │
  │                        │
  ▼                        │
Pipe                       │
  │                        │
  ▼                        │
Controller ────────────────┘
  │
  ▼
Service
  │
  ▼
Repository
  │
  ▼
Database
```

And **Exception Filters can handle errors from the request-processing chain**.

## The easiest way to memorize it

| NestJS part          | Think of it as     | Main question                          |
| -------------------- | ------------------ | -------------------------------------- |
| **Module**           | Organizer          | What belongs together?                 |
| **Controller**       | Receptionist       | Which endpoint handles this?           |
| **Guard**            | Security           | Is this request allowed?               |
| **Pipe**             | Validator          | Is this data valid?                    |
| **Service**          | Worker/Manager     | What should the application do?        |
| **Repository**       | Database clerk     | How do we access the data?             |
| **Interceptor**      | Middleware wrapper | What should happen around the request? |
| **Exception Filter** | Error handler      | How should errors be handled?          |

One important detail: **Repository is a common architectural pattern in NestJS applications, but it isn't one of Nest's built-in application building blocks in the same sense as Controllers, Providers/Services, Modules, Pipes, Guards, Interceptors, and Exception Filters.**

For learning NestJS, the most useful request flow to memorize is:

**Request → Guard → Pipe → Controller → Service → Repository → Database**

with **Interceptors wrapping the flow** and **Exception Filters handling exceptions**.

---

## Why separate these layers?

The biggest benefit is **separation of responsibilities**.

Instead of putting everything into a Controller:

```ts
@Post()
async createUser() {
  // validation
  // authentication
  // business rules
  // SQL
  // response formatting
  // everything
}
```

NestJS encourages something closer to:

```text
Pipe
 └── Validate data

Guard
 └── Authenticate / authorize

Controller
 └── Handle HTTP routing

Service
 └── Business logic

Repository
 └── Data access

Database
 └── Store data

```

That makes the application easier to **test, maintain, and change**.

**In one sentence:** the diagram shows how NestJS lets you break an HTTP request into specialized pieces, where each piece has **one main responsibility**.

---

Automatically Setting up Project

## NestJs CLI

### What is Nest CLI?

**Nest CLI = Nest Command Line Interface.**

It is a tool that helps us to **create, generate, run, and manage NestJS projects** from your terminal.

Think of it as a **helper tool (like a toolbox) for NestJS**.

```text
Nest CLI
   ↓
Create project
   ↓
Generate controller/service/module
   ↓
Build project
   ↓
Run project
```

As a frontend developer, you can think of it somewhat like **Angular CLI**: it generates the standard structure and files so you don't have to do everything manually

### 1. Install Nest CLI

```bash
npm i -g @nestjs/cli
```

`-g` means you install it **globally**, so you can use the `nest` command anywhere.

---

### 2. Create a new Nest project

```bash
nest new my-project
```

This automatically creates the basic project structure.

It creates things like:

```text
my-project/
├── src/
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
├── tsconfig.json
└── ...
```

### Important Files

Inside `src/`:

- `main.ts` → **Starts the application**
- `app.module.ts` → **Main/root module**
- `app.controller.ts` → Handles **HTTP requests/routes**
- `app.service.ts` → Contains **business logic**
- `app.controller.spec.ts` → **Tests** for the controller
  Instead of manually creating folders and configuration files, Nest CLI does it for you.

---

### 3. Generate files

This is one of the **most useful features** of Nest CLI.

For example:

```bash
nest generate controller users
```

or shorter:

```bash
nest g controller users
```

It creates a controller for you.

Similarly:

```bash
nest g service users
nest g module users
```

You can generate many Nest building blocks without manually creating files.

---

### 4. Run your application

You normally use npm scripts:

Normal start:

```bash
npm run start
```

Development mode (automatically reloads when you change code):

```bash
npm run start:dev
```

Then visit:

```text
http://localhost:3000
```

---

### 5. Check available commands

```bash
nest --help
```

You'll see commands such as:

```text
nest new
nest generate
nest build
nest start
nest info
```

### HTTP Platform

NestJS can work with:

- **Express** → default, popular and stable
- **Fastify** → focused on high performance

### Code Quality

NestJS projects come with:

- **Oxlint** → finds code problems
- **Prettier** → formats your code

Commands:

```bash
npm run lint
npm run format
```

### Nest Js Basic code example

```js
import { Controller, Module, Get } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

@Controller()
class AppController {
  @Get()
  getRootRoute() {
    return "hi there!";
  }
}

@Module({
  controllers: [AppController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}

bootstrap();
```

### code explanation:

This is basically the **smallest NestJS app** you can make.Now let's break it down from the very beginning.

## 1. Imports

```ts
import { Controller, Module, Get } from "@nestjs/common";
```

This imports some tools from NestJS.

- `Controller` → tells Nest that a class handles HTTP requests
- `Get` → tells Nest that a method handles a `GET` request
- `Module` → groups parts of your application together

Think of them as NestJS features you are bringing into your file.

Then:

```ts
import { NestFactory } from "@nestjs/core";
```

`NestFactory` is used to actually **create the NestJS application**.

You can think:

```text
NestFactory = machine that starts NestJS
```

---

# 2. `@Controller()`

```ts
@Controller()
class AppController {
```

Without:

```ts
@Controller()
```

this is just a normal JavaScript class:

```ts
class AppController {}
```

Nest wouldn't know what it is for.

But:

```ts
@Controller()
```

tells Nest:

> This class is a controller. It can receive HTTP requests.

So:

```text
@Controller()
     ↓
AppController
     ↓
handles HTTP requests
```

---

# 3. What is a controller?

A controller is basically a place where you define your API routes.

Example:

```ts
@Controller()
class AppController {}
```

Inside it, you can define things like:

```text
GET /
GET /users
POST /users
DELETE /users/123
```

Your controller is like the **front door of your backend**.

Requests arrive there.

---

# 4. `@Get()`

Inside the controller:

```ts
@Get()
getRootRoute() {
  return 'hi there!';
}
```

`@Get()` means:

> Run this method when someone sends a GET request.

Because you didn't give it any path:

```ts
@Get()
```

it means the root path:

```text
/
```

So this:

```ts
@Get()
getRootRoute() {
  return 'hi there!';
}
```

creates:

```http
GET /
```

---

# 5. What is `getRootRoute()`?

This:

```ts
getRootRoute() {
  return 'hi there!';
}
```

is just a normal class method.

The method name:

```ts
getRootRoute;
```

doesn't matter to Nest.

You could write:

```ts
@Get()
banana() {
  return 'hi there!';
}
```

and it would still handle:

```http
GET /
```

because Nest cares about:

```ts
@Get()
```

not the function name.

---

# 6. What does `return 'hi there!'` do?

```ts
return "hi there!";
```

Nest takes whatever you return and sends it back to the client.

So if the browser sends:

```http
GET /
```

Nest responds:

```text
hi there!
```

Flow:

```text
Browser
   ↓
GET /
   ↓
@Get()
   ↓
getRootRoute()
   ↓
return 'hi there!'
   ↓
Browser receives:
hi there!
```

---

# 7. The module

Now this part:

```ts
@Module({
  controllers: [AppController],
})
class AppModule {}
```

A NestJS module is basically a **container/group**.

It tells Nest:

> These things belong to this part of the application.

Here you're saying:

```ts
controllers: [AppController];
```

meaning:

> AppModule contains AppController.

Visualize it:

```text
AppModule
   │
   └── AppController
          │
          └── GET /
```

Without registering `AppController` inside the module, Nest doesn't know that it should use it.

---

# 8. Why is it `controllers` plural?

This is important.

Correct:

```ts
@Module({
  controllers: [AppController],
})
```

Not:

```ts
controller: [AppController];
```

because a module can have many controllers:

```ts
@Module({
  controllers: [
    AppController,
    UsersController,
    AuthController,
    ProductsController,
  ],
})
```

So Nest uses an array.

---

# 9. `class AppModule {}`

```ts
class AppModule {}
```

Looks empty, right?

That's because most of the important information is here:

```ts
@Module({
  controllers: [AppController],
})
```

The decorator gives Nest the metadata it needs.

So although the class looks empty:

```ts
class AppModule {}
```

Nest knows:

```text
AppModule
contains
AppController
```

because of the `@Module()` decorator.

---

# 10. `bootstrap()`

Now:

```ts
async function bootstrap() {
```

This is just a function that starts your application.

`bootstrap` isn't a special JavaScript keyword.

You could technically call it:

```ts
async function startApp() {}
```

But `bootstrap` is the common convention.

In programming, **bootstrap means starting and initializing the application**.

For your Nest app, the bootstrap process is basically:

```text
Start program
   ↓
Create NestJS app
   ↓
Load AppModule
   ↓
Find controllers/providers
   ↓
Register routes
   ↓
Start HTTP server
   ↓
Listen on port 3000
```

# 11. Creating the Nest application

```ts
const app = await NestFactory.create(AppModule);
```

This is one of the most important lines.

You're telling Nest:

> Create my application starting from `AppModule`.

Nest looks at:

```ts
AppModule;
```

Then sees:

```ts
@Module({
  controllers: [AppController],
})
```

Then discovers:

```text
AppController
```

Then sees:

```ts
@Get()
```

And registers:

```text
GET /
```

So this:

```ts
NestFactory.create(AppModule);
```

causes Nest to build the application structure.

---

# 12. Dependency graph starts from `AppModule`

You can think of `AppModule` as the root.

```text
NestFactory.create(AppModule)
              │
              ▼
          AppModule
              │
              ▼
       AppController
              │
              ▼
           GET /
```

In a larger app:

```text
AppModule
├── UsersModule
│   ├── UsersController
│   └── UsersService
│
├── AuthModule
│   ├── AuthController
│   └── AuthService
│
└── ProductsModule
    ├── ProductsController
    └── ProductsService
```

But your example only has one controller.

---

# 13. Why `await`?

```ts
const app = await NestFactory.create(AppModule);
```

Creating the application can involve asynchronous work.

So:

```ts
await;
```

means:

> Wait until Nest has finished creating the application before continuing.

Conceptually:

```text
create application
      ↓
wait...
      ↓
finished
      ↓
continue
```

---

# 14. `app.listen(3000)`

Then:

```ts
await app.listen(3000);
```

This tells your server:

> Listen for HTTP requests on port 3000.

So your application becomes available at:

```text
http://localhost:3000
```

If you visit:

```text
http://localhost:3000/
```

the browser sends:

```http
GET /
```

Nest finds:

```ts
@Get()
```

and executes:

```ts
getRootRoute();
```

which returns:

```text
hi there!
```

---

# 15. What does "listen" mean?

Think of the server as waiting by a phone.

```ts
app.listen(3000);
```

means:

```text
Server:
"I'm listening on port 3000.
If any request comes here, I'll handle it."
```

So:

```text
localhost:3000
          ↑
        port
```

Ports let multiple applications run on one computer.

For example:

```text
localhost:3000 → NestJS
localhost:5432 → PostgreSQL
localhost:5173 → React/Vite
```

---

# 16. Finally `bootstrap()`

At the bottom:

```ts
bootstrap();
```

This actually calls the function.

Without this:

```ts
bootstrap();
```

you only define:

```ts
async function bootstrap() {}
```

but never run it.

Example:

```ts
function hello() {
  console.log("hello");
}
```

This does nothing until:

```ts
hello();
```

Same thing here.

---

# Entire execution flow

When Node runs this file:

```text
1. Import NestJS tools
        ↓
2. Define AppController
        ↓
3. Decorators describe its routes
        ↓
4. Define AppModule
        ↓
5. Register AppController in AppModule
        ↓
6. Define bootstrap()
        ↓
7. Call bootstrap()
        ↓
8. NestFactory.create(AppModule)
        ↓
9. Nest builds the application
        ↓
10. app.listen(3000)
        ↓
11. Server waits for requests
```

Then you open:

```text
http://localhost:3000
```

Flow becomes:

```text
Browser
   │
   │ GET /
   ▼
localhost:3000
   │
   ▼
NestJS
   │
   │ finds matching route
   ▼
AppController
   │
   ▼
@Get()
   │
   ▼
getRootRoute()
   │
   ▼
return "hi there!"
   │
   ▼
NestJS
   │
   ▼
HTTP response
   │
   ▼
Browser

hi there!
```

## File Name convention

### Simple summary

- `main.ts` → starts the NestJS app
- `app.module.ts` → root module that connects app parts
- `app.controller.ts` → handles HTTP routes

### File naming convention

```text
name.type.ts
```

Examples:

```text
app.controller.ts
app.module.ts
users.service.ts
users.controller.ts
```

### Class naming convention

```ts
AppController;
AppModule;
UsersService;
UsersController;
```

So:

```text
app.controller.ts  → AppController
app.module.ts      → AppModule
users.service.ts   → UsersService
```

### Main rules

- Usually one main class per file
- File name should match the class purpose
- Class name should include what it is: `Controller`, `Service`, `Module`
- Filenames use lowercase with dots
- Classes use PascalCase
- `main.ts` is the special startup file with `bootstrap()`

### split that exact code into these 3 files:

### `app.controller.ts`

```ts
import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getRootRoute() {
    return "hi there!";
  }
}
```

### `app.module.ts`

```ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";

@Module({
  controllers: [AppController],
})
export class AppModule {}
```

### `main.ts`

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}

bootstrap();
```

### Simple flow

```text
main.ts
  ↓
AppModule
  ↓
AppController
  ↓
@Get()
  ↓
GET /
  ↓
"hi there!"
```

So:

- `main.ts` → starts the app
- `app.module.ts` → registers the controller
- `app.controller.ts` → handles the request
