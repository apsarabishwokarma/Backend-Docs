## 1 Messages

- GOAL -> store and retrieve the messages stored in a plain json file

Yes. I found the exact lesson. Your `p=8` is **“01. App Setup”**, about **7:43 long**, and it starts the section **Generating Projects with the Nest CLI**. ([Bilibili][1])

One limitation: Bilibili itself blocks direct playback fetching from my browser with a 412 error, but its indexed playlist plus the original Udemy course curriculum and matching course notes expose the lesson structure and content. So I could reconstruct the full lesson reliably. ([Udemy][2])

## P8 — App Setup

The main point of this video is:

> **Now that you understand the basic pieces of NestJS manually, we're going to build a more realistic Nest application using the Nest CLI.**

The new project is a simple **Messages API**.

### 1. What we're going to build

The application stores simple messages.

Conceptually:

```text
Messages API

GET  /messages
     ↓
Get all messages

GET  /messages/:id
     ↓
Get one message

POST /messages
     ↓
Create a message
```

The messages will initially be stored in a simple:

```text
messages.json
```

instead of a real database. This is intentional—the course wants you to understand Nest architecture first before introducing databases later. ([Udemy][2])

---

## 2. Architecture introduced in this video

The important diagram/concept is essentially:

```text
Incoming HTTP Request
        ↓
     Pipe
        ↓
   Controller
        ↓
    Service
        ↓
   Repository
        ↓
 messages.json
```

Each part has a different responsibility.

### Controller

Handles incoming HTTP requests.

```text
GET /messages
POST /messages
GET /messages/:id
       ↓
MessagesController
```

Think:

```text
Controller = HTTP / routing layer
```

It shouldn't contain all your application's logic.

---

### Service

Contains the application's main/business logic.

```text
Controller
    ↓
MessagesService
```

Example idea:

```ts
findAll();
findOne(id);
create(content);
```

Think:

```text
Service = business logic
```

---

### Repository

Handles data storage/access.

```text
MessagesService
      ↓
MessagesRepository
      ↓
messages.json
```

For this project:

```ts
readFile(...)
writeFile(...)
```

Later, a repository could communicate with PostgreSQL instead.

Think:

```text
Repository = data access
```

The matching notes for this exact course show the repository eventually reading and writing `messages.json`. ([Zenn][3])

---

## 3. Validation Pipe

The project will also introduce a **Pipe** before the controller.

```text
Request
  ↓
Validation Pipe
  ↓
Controller
```

Its job is to make sure incoming data is valid.

For example:

```json
{
  "content": "Hello"
}
```

is valid.

But something such as:

```json
{
  "content": 123
}
```

can later be rejected because `content` should be a string.

So remember:

```text
Pipe = validate/transform incoming request data
```

The course implements this with Nest's `ValidationPipe` and DTOs in the following lessons. ([Udemy][2])

---

# 4. Module

All these pieces belong to a Nest **module**:

```text
MessagesModule
│
├── MessagesController
├── MessagesService
└── MessagesRepository
```

Conceptually:

```ts
@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
})
export class MessagesModule {}
```

The module groups related functionality together.

So:

```text
Module = feature container
```

---

# 5. Nest CLI

Until now, the course deliberately created files manually so you could understand what Nest is doing.

From this section onward, the instructor starts using the **Nest CLI**.

Instead of manually creating everything:

```bash
nest new messages
```

can generate the base project structure for you. The following lessons then use commands such as:

```bash
nest generate module messages
```

and:

```bash
nest generate controller messages/messages --flat
```

The CLI can also automatically update related module files. ([Zenn][3])

---

# 6. Overall application design

This is the most important thing from the entire video:

```text
                 NestJS Messages App

HTTP Request
     │
     ▼
┌───────────────┐
│ Validation    │
│ Pipe          │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Controller    │
│ HTTP handling │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Service       │
│ Business logic│
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Repository    │
│ Data access   │
└───────┬───────┘
        │
        ▼
   messages.json
```

---

## Why not just do everything in Controller?

You technically could write:

```ts
@Controller("messages")
export class MessagesController {
  @Get()
  async getMessages() {
    // read JSON
    // parse JSON
    // business logic
    // return response
  }
}
```

But Nest encourages separation:

```text
Controller → handles HTTP
Service    → handles logic
Repository → handles storage
```

That separation becomes extremely important once applications grow.

---

# What you should remember from P8

```text
P8 = setup/planning of the first proper Nest application.
```

The five concepts introduced are:

```text
Module
  └── groups the feature

Controller
  └── handles HTTP requests

Pipe
  └── validates incoming data

Service
  └── contains business logic

Repository
  └── accesses/stores data
```

And the whole flow is:

```text
Request
  ↓
Pipe
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
messages.json
```

This lesson is mostly **architecture + project setup**. The actual implementation of these pieces is spread across the next several videos. The original course description confirms that this section builds the Messages app with a controller, service, repository, validation pipe, module, and JSON storage. ([Udemy][2])

I can also turn **P6 → P8** into one small cumulative NestJS note so your file conventions, routing decorators, and this architecture all connect together.

[1]: https://www.bilibili.com/video/BV1D9MezXExs/?utm_source=chatgpt.com "Udemy - NestJS The Complete Developer's Guide part1_哔哩哔哩_bilibili"
[2]: https://www.udemy.com/course/nestjs-the-complete-developers-guide/?utm_source=chatgpt.com "NestJS: The Complete Developer's Guide"
[3]: https://zenn.dev/em0/scraps/1bce574fa91007?utm_source=chatgpt.com "NestJS入門 メモ書き"
