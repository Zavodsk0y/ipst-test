## Pre-project setup

1. copy file `.env.example` rename to `.env`;
2. fill in your details
3. run migrations `npm run sql:migrate`
4. run project `npm run start:local`

## Working with the system

### file naming rules

- Interfaces starts with I: `IUser`
- Types ends with Type: `UserType`
- Used `camelCase` for naming

### file naming rules

Used `kebab-case` for files and dirs

### zod schemas naming rules

- actionEntityFastifySchema (insertUserFastifySchema)
- ActionEntityType (InsertUserType)
- IActionEntityFastifySchema (IInsertUserFastifySchema)
- body/params/querySchema

## scripts

```sh
"build": project build
"code-check": simulate build but without creating directory. Error checking only
"start:local": launch during local development
"sql:migrate": run migrations
"sql:codegen": generate TS types based on SQL tables
```
