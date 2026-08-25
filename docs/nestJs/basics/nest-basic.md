### What is NestJS?

NestJS is a Node.js framework for building backend APIs — like Express, but way more structured — for creating efficient, scalable server-side applications. It uses progressive JavaScript, is built with and fully supports TypeScript (while still allowing pure JavaScript),and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

Think of it as "Express + Angular's architecture philosophy" — it gives us:

- TypeScript by default — catches bugs before runtime
- Modular architecture — your app is split into Modules, Controllers, and Services (also called "providers")
- Dependency Injection (DI) — built-in, so your code stays testable and decoupled
- Decorators — @Controller(), @Injectable(), @Get() etc. define behavior declaratively

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
