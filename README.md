# Skullium

Skullium is a collection of three packages designed to facilitate the creation of Inertia React applications with Express backends and basic authentication.

## Getting started
To bootstrap a skullium application simply run 
```bash
npx @skullium/create
```

This will create a startapp project of Inertia React application with Express backend, basic authentication, and front-end design from Laravel Breeze.

## @skullium/core

[![Version](https://img.shields.io/npm/v/@skullium/core.svg)](https://www.npmjs.com/package/@skullium/core)
[![License](https://img.shields.io/npm/l/@skullium/core.svg)](https://github.com/@skullium/core/blob/main/LICENSE)

@skullium/core provides essential functionalities for building Inertia React applications with Express backends.

### Installation

```bash
npm install @skullium/core
```

### Usage
@skullium/core provides core functionalities and utilities.

### Exported Types and Classes

#### `express`, `RequestHandler`, `Application`, `Request`, `Response`, `NextFunction`

Types imported from the 'express' package, enabling robust handling of HTTP requests and responses.

#### `typeorm`, `BaseEntity`

Types imported from the 'typeorm' package, facilitating interactions with the database and defining base entity structures.

#### `Controller`

Class encapsulating route and middleware management, enhancing modularity and organization in applications.

#### `Model`

Base class for models, providing foundational attributes and methods for data models.

#### `EmailMessage`, `SmsMessage`

Classes for handling email and SMS messages, facilitating convenient message composition and sending.

#### `AuthModel`

Extended model for user authentication, providing functionalities related to user authentication and authorization.

#### `SkullError`, `ModelNotFound`, `NotFound`, `Unauthenticated`, `Unauthorized`

Error classes representing various scenarios, aiding in standardized error handling and response generation.

#### `Validate`

Decorator function for validating schemas, enabling easy integration of schema validation in methods and classes.

#### `ShorturlService`

Service for shortening URLs, providing functionalities to generate and resolve short URLs.

#### `session`, `database`

Functions and constants related to sessions and database access, easing session handling and database interactions.

#### `errorHandler`, `user`, `bootRoutes`

Functions for error handling, user authentication, and bootstrapping routes, enhancing application stability and security.


## @skullium/inertia
[![Version](https://img.shields.io/npm/v/@skullium/inertia.svg)](https://www.npmjs.com/package/@skullium/inertia)
[![License](https://img.shields.io/npm/l/@skullium/inertia.svg)](https://github.com/@skullium/core/blob/main/LICENSE)

@skullium/inertia extends @skullium/core to add Inertia-specific features for React applications.

### Installation
```bash
npm install @skullium/inertia
```

### Usage
@skullium/inertia provides functionalities tailored for Inertia React applications. Refer to the documentation for detailed usage instructions.

## @skullium/create
[![Version](https://img.shields.io/npm/v/@skullium/create.svg)](https://www.npmjs.com/package/@skullium/create)
[![License](https://img.shields.io/npm/l/@skullium/create.svg)](https://github.com/@skullium/core/blob/main/LICENSE)

Skullium/Create is a CLI command package that creates Inertia React applications with Express backend, basic authentication, and front-end design from Laravel Breeze. It utilizes Skullium/Core and Skullium/Inertia.

### Installation
```bash
npm install -g @skullium/create
```

### Usage
To create a new project:

```bash
@skullium/create
```

This will bootstrap an Inertia React application with Express backend, basic authentication, and front-end design from Laravel Breeze.

Make sure Node.js and npm are installed to use the skullium-create CLI.

```rust
For more detailed instructions, check the Skullium documentation coming soon.
```
