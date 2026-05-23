# DevPulse

DevPulse হলো একটি internal tech issue এবং feature tracker API, যা software team গুলোর জন্য তৈরি করা হয়েছে। এখানে contributor রা bug report অথবা feature request তৈরি করতে পারে এবং maintainer রা issue manage, workflow update এবং delete করতে পারে।

## Live URL

https://assignment-b7a2.onrender.com

## Features

- User signup এবং login সুবিধা
- JWT ভিত্তিক authentication system
- Contributor এবং Maintainer এর জন্য role-based authorization
- Bug report এবং feature request তৈরি করার সুবিধা
- Sorting এবং filtering সহ public issue list
- Single issue details দেখার সুবিধা
- Contributor নিজের open issue update করতে পারবে
- Maintainer issue update, status update এবং delete করতে পারবে
- PostgreSQL এবং native `pg` package ব্যবহার করে raw SQL implementation

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- pg
- bcrypt
- jsonwebtoken

## Setup

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=5000
CONNECTION_STRING=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

Run development server:

```bash
npm run dev
```

Build and start:

```bash
npm run build
npm start
```

## API Endpoints

### Auth

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh-token` | Public |

### Issues

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/issues` | Contributor, Maintainer |
| GET | `/api/issues` | Public |
| GET | `/api/issues/:id` | Public |
| PATCH | `/api/issues/:id` | Contributor own open issue, Maintainer any issue |
| DELETE | `/api/issues/:id` | Maintainer |

## Query Parameters

`GET /api/issues`

| Param | Values | Default |
| --- | --- | --- |
| `sort` | `newest`, `oldest` | `newest` |
| `type` | `bug`, `feature_request` | none |
| `status` | `open`, `in_progress`, `resolved` | none |

## Database Schema Summary

### users

- `id`
- `name`
- `email`
- `password`
- `role`
- `created_at`
- `updated_at`

### issues

- `id`
- `title`
- `description`
- `type`
- `status`
- `reporter_id`
- `created_at`
- `updated_at`
