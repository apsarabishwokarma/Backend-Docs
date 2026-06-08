# Docker Basics for Backend Developers

## What Is Docker?

Docker is a platform that allows you to run applications inside isolated environments called containers.

Think of Docker as a lightweight virtual machine manager.

Example:

```text
Your Computer
│
├── Node.js Container
├── PostgreSQL Container
├── Redis Container
└── MongoDB Container
```

Each container has everything needed to run the application.

---

## What Is a Container?

A container is a running instance of an image.

```text
Image
  ↓
Container
```

Example:

```text
postgres:16 (Image)
      ↓
express_db (Container)
```

---

## Why Use Docker?

Without Docker:

```text
Install PostgreSQL
Install Redis
Install MongoDB
Configure Everything Manually
```

With Docker:

```bash
docker run postgres
docker run redis
docker run mongodb
```

Benefits:

- Easy setup
- Same environment for everyone
- Easy cleanup
- No dependency conflicts
- Great for development and deployment

---

## Docker Is NOT a Database

Incorrect:

```text
Docker = Database
```

Correct:

```text
Docker
 └── PostgreSQL
      └── Database
```

Docker only runs database software.

---

## Common Backend Architecture

```text
Express.js App
       │
       ▼
Prisma
       │
       ▼
PostgreSQL
       │
       ▼
Docker Container
```

---

## Docker Image vs Container

### Image

Blueprint/template.

Example:

```bash
postgres:16
```

### Container

Running instance of an image.

Example:

```bash
express_db
```

Relationship:

```text
Image
  ↓
Container
```

---

## Check Docker Installation

```bash
docker --version
```

Example:

```text
Docker version 28.x.x
```

---

## Check Running Containers

```bash
docker ps
```

---

## Check All Containers

```bash
docker ps -a
```

---

## Pull an Image

```bash
docker pull postgres:16
```

---

## Run PostgreSQL Container

```bash
docker run -d \
  --name express_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  postgres:16
```

---

## Stop a Container

```bash
docker stop express_db
```

---

## Start a Container

```bash
docker start express_db
```

---

## Remove a Container

```bash
docker rm express_db
```

---

## View Logs

```bash
docker logs express_db
```

---

## Enter a Running Container

```bash
docker exec -it express_db bash
```

For PostgreSQL:

```bash
docker exec -it express_db psql -U postgres -d mydb
```

---

## Docker Compose

Docker Compose manages multiple containers using a YAML file.

Example:

```yaml
services:
  postgres:
    image: postgres:16
```

Start:

```bash
docker compose up -d
```

Stop:

```bash
docker compose down
```

---

## Docker Volumes

Volumes persist data.

Without a volume:

```text
Delete Container
      ↓
Data Lost
```

With a volume:

```text
Delete Container
      ↓
Data Remains
```

Example:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

---

## Useful Commands

```bash
docker ps
docker ps -a
docker images
docker logs express_db
docker stop express_db
docker start express_db
docker rm express_db
docker compose up -d
docker compose down
```

---

## Docker + Prisma Workflow

```text
Docker
   ↓
PostgreSQL Container
   ↓
DATABASE_URL
   ↓
Prisma
   ↓
Express.js
```

Typical setup:

```bash
docker compose up -d

pnpm prisma migrate dev

pnpm prisma generate

pnpm dev
```

---

## Key Takeaways

- Docker is a container platform.
- Docker is not a database.
- PostgreSQL/MySQL run inside Docker containers.
- Containers are created from images.
- Volumes keep database data safe.
- Docker Compose manages multiple containers.
- Docker is commonly used with Express.js, Prisma, PostgreSQL, Redis, and MongoDB.
