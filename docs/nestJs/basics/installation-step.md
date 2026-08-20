In Express, you **do have an equivalent**, it’s just much simpler.

NestJS:

```ts
const app = await NestFactory.create(AppModule);
```

Express:

```ts
import express from "express";

const app = express();
```

So:

```text
NestJS                         Express
────────────────────────────────────────
NestFactory.create(...)   ≈    express()
```

The difference is that NestJS has a lot more framework structure to initialize.

In Express:

```ts
const app = express();
```

just creates an Express application object.

Then you manually add routes:

```ts
app.get("/", (req, res) => {
  res.send("hi there!");
});

app.listen(3000);
```

Full Express version:

```ts
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("hi there!");
});

app.listen(3000);
```

NestJS equivalent:

```ts
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

The reason Nest needs:

```ts
NestFactory.create(AppModule);
```

is that Nest has to initialize many things:

```text
AppModule
   ↓
find controllers
   ↓
find services/providers
   ↓
create dependency injection container
   ↓
read decorators/metadata
   ↓
register routes
   ↓
create underlying Express/Fastify app
   ↓
return Nest application
```

Express doesn't have:

```text
Modules
Controllers
Providers
Dependency Injection container
@Get()
@Controller()
@Injectable()
```

So it doesn't need that complicated bootstrap process.

Express basically says:

```ts
const app = express();
```

> "Give me an HTTP application. I'll configure everything myself."

Nest says:

```ts
const app = await NestFactory.create(AppModule);
```

> "Here is my root module. Inspect my whole application structure and build the application for me."

One more important point: by default, Nest actually uses **Express underneath**.

Roughly:

```text
NestFactory.create(AppModule)
        ↓
Nest builds DI/modules/controllers
        ↓
creates Express application internally
        ↓
registers your routes on Express
        ↓
HTTP server
```

So mentally:

```ts
// Express
const app = express();
```

is the simple version.

```ts
// NestJS
const app = await NestFactory.create(AppModule);
```

is the structured/framework version.

And both eventually do:

```ts
app.listen(3000);
```

to start listening for HTTP requests.
