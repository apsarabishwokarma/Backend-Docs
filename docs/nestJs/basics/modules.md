## Modules

When someone says:

"Every application we create must have one module inside of it."

they mean:

Every NestJS application needs a main/root module that tells NestJS how the application is organized.
##NestFactory.create(AppModule) can we not directly pass controller here without creating module?

`NestFactory.create()` expects a **root module**, not a controller.

```ts
NestFactory.create(AppModule);
```

The module then tells Nest which controllers and providers belong to the app:

```ts
@Module({
  controllers: [AppController],
})
class AppModule {}
```

So the flow is:

```text
NestFactory.create(AppModule)
        ↓
Nest loads AppModule
        ↓
AppModule says:
"Use AppController"
        ↓
Nest creates AppController
        ↓
Nest registers its routes
```

If you tried:

```ts
NestFactory.create(AppController);
```

Nest would treat `AppController` like the root application module, which is not how a controller is meant to be used.

The reason Nest forces this structure is that a real app usually has more than controllers:

```text
AppModule
├── Controllers
├── Services
├── Other Modules
├── Database providers
├── Guards
└── Interceptors
```

So the module is basically the **entry container** of the application.

Think of it like this:

```text
AppModule = box containing app pieces

NestFactory.create(AppModule)
= "Start Nest using everything inside this box"
```

For your tiny example it feels unnecessary:

```ts
@Module({
  controllers: [AppController],
})
class AppModule {}
```

But once the app grows, it becomes useful:

```ts
@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}
```

So simplest mental model:

```text
Controller = handles requests
Module = organizes/registers app parts
NestFactory = starts the app from the root module
```
