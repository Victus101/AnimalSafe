# AnimalSafe Architecture

## Backend Stack

- Java 17
- Spring Boot 3.x
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- MySQL
- Maven

## Package Structure

src/main/java/com/animalsafe20/animalsafe/

controller/
service/
repository/
model/
dto/
security/
config/
exception/
util/

## Layer Responsibilities

### Controllers

- Expose REST endpoints
- Validate requests
- Return ResponseEntity
- Call Services only

### Services

- Business logic
- Coordinate repositories
- Transactions

### Repositories

- Extend JpaRepository
- Database access only

### DTOs

- Request/Response contracts
- Never expose entities directly

### Entities

- JPA Models
- Relationships
- Persistence only

## Core Principles

- Clean Architecture
- Separation of Concerns
- Stateless Auth
- Reusable Services
- Mobile-first API design