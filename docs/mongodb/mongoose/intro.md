## Introduction to Mongoose

- Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.
- It allows us to define schemas, models, and perform CRUD operations more easily.

## To set up Mongoose in your Node.js project, follow these steps:

1. Install Mongoose using npm/pnpm:
   ```bash
   npm install mongoose
   or
   pnpm add mongoose
   ```
2. Import Mongoose in your application:

   ```javascript
   const mongoose = require("mongoose");
   ```

   or
   `javascript
import mongoose from 'mongoose';
`

3. Connect to your MongoDB database:
   ```javascript
   mongoose
     .connect("mongodb://localhost:27017/your-database-name", {
       useNewUrlParser: true,
       useUnifiedTopology: true,
     })
     .then(() => console.log("MongoDB connected"))
     .catch((err) => console.error("MongoDB connection error:", err));
   ```
4. Define a Mongoose schema and model:
   ```javascript
   const userSchema = new mongoose.Schema({
     name: String,
     email: String,
     password: String,
   });
   const User = mongoose.model("User", userSchema);
   ```
5. Perform CRUD operations using the model:
   `javascript
    // Create a new user
    const newUser = new User({ name: 'John Doe', email: 'john@example
.com', password: 'password123' });
    newUser.save()
      .then(user => console.log('User created:', user))
      .catch(err => console.error('Error creating user:', err));  
    `
   ```javascript
   // Find users
   User.find()
     .then((users) => console.log("Users found:", users))
     .catch((err) => console.error("Error finding users:", err));
   ```

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({}); // Define your schema fields here

export const User = mongoose.model("User", userSchema); // Export the model  it takes two arguments: the name of the model and the schema to use for that model
```

### Note on Collection Names

- Even my model name is `User`, the collection name in MongoDB will be `users` (lowercase and pluralized).
- Mongoose automatically pluralizes the model name to determine the collection name.
- If you want to specify a custom collection name, you can pass it as the third argument to the `mongoose.model` function:
  ```javascript
  export const User = mongoose.model(
    "User",
    userSchema,
    "customCollectionName",
  );
  ```
- In this example, the collection name will be `customCollectionName` instead of the default `users`.
- This allows you to have more control over the naming of your collections in MongoDB while still using Mongoose for schema definition and data modeling.

```js
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "User name should be unique"],
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true },
);
```

- In this example, we have defined a `userSchema` with three fields: `username`, `email`, and `password`.
- Each field has specific properties:
  - `type`: Specifies the data type of the field (e.g., String).
  - `required`: Indicates that the field is required and provides a custom error message if it is missing.
  - `unique`: Ensures that the value of the field is unique across all documents in the collection.
  - `lowercase`: Converts the value to lowercase before saving it to the database.
- This schema will help ensure that the data stored in the MongoDB collection adheres to the defined structure and validation rules, making it easier to manage and query the data effectively.

## timestamps in mongoose schema

- This automatically add `createdAt` and `updatedAt` fields to our documents,
- which will store the date and time when the document was created and last updated, respectively.
- This can be useful for tracking when records were created and modified without having to manually manage these fields in your application code.

```js
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    subTodos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubTodo",
      },
    ],
    // Array of sub-todos
  },
  {
    timestamps: true,
  },
);

export const Todo = mongoose.Model("TODO", todoSchema);
```

- In this example, we have defined a `todoSchema` with fields for `content`, `complete`, `createdBy`, and `subTodos`.
- type: mongoose.Schema.Types.ObjectId is used to define a reference to another document in MongoDB. It allows us to establish relationships between different collections.
- 'ref' is used to specify the name of the model that the ObjectId refers to. In this case, `createdBy` references the `User` model, and `subTodos` references the `SubTodo` model. This is our model name
- The `createdBy` field is a reference to a `User` document, allowing us to establish a relationship between the `Todo` and `User` collections.
- The `subTodos` field is an array of references to `SubTodo` documents, enabling us to associate multiple sub-todos with a single todo item.
- By using `timestamps: true`, we ensure that each todo document will automatically have `createdAt` and `updatedAt` fields to track when the todo was created and last updated. This can be helpful for managing and organizing our todo items effectively.
