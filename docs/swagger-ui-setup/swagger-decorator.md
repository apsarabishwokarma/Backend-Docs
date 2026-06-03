# Swagger Decorators

## What Are Swagger Decorators?

Swagger decorators are annotations placed on classes, methods, or properties that describe an API.

- annotations means that they are special syntax that can be attached to code elements to provide metadata.
- annotations are used to generate OpenAPI documentation automatically.Instead of writing OpenAPI documentation manually:

```yaml
/users:
  get:
    summary: Get all users
```

you write:

```ts
@Get()
@ApiOperation({
  summary: 'Get all users'
})
```

The framework generates the OpenAPI specification automatically.

---

# How Swagger Decorators Work

```text
Decorators
      ↓
Metadata
      ↓
Swagger Generator
      ↓
OpenAPI JSON
      ↓
Swagger UI
```

Example:

```ts
@ApiTags("Users")
@Controller("users")
export class UserController {
  @Get()
  @ApiOperation({
    summary: "Get all users",
  })
  findAll() {}
}
```

Generates:

```yaml
/users:
  get:
    summary: Get all users
```

---

# Why Decorators Are Popular

Without decorators:

```js
router.get("/users", getUsers);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 */
```

Route definition and documentation are separate.

With decorators:

```ts
@Get()
@ApiOperation({
  summary: 'Get all users'
})
```

Route and documentation stay together.

---

# Common Swagger Decorators (NestJS)

## Controller-Level Decorators

### @ApiTags()

Groups endpoints.

```ts
@ApiTags('Users')
```

Swagger UI:

```text
Users
 ├── GET /users
 ├── POST /users
```

---

### @ApiExcludeController()

Hide controller from Swagger.

```ts
@ApiExcludeController()
```

---

# Route-Level Decorators

## @ApiOperation()

Provides summary and description.

```ts
@ApiOperation({
  summary: 'Get all users',
  description: 'Returns all users'
})
```

Equivalent OpenAPI:

```yaml
summary: Get all users
description: Returns all users
```

---

## @ApiResponse()

Generic response decorator.

```ts
@ApiResponse({
  status: 200,
  description: 'Success'
})
```

Equivalent:

```yaml
responses:
  200:
    description: Success
```

---

## @ApiOkResponse()

Shortcut for status 200.

```ts
@ApiOkResponse({
  description: 'Success'
})
```

Equivalent:

```yaml
responses:
  200:
```

---

## @ApiCreatedResponse()

Shortcut for 201.

```ts
@ApiCreatedResponse()
```

Equivalent:

```yaml
responses:
  201:
```

---

## @ApiBadRequestResponse()

Shortcut for 400.

```ts
@ApiBadRequestResponse()
```

Equivalent:

```yaml
responses:
  400:
```

---

## @ApiUnauthorizedResponse()

```ts
@ApiUnauthorizedResponse()
```

Equivalent:

```yaml
responses:
  401:
```

---

## @ApiForbiddenResponse()

```ts
@ApiForbiddenResponse()
```

Equivalent:

```yaml
responses:
  403:
```

---

## @ApiNotFoundResponse()

```ts
@ApiNotFoundResponse()
```

Equivalent:

```yaml
responses:
  404:
```

---

## @ApiConflictResponse()

```ts
@ApiConflictResponse()
```

Equivalent:

```yaml
responses:
  409:
```

---

## @ApiInternalServerErrorResponse()

```ts
@ApiInternalServerErrorResponse()
```

Equivalent:

```yaml
responses:
  500:
```

---

# Parameter Decorators

## @ApiParam()

Path parameters.

```ts
@ApiParam({
  name: 'id'
})
```

Equivalent:

```yaml
parameters:
  - in: path
```

Example:

```http
/users/123
```

---

## @ApiQuery()

Query parameters.

```ts
@ApiQuery({
  name: 'page'
})
```

Equivalent:

```yaml
parameters:
  - in: query
```

Example:

```http
/users?page=1
```

---

## @ApiHeader()

Header parameters.

```ts
@ApiHeader({
  name: 'Authorization'
})
```

Equivalent:

```yaml
parameters:
  - in: header
```

---

# Request Body Decorators

## @ApiBody()

Describes request body.

```ts
@ApiBody({
  type: CreateUserDto
})
```

Equivalent:

```yaml
requestBody:
```

---

# Schema Decorators

## @ApiProperty()

Defines DTO property.

```ts
class UserDto {
  @ApiProperty()
  name: string;
}
```

Equivalent:

```yaml
properties:
  name:
    type: string
```

---

## @ApiPropertyOptional()

Optional field.

```ts
@ApiPropertyOptional()
```

Equivalent:

```yaml
required: false
```

---

# Security Decorators

## @ApiBearerAuth()

JWT authentication.

```ts
@ApiBearerAuth()
```

Equivalent:

```yaml
security:
  - bearerAuth: []
```

---

## @ApiSecurity()

Custom security scheme.

```ts
@ApiSecurity('apiKey')
```

---

# File Upload Decorators

## @ApiConsumes()

Defines content type.

```ts
@ApiConsumes('multipart/form-data')
```

Equivalent:

```yaml
content:
  multipart/form-data:
```

---

# Visibility Decorators

## @ApiExcludeEndpoint()

Hide a route.

```ts
@ApiExcludeEndpoint()
```

---

# Why Express.js Doesn't Use Swagger Decorators

## Reason 1: Express Is Not Class-Based

Express:

```js
router.get("/users", handler);
```

NestJS:

```ts
@Controller("users")
class UserController {}
```

Decorators attach metadata to classes and methods.

Express routes are simple function calls.

---

## Reason 2: Express Doesn't Read Metadata

Decorators create metadata.

Something must read it.

NestJS contains:

```text
Decorator Reader
      ↓
Metadata Scanner
      ↓
Swagger Generator
```

Express contains none of these.

---

## Reason 3: Express Was Created Before Decorators

Express was released long before decorators became popular.

Its philosophy is:

```js
router.get();
router.post();
app.use();
```

Simple functions.

---

## Reason 4: Express Is Unopinionated

Express gives only routing and middleware.

It does not enforce:

- Controllers
- DTOs
- Metadata
- Decorators
- Dependency Injection

Frameworks like NestJS provide those features.

---

# How Swagger Is Usually Done in Express

## Option 1: JSDoc Comments

```js
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 */
```

Most common.

---

## Option 2: OpenAPI YAML

```yaml
paths:
  /users:
    get:
      summary: Get all users
```

Common in large projects.

---

## Option 3: OpenAPI JSON

```json
{
  "paths": {
    "/users": {
      "get": {}
    }
  }
}
```

---

# Express vs NestJS

## Express

```js
router.get("/users", getUsers);

/**
 * @swagger
 * ...
 */
```

Pros:

- Simple
- Lightweight
- Flexible

Cons:

- Documentation separate from code

---

## NestJS

```ts
@Get()
@ApiOperation({
  summary: 'Get all users'
})
```

Pros:

- Route and docs together
- Automatic OpenAPI generation
- Cleaner for large projects

Cons:

- More concepts to learn
- More framework complexity

---

# TypeScript + Express Decorators vs C# Attributes

## Can We Use Decorators in TypeScript + Express?

Yes.

TypeScript supports decorators.

Example:

```ts
function Log(target: any, propertyKey: string) {
  console.log(propertyKey);
}

class UserController {
  @Log
  getUsers() {}
}
```

The decorator runs when the class is processed.

---

## Does Express Support Decorators?

No.

Express itself only understands:

```ts
router.get("/users", handler);
router.post("/users", handler);
router.put("/users", handler);
router.delete("/users", handler);
```

Example:

```ts
router.get("/users", (req, res) => {
  res.send("Users");
});
```

Express does not know how to interpret:

```ts
@Controller("/users")
class UserController {
  @Get("/")
  getUsers() {}
}
```

because Express has no built-in decorator processing system.

---

# Why Decorators Alone Are Not Enough

Decorators only add metadata.

Something must read that metadata and convert it into:

```ts
router.get(...)
router.post(...)
```

Express does not provide:

- Metadata scanner
- Decorator processor
- Automatic route registration
- Swagger generation from decorators

---

# How Decorators Work in TypeScript Frameworks

Frameworks like NestJS provide:

```text
Decorators
      ↓
Metadata
      ↓
Framework Scanner
      ↓
Route Registration
      ↓
Swagger Generation
```

Example:

```ts
@Controller("users")
export class UserController {
  @Get()
  getUsers() {}
}
```

The framework automatically generates:

```ts
router.get("/users", getUsers);
```

behind the scenes.

---

# Libraries That Add Decorators to Express

Although Express itself does not support decorators, some libraries add this capability.

## NestJS

Most popular.

```ts
@Controller("users")
export class UserController {
  @Get()
  getUsers() {}
}
```

Can generate Swagger automatically.

---

## routing-controllers

Built around decorators.

```ts
@JsonController("/users")
export class UserController {
  @Get("/")
  getUsers() {}
}
```

Can work with Express.

---

## tsoa

Popular for Swagger generation.

```ts
@Route("users")
export class UserController {
  @Get()
  public async getUsers() {
    return [];
  }
}
```

Generates:

- Express routes
- OpenAPI specification
- Swagger documentation

---

# Can We Use Swagger Decorators in TypeScript + Express?

Not with plain Express.

This will not work automatically:

```ts
@ApiOperation({
  summary: "Get all users"
})
```

unless a framework/library exists to process it.

Examples:

- NestJS
- tsoa
- routing-controllers

These tools read decorator metadata and generate Swagger/OpenAPI.

---

# C# Equivalent: Attributes

In C#, decorators are called Attributes.

Example:

```csharp
[HttpGet]
public IActionResult GetUsers()
{
    return Ok();
}
```

Attributes are built into the language.

---

# ASP.NET Core Routing Attributes

## Route

```csharp
[Route("users")]
```

Defines base route.

---

## HttpGet

```csharp
[HttpGet]
```

Maps GET request.

---

## HttpPost

```csharp
[HttpPost]
```

Maps POST request.

---

## HttpPut

```csharp
[HttpPut]
```

Maps PUT request.

---

## HttpPatch

```csharp
[HttpPatch]
```

Maps PATCH request.

---

## HttpDelete

```csharp
[HttpDelete]
```

Maps DELETE request.

---

# Swagger Attributes in C#

## SwaggerOperation

```csharp
[SwaggerOperation(
    Summary = "Get all users"
)]
```

Equivalent OpenAPI:

```yaml
summary: Get all users
```

---

## ProducesResponseType

```csharp
[ProducesResponseType(200)]
```

Equivalent:

```yaml
responses:
  200:
```

---

## Produces

```csharp
[Produces("application/json")]
```

Equivalent:

```yaml
content:
  application/json:
```

---

## Consumes

```csharp
[Consumes("application/json")]
```

Equivalent:

```yaml
requestBody:
  content:
    application/json:
```

---

## FromBody

```csharp
public IActionResult Create(
    [FromBody] UserDto user
)
```

Reads request body.

---

## FromRoute

```csharp
public IActionResult Get(
    [FromRoute] string id
)
```

Reads route parameter.

---

## FromQuery

```csharp
public IActionResult Search(
    [FromQuery] int page
)
```

Reads query parameter.

---

# Why Decorators Feel More Natural in C#

ASP.NET Core was designed around attributes.

Architecture:

```text
Attributes
      ↓
Reflection
      ↓
Routing
      ↓
Swagger
```

Everything is integrated.

---

# Comparison

## Express.js

```ts
router.get("/users", getUsers);
```

Pros:

- Lightweight
- Flexible
- Simple

Cons:

- No built-in decorators
- No built-in Swagger generation

---

## TypeScript + Express + Libraries

```ts
@Get()
@ApiOperation(...)
```

Pros:

- Cleaner code
- Can generate Swagger

Cons:

- Requires extra libraries
- More setup

---

## ASP.NET Core

```csharp
[HttpGet]
[SwaggerOperation(
    Summary = "Get all users"
)]
```

Pros:

- Built-in attribute system
- Built-in metadata support
- Excellent Swagger integration

Cons:

- More framework conventions

---

# Final Summary

## Plain Express

```ts
router.get(...)
```

No decorator support.

---

## TypeScript + Express

```ts
@Get()
```

Possible only through additional frameworks/libraries.

Examples:

- NestJS
- routing-controllers
- tsoa

---

## C# ASP.NET Core

```csharp
[HttpGet]
```

Built into the framework.

Attributes are first-class citizens and integrate naturally with Swagger/OpenAPI generation.

For Node.js developers who want a C#-like experience with decorators and automatic Swagger generation, NestJS is usually the closest equivalent.

# Summary

Swagger decorators are popular because they keep API documentation close to the code.

They work well in frameworks such as NestJS because those frameworks:

1. Use classes and methods.
2. Store metadata from decorators.
3. Generate OpenAPI automatically.

Express.js does not provide a metadata system or decorator processing, so Swagger documentation is typically written using:

- JSDoc comments
- OpenAPI YAML files
- OpenAPI JSON files

instead of Swagger decorators.
