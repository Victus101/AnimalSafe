# AnimalSafe Security

## Authentication

JWT Bearer Token.

Header:

Authorization: Bearer <token>

## Passwords

Use BCrypt hashing.

## Roles

ROLE_USER  
ROLE_VOLUNTEER  
ROLE_ADMIN

## Public Routes

/api/auth/**

## Protected Routes

Everything else.

## Rules

Never expose password fields.

Never trust client role input.

Always validate token before protected access.

## Future Improvements

- Refresh tokens
- Rate limiting
- Email verification
- Account lockout