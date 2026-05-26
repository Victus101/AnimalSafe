# AnimalSafe Database

## Engine

MySQL 8+

## Entities

### User

- id
- name
- email
- password
- role
- createdAt
- updatedAt

### Report

- id
- title
- description
- status
- createdAt
- updatedAt
- resolvedAt
- user_id

### Salvita

Animal data linked to report.

- id
- type
- condition
- description
- report_id

### Location

- id
- latitude
- longitude
- address
- report_id

### Image

- id
- url
- fileName
- uploadedAt
- report_id

## Relationships

User 1:N Reports  
Report 1:1 Salvita  
Report 1:1 Location  
Report 1:N Images