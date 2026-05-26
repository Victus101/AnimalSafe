# API Rules

## Base Path

/api

## Public Endpoints

POST /api/auth/register  
POST /api/auth/login

## Protected Endpoints

All others require JWT Bearer token.

## Standards

- Use JSON
- Use HTTP status codes correctly
- Use DTOs
- Validate request body
- Return clear error messages

## Response Rules

200 OK  
201 Created  
400 Bad Request  
401 Unauthorized  
403 Forbidden  
404 Not Found  
500 Internal Server Error

## Naming

Plural resources:

/users  
/reports  
/images