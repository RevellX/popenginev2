# PopEngine

PopEngine is a backend service designed to organize daily delivery tasks and manage dispatchers’ shift assignments.  
It improves transparency of responsibilities across drivers + dispatch team, and provides a simple domain model for operational workflows.

## Why this exists

Delivery operations are chaos when responsibilities are unclear — this tries to fix that by:

- modeling daily tasks and shifts with very simple, explicit domain objects
- exposing small, focused REST endpoints
- making “who owns what today” obvious

## Features

- CRUD for daily delivery tasks
- Manage dispatcher shift assignments
- Track responsibility handoffs between dispatchers and drivers
- Opinionated / small API surface (simplicity > everything)

## Tech stack

| Layer       | Tech    |
| ----------- | ------- |
| Runtime     | Node.js |
| HTTP Server | Express |
| Persistence | MongoDB |

## API (high level)

| Area   | Example endpoints                          |
| ------ | ------------------------------------------ |
| Tasks  | `POST /tasks`, `GET /tasks?day=YYYY-MM-DD` |
| Shifts | `POST /shifts`, `GET /shifts/today`        |

(_actual routes may vary depending on your implementation_)

## Getting started (dev)

```bash
git clone https://github.com/<YOUR_USER>/popengine.git
cd popengine
npm install
npm run dev
```
