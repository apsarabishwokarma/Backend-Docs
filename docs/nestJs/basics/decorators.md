## Decorator

In JavaScript, a decorator is a design pattern used to modify or extend the behavior of a class, method, getter, setter, or field without directly altering its original source code.

## Decorator in nest js

In NestJS, a **decorator is a special function that adds metadata/meaning to a class, method, parameter, or property**.

Think of it as a label for Nest:

```ts
@Controller('users')
```

means:

> “Nest, treat this class as a controller for `/users`.”

## Simple example

```ts
import { Controller, Get } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get()
  findAll() {
    return ["A", "B"];
  }
}
```

Nest reads this as:

```text
@Controller('users')
        ↓
this class handles /users

@Get()
        ↓
this method handles GET requests
```

So:

```http
GET /users
```

runs:

```ts
findAll();
```

---

## Decorators start with `@`

Examples:

```ts
@Controller()
@Get()
@Post()
@Body()
@Param()
@Injectable()
@Module()
```

The `@` tells TypeScript:

```text
"This is a decorator."
```

---

## Where decorators can be used

### 1. Class decorator

```ts
@Controller("users")
export class UsersController {}
```

`@Controller()` decorates the **class**.

Another example:

```ts
@Injectable()
export class UsersService {}
```

---

### 2. Method decorator

```ts
@Get()
findAll() {}
```

`@Get()` decorates the method.

```ts
@Post()
create() {}
```

---

### 3. Parameter decorator

```ts
@Get(':id')
findOne(@Param('id') id: string) {}
```

Here:

```ts
@Param('id')
```

decorates the `id` parameter.

For:

```http
GET /users/123
```

Nest gives:

```ts
id === "123";
```

Another example:

```ts
@Post()
create(@Body() body: CreateUserDto) {}
```

`@Body()` tells Nest:

> Get this parameter's value from the HTTP request body.

---

## What does "adds metadata" mean?

Without decorators:

```ts
class UsersController {
  findAll() {}
}
```

Nest only sees a normal class.

It doesn't know:

```text
Is this a controller?
What URL?
Is findAll() GET?
POST?
DELETE?
```

Now add:

```ts
@Controller("users")
class UsersController {
  @Get()
  findAll() {}
}
```

The decorators effectively give Nest extra information:

```text
UsersController
    type: controller
    path: /users

findAll
    HTTP method: GET
```

That extra information is called **metadata**.

---

## Another example

```ts
@Controller("users")
export class UsersController {
  @Get(":id")
  findOne(@Param("id") id: string) {
    return id;
  }
}
```

Breakdown:

```text
@Controller('users')
        ↓
base path = /users

@Get(':id')
        ↓
GET /users/:id

@Param('id')
        ↓
take "id" from URL
```

Request:

```http
GET /users/55
```

Nest does conceptually:

```ts
findOne("55");
```

---

## `@Module()` is also a decorator

```ts
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

`@Module()` tells Nest:

```text
This class is a Nest module.

It contains:
- UsersController
- UsersService
```

---

## `@Injectable()` is also a decorator

```ts
@Injectable()
export class UsersService {}
```

It tells Nest:

> This class can be managed by Nest's dependency injection system.

Then Nest can inject it:

```ts
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
```

---

## Easiest mental model

```text
Normal TypeScript thing
        +
Decorator
        ↓
Nest understands what that thing is
```

Example:

```ts
class AppController {}
```

just means:

```text
normal class
```

But:

```ts
@Controller()
class AppController {}
```

means:

```text
normal class
+
metadata saying "controller"
```

So remember:

> **A decorator doesn't usually contain your main business logic. It tells Nest how a class/method/parameter should behave or be treated.**

```text
@Controller() → this is a controller
@Get()        → this is a GET route
@Post()       → this is a POST route
@Body()       → get value from request body
@Param()      → get value from URL parameter
@Module()     → this is a module
@Injectable() → Nest can inject/manage this class
```
