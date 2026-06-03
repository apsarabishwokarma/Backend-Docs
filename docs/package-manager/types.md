# Node.js Package Management for Beginners

When learning backend development, you'll frequently hear these terms:

- **Node.js**
- **NPM**
- **NVM**
- **Yarn**
- **PNPM**

Many beginners confuse them, but each has a different job.

---

# 1. What is Node.js?

**Node.js** allows JavaScript to run outside the browser.

Before Node.js:

```javascript
// JavaScript only ran in browsers
console.log("Hello");
```

After Node.js:

```bash
node app.js
```

JavaScript can now:

- Create servers
- Read files
- Connect databases
- Build APIs
- Create backend applications

Example:

```javascript
console.log("Hello from Node.js");
```

Run:

```bash
node app.js
```

Output:

```bash
Hello from Node.js
```

---

# 2. What is NPM?

**NPM = Node Package Manager**

NPM comes automatically when you install Node.js.

Think of NPM as an app store for Node.js.

Examples of packages:

| Package  | Purpose               |
| -------- | --------------------- |
| express  | Backend framework     |
| mongoose | MongoDB               |
| dotenv   | Environment variables |
| nodemon  | Auto restart server   |
| cors     | Enable CORS           |

---

## Check NPM Version

```bash
npm -v
```

Example:

```bash
10.8.2
```

---

## Initialize a Project

Create project:

```bash
mkdir my-app
cd my-app
```

Initialize:

```bash
npm init
```

or

```bash
npm init -y
```

This creates:

```json
{
  "name": "my-app",
  "version": "1.0.0"
}
```

---

## Install a Package

Install Express:

```bash
npm install express
```

Short form:

```bash
npm i express
```

NPM downloads Express into:

```text
node_modules/
```

---

## Install Multiple Packages

```bash
npm install express cors dotenv
```

---

## Install Dev Dependencies

Development-only packages:

```bash
npm install -D nodemon
```

or

```bash
npm i -D nodemon
```

Package.json:

```json
{
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

---

## Remove Package

```bash
npm uninstall express
```

---

## Update Package

```bash
npm update
```

---

## Run Scripts

Package.json:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Run:

```bash
npm run dev
```

or

```bash
npm start
```

---

# 3. What is NVM?

**NVM = Node Version Manager**

NVM helps manage multiple Node.js versions.

Why?

Different projects may require different Node versions.

Example:

Project A:

```text
Node 18
```

Project B:

```text
Node 22
```

Without NVM:

```text
Problem!
```

With NVM:

```text
Easy switching
```

---

## Install NVM

Linux/macOS:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
```

Reload terminal:

```bash
source ~/.bashrc
```

Check:

```bash
nvm --version
```

---

## Install Node Version

```bash
nvm install 22
```

Install another:

```bash
nvm install 20
```

---

## List Installed Versions

```bash
nvm ls
```

Example:

```text
-> v22.0.0
   v20.0.0
```

---

## Use Specific Version

```bash
nvm use 20
```

Switch:

```bash
nvm use 22
```

---

## Default Version

```bash
nvm alias default 22
```

---

## Check Current Version

```bash
node -v
```

Example:

```bash
v22.0.0
```

---

# 4. What is Yarn?

**Yarn** is another package manager.

Created by:

Meta

Purpose:

- Faster installs
- Better dependency management
- Alternative to NPM

---

## Install Yarn

Using npm:

```bash
npm install -g yarn
```

Check:

```bash
yarn -v
```

---

## Initialize Project

```bash
yarn init -y
```

---

## Install Package

```bash
yarn add express
```

Equivalent:

```bash
npm install express
```

---

## Install Dev Dependency

```bash
yarn add -D nodemon
```

Equivalent:

```bash
npm install -D nodemon
```

---

## Remove Package

```bash
yarn remove express
```

---

## Run Script

```bash
yarn dev
```

Equivalent:

```bash
npm run dev
```

---

# 5. What is PNPM?

**PNPM = Performant NPM**

Modern package manager focused on:

- Speed
- Disk space savings
- Monorepos

Many companies now prefer PNPM.

---

## Why PNPM is Fast?

NPM:

```text
Project A
 └── node_modules

Project B
 └── node_modules
```

Duplicates everything.

PNPM:

```text
Global Store
     ↓
Project A
Project B
```

Packages are shared.

Benefits:

- Less disk usage
- Faster installs

---

## Install PNPM

```bash
npm install -g pnpm
```

Check:

```bash
pnpm -v
```

---

## Initialize Project

```bash
pnpm init
```

---

## Install Package

```bash
pnpm add express
```

Equivalent:

```bash
npm install express
```

---

## Install Dev Dependency

```bash
pnpm add -D nodemon
```

---

## Remove Package

```bash
pnpm remove express
```

---

## Run Scripts

```bash
pnpm dev
```

Equivalent:

```bash
npm run dev
```

---

# Command Comparison

| Action         | NPM                     | Yarn                  | PNPM                  |
| -------------- | ----------------------- | --------------------- | --------------------- |
| Init           | `npm init -y`           | `yarn init -y`        | `pnpm init`           |
| Install        | `npm i express`         | `yarn add express`    | `pnpm add express`    |
| Dev Dependency | `npm i -D nodemon`      | `yarn add -D nodemon` | `pnpm add -D nodemon` |
| Remove         | `npm uninstall express` | `yarn remove express` | `pnpm remove express` |
| Run Script     | `npm run dev`           | `yarn dev`            | `pnpm dev`            |

---

# Real Backend Workflow

### Step 1

Install NVM

```bash
nvm install 22
nvm use 22
```

### Step 2

Create Project

```bash
mkdir backend-api
cd backend-api
```

### Step 3

Initialize Project

```bash
npm init -y
```

or

```bash
pnpm init
```

### Step 4

Install Express

```bash
npm install express
```

or

```bash
pnpm add express
```

### Step 5

Create Server

```javascript
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Backend");
});

app.listen(3000, () => {
  console.log("Server running");
});
```

### Step 6

Run Server

```bash
node server.js
```

Visit:

```text
http://localhost:3000
```

Output:

```text
Hello Backend
```

---

# What Should You Learn as a Beginner?

1. Learn **Node.js fundamentals** first.
2. Learn **NPM** because it comes with Node.js.
3. Learn **NVM** to manage Node versions.
4. Learn **PNPM** after you understand NPM.
5. Learn **Yarn** only if a project you're working on uses it.

### Recommended Order

```text
Node.js
   ↓
NPM
   ↓
Package.json
   ↓
Express.js
   ↓
NVM
   ↓
PNPM
   ↓
Yarn
```

For someone starting backend development today, **NVM + NPM + Express** is the best learning path. Once you're comfortable with those, moving to PNPM becomes very easy because the concepts are almost identical.

# NPM vs PNPM vs Yarn (Feature Comparison)

All three are **package managers** for Node.js projects. Their main job is to:

- Install packages
- Manage dependencies
- Run scripts
- Update packages
- Create lock files

The biggest differences are in **speed, disk usage, dependency management, and features**.

| Feature                    | NPM                                                                   | Yarn                                                            | PNPM                                                |
| -------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------- |
| Created By                 | [npm Inc. / GitHub npm](https://www.npmjs.com?utm_source=chatgpt.com) | [Meta Yarn Project](https://yarnpkg.com?utm_source=chatgpt.com) | [PNPM Team](https://pnpm.io?utm_source=chatgpt.com) |
| Default with Node.js       | ✅ Yes                                                                | ❌ No                                                           | ❌ No                                               |
| Easy for Beginners         | ⭐⭐⭐⭐⭐                                                            | ⭐⭐⭐⭐                                                        | ⭐⭐⭐⭐                                            |
| Installation Speed         | Good                                                                  | Fast                                                            | Very Fast                                           |
| Disk Space Usage           | High                                                                  | Medium                                                          | Very Low                                            |
| Monorepo Support           | Basic                                                                 | Excellent                                                       | Excellent                                           |
| Strict Dependency Checking | No                                                                    | Partial                                                         | Yes                                                 |
| Hoisting Issues            | More common                                                           | Less                                                            | Minimal                                             |
| Workspace Support          | Yes                                                                   | Yes                                                             | Yes                                                 |
| Lock File                  | package-lock.json                                                     | yarn.lock                                                       | pnpm-lock.yaml                                      |
| Popularity                 | Highest                                                               | High                                                            | Growing Fast                                        |
| Learning Curve             | Easiest                                                               | Easy                                                            | Slightly Higher                                     |

---

# 1. Package Storage

## NPM

Every project gets its own full copy:

```text
project-a
 └─ node_modules

project-b
 └─ node_modules
```

If Express is 5 MB:

```text
project-a = 5 MB
project-b = 5 MB

Total = 10 MB
```

---

## PNPM

Uses a global content-addressable store:

```text
Global Store
      │
      ├── express
      ├── lodash
      └── axios

project-a -> links
project-b -> links
```

Same package downloaded once.

```text
Total ≈ 5 MB
```

**Winner:** PNPM ✅

---

# 2. Installation Speed

## NPM

```bash
npm install
```

Downloads and copies packages.

---

## Yarn

Introduced faster installs before npm improved.

```bash
yarn install
```

Historically much faster than npm.

---

## PNPM

Uses hard links/symlinks.

```bash
pnpm install
```

Less copying = faster.

**Winner:** PNPM ✅

---

# 3. Dependency Resolution

Suppose:

```text
my-app
 └─ express
      └─ body-parser
```

You accidentally write:

```javascript
const bodyParser = require("body-parser");
```

without installing it.

---

## NPM

May still work because of flattened node_modules.

```text
node_modules
 ├─ express
 └─ body-parser
```

Can hide mistakes.

---

## PNPM

Fails immediately:

```text
Cannot find module body-parser
```

because you never installed it directly.

This catches bugs earlier.

**Winner:** PNPM ✅

---

# 4. Monorepo Support

Monorepo:

```text
apps/
  frontend

apps/
  backend

packages/
  shared
```

Used by large companies.

Examples:

- [Google Open Source](https://opensource.google?utm_source=chatgpt.com)
- [Microsoft Open Source](https://opensource.microsoft.com?utm_source=chatgpt.com)
- [Vercel](https://vercel.com?utm_source=chatgpt.com)

---

## NPM Workspaces

```json
{
  "workspaces": ["apps/*"]
}
```

Works but fewer advanced features.

---

## Yarn Workspaces

Very mature.

```json
{
  "workspaces": ["apps/*"]
}
```

Popular for years.

---

## PNPM Workspaces

Currently one of the most popular choices.

```yaml
packages:
  - "apps/*"
```

**Winner:** PNPM / Yarn ✅

---

# 5. Lock Files

Lock files ensure everyone installs the exact same versions.

---

## NPM

```text
package-lock.json
```

---

## Yarn

```text
yarn.lock
```

---

## PNPM

```text
pnpm-lock.yaml
```

All are good.

**Winner:** Tie ✅

---

# 6. Security

All support:

- Dependency audits
- Integrity checks
- Version locking

NPM:

```bash
npm audit
```

PNPM:

```bash
pnpm audit
```

Yarn:

```bash
yarn audit
```

**Winner:** Tie ✅

---

# 7. Workspace Commands

### NPM

```bash
npm run build --workspace=backend
```

---

### Yarn

```bash
yarn workspace backend build
```

---

### PNPM

```bash
pnpm --filter backend build
```

Many developers find PNPM filtering very powerful.

---

# 8. Zero Install Feature

A special Yarn feature.

Store dependencies in Git:

```text
.yarn/cache
```

New developer clones repo:

```bash
git clone
```

and can run immediately.

Rarely used in small projects.

**Winner:** Yarn ✅

---

# 9. Offline Installation

All support caching.

### NPM

```bash
npm install
```

uses cache when possible.

---

### Yarn

Very strong offline support.

---

### PNPM

Excellent offline support.

```bash
pnpm install --offline
```

**Winner:** Yarn / PNPM ✅

---

# 10. Community & Ecosystem

## NPM

Largest ecosystem.

Every Node developer knows it.

Every tutorial uses it.

Example:

```bash
npm install express
```

---

## Yarn

Very popular in React ecosystem.

---

## PNPM

Growing rapidly and widely adopted by modern projects.

Examples include projects from companies such as [Vercel](https://vercel.com?utm_source=chatgpt.com) and many modern open-source repositories.

**Winner:** NPM ✅

---

# Real-World Recommendation

## If You Are Learning Node.js

Use:

```bash
npm
```

Why?

- Comes with Node.js
- Every tutorial uses it
- No extra installation
- Simplest mental model

---

## If You Start New Professional Projects

Use:

```bash
pnpm
```

Why?

- Faster
- Uses less disk
- Better dependency management
- Excellent workspaces

---

## When Should You Use Yarn?

Use Yarn when:

- Existing project already uses Yarn
- Team standard is Yarn
- You specifically need Yarn features (e.g., Plug'n'Play or Zero-Install)

---

# Quick Summary

| Situation               | Best Choice |
| ----------------------- | ----------- |
| Learning Node.js        | NPM         |
| Beginner Backend Course | NPM         |
| Small Personal Project  | NPM or PNPM |
| Large Modern Project    | PNPM        |
| Monorepo                | PNPM        |
| Lowest Disk Usage       | PNPM        |
| Fastest Installs        | PNPM        |
| Existing Yarn Project   | Yarn        |
| Most Tutorials/Docs     | NPM         |

For a beginner in Express.js and backend development, a practical path is:

```text
NVM
 ↓
Node.js
 ↓
NPM
 ↓
package.json
 ↓
Express.js
 ↓
PNPM
 ↓
Yarn (optional)
```

That way you learn the standard tooling first, then the optimizations.

# NPM vs PNPM vs Yarn vs Bun vs Deno

First, an important distinction:

| Tool | Type                                           |
| ---- | ---------------------------------------------- |
| NPM  | Package Manager                                |
| Yarn | Package Manager                                |
| PNPM | Package Manager                                |
| Bun  | JavaScript Runtime + Package Manager + Bundler |
| Deno | JavaScript Runtime + Package Manager           |

So this comparison is not completely apples-to-apples.

A more accurate picture:

```text
Node.js Ecosystem
├── NPM
├── Yarn
└── PNPM

Alternative Runtimes
├── Bun
└── Deno
```

---

# What Each Tool Is

## Node.js + NPM

```text
Node Runtime
+
NPM Package Manager
```

Install:

```bash
node app.js
npm install express
```

Most common setup in the world.

---

## Yarn

Replacement for npm.

```bash
yarn add express
```

Still uses Node.js runtime.

---

## PNPM

Replacement for npm.

```bash
pnpm add express
```

Still uses Node.js runtime.

---

## Bun

Created by Oven

Provides:

```text
Runtime
Package Manager
Bundler
Test Runner
```

All-in-one.

```bash
bun install
bun run index.ts
```

No need for many separate tools.

---

## Deno

Created by Ryan Dahl

Interesting fact:

Ryan Dahl created Node.js and later built Deno to fix things he disliked about Node.

Provides:

```text
Runtime
Package Manager
Formatter
Linter
Test Runner
```

Built-in.

```bash
deno run main.ts
```

---

# Installation Speed

| Tool | Speed          |
| ---- | -------------- |
| NPM  | Good           |
| Yarn | Fast           |
| PNPM | Very Fast      |
| Bun  | Extremely Fast |
| Deno | Fast           |

Example:

```bash
npm install
```

vs

```bash
bun install
```

Bun is often dramatically faster because it's written in Zig and optimized for speed.

### Winner

🥇 Bun

🥈 PNPM

🥉 Yarn

---

# Disk Usage

| Tool | Disk Usage |
| ---- | ---------- |
| NPM  | High       |
| Yarn | Medium     |
| PNPM | Very Low   |
| Bun  | Low        |
| Deno | Low        |

PNPM's global store remains one of the best solutions.

### Winner

🥇 PNPM

🥈 Bun

---

# TypeScript Support

## NPM / Yarn / PNPM

Need Node.js.

Usually:

```bash
npm install typescript
```

Then:

```bash
tsc
```

Compile first.

---

## Bun

Runs TypeScript directly.

```bash
bun index.ts
```

---

## Deno

Runs TypeScript directly.

```bash
deno run main.ts
```

No compiler setup needed.

### Winner

🥇 Deno

🥈 Bun

---

# Security

## Node.js

By default:

```javascript
import fs from "fs";
```

Works immediately.

No permission checks.

---

## Deno

Must grant permissions.

```bash
deno run --allow-read app.ts
```

Without permission:

```text
Permission denied
```

Much safer.

### Winner

🥇 Deno

---

# NPM Package Compatibility

Node ecosystem has millions of packages.

Examples:

- Express
- React
- Mongoose
- Prisma

---

## Node + NPM

100% compatibility.

---

## PNPM

100% compatibility.

---

## Yarn

100% compatibility.

---

## Bun

Very high compatibility, but occasionally some packages may behave differently.

---

## Deno

Historically lower compatibility, though modern Deno can use npm packages much more easily than before.

### Winner

🥇 Node ecosystem (NPM/Yarn/PNPM)

---

# Built-in Tooling

## Node.js

Need separate tools:

```text
ESLint
Prettier
Jest
Webpack
Vite
ts-node
```

Many installations.

---

## Bun

Built-in:

```text
Runtime
Package Manager
Bundler
Test Runner
```

---

## Deno

Built-in:

```text
Runtime
Formatter
Linter
Package Manager
Test Runner
```

### Winner

🥇 Deno

🥈 Bun

---

# Learning Curve

| Tool | Difficulty |
| ---- | ---------- |
| NPM  | Easy       |
| Yarn | Easy       |
| PNPM | Easy       |
| Bun  | Medium     |
| Deno | Medium     |

Beginners find Node + NPM easiest because most tutorials use it.

---

# Job Market

Today, most backend jobs still expect:

```text
Node.js
NPM
Express
NestJS
```

Less commonly:

```text
Bun
Deno
```

### Winner

🥇 Node.js + NPM ecosystem

---

# Ecosystem Maturity

| Tool | Maturity  |
| ---- | --------- |
| NPM  | Excellent |
| Yarn | Excellent |
| PNPM | Excellent |
| Bun  | Good      |
| Deno | Good      |

Node.js has over a decade of ecosystem maturity.

---

# Feature Matrix

| Feature            | NPM        | Yarn       | PNPM       | Bun        | Deno       |
| ------------------ | ---------- | ---------- | ---------- | ---------- | ---------- |
| Package Manager    | ✅         | ✅         | ✅         | ✅         | ✅         |
| Runtime            | ❌         | ❌         | ❌         | ✅         | ✅         |
| TypeScript Native  | ❌         | ❌         | ❌         | ✅         | ✅         |
| Fast Install       | ⭐⭐       | ⭐⭐⭐     | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     |
| Low Disk Usage     | ⭐⭐       | ⭐⭐⭐     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   | ⭐⭐⭐     |
| Security Model     | ⭐⭐       | ⭐⭐       | ⭐⭐       | ⭐⭐       | ⭐⭐⭐⭐⭐ |
| Node Compatibility | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   | ⭐⭐⭐     |
| Job Demand         | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   | ⭐⭐⭐⭐   | ⭐⭐       | ⭐⭐       |
| Built-in Tooling   | ⭐⭐       | ⭐⭐       | ⭐⭐       | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ |

---

# What Should You Learn?

### If you're a beginner

```text
NVM
 ↓
Node.js
 ↓
NPM
 ↓
Express.js
 ↓
PNPM
```

This matches most tutorials, courses, and jobs.

---

### If you're building new side projects

```text
Node.js + PNPM
```

is a strong modern choice.

---

### If you enjoy trying cutting-edge tools

```text
Bun
```

You'll get:

- Fast startup
- Fast installs
- Built-in tooling
- Native TypeScript

---

### If you care most about security and simplicity

```text
Deno
```

You'll get:

- Permission-based security
- Native TypeScript
- Formatter, linter, and test runner included

---

# Current Industry Reality (2026)

For backend jobs, the most common stack is still:

```text
Node.js
+
NPM or PNPM
+
Express/NestJS
+
TypeScript
```

Bun is gaining adoption rapidly, and Deno has a dedicated user base, but if your goal is to become employable as a backend developer, Node.js remains the foundation to learn first.
