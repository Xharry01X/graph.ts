## What is SurrealDB?

- Modern database combining SQL + NoSQL
- Structured data like traditional databases
- Flexible data like document databases
- All in one database

---

## 1. Basic Setup

- Create namespace (container for data)
- Create database inside namespace
- Start working with data

```sql
CREATE NAMESPACE my_app;
USE NAMESPACE my_app;
CREATE DATABASE mydb;
USE DATABASE mydb;
```

---

## 2. Creating Tables and Data

### Create a Table

- Tables store your data
- Like spreadsheets with rows and columns
- No need to define columns first

```sql
CREATE TABLE users;
```

### Insert Data (CREATE Records)

- Add data directly to table
- Each record gets unique ID automatically

```sql
CREATE users SET 
  name = 'Alice',
  email = 'alice@example.com',
  age = 30;

CREATE users SET 
  name = 'Bob',
  email = 'bob@example.com',
  age = 25;
```

- Records get IDs: `users:001`, `users:002`, etc.

---

## 3. Reading Data (SELECT)

### Get All Records

```sql
SELECT * FROM users;
```

### Get Specific Columns

```sql
SELECT name, email FROM users;
```

### Filter with WHERE

```sql
SELECT * FROM users WHERE age > 25;
```

### Filter Examples

```sql
SELECT * FROM users WHERE name = 'Alice';
SELECT * FROM users WHERE age >= 30;
SELECT * FROM users WHERE email CONTAINS '@gmail.com';
```

---

## 4. Updating Data (UPDATE)

- Change existing data
- Use WHERE to target specific records

```sql
UPDATE users SET age = 31 WHERE name = 'Alice';
```

### Update Multiple Fields

```sql
UPDATE users SET 
  age = 26,
  email = 'newemail@example.com' 
WHERE name = 'Bob';
```

---

## 5. Deleting Data (DELETE)

- Remove records permanently
- Always use WHERE unless you want to delete all

```sql
DELETE FROM users WHERE name = 'Bob';
```

### Delete All Records

```sql
DELETE FROM users;
```

---

## 6. Record IDs

- Each record has unique ID
- Use ID to work with specific records

### Get Record with Specific ID

```sql
SELECT * FROM users:001;
```

### Update Using ID

```sql
UPDATE users:001 SET age = 32;
```

### Delete Using ID

```sql
DELETE users:001;
```

---

## 7. Comparison Operators

### Equal

```sql
SELECT * FROM users WHERE age = 30;
```

### Not Equal

```sql
SELECT * FROM users WHERE age != 25;
```

### Greater Than / Less Than

```sql
SELECT * FROM users WHERE age > 25;
SELECT * FROM users WHERE age < 30;
```

### Greater or Equal / Less or Equal

```sql
SELECT * FROM users WHERE age >= 30;
SELECT * FROM users WHERE age <= 25;
```

---

## 8. Logical Operators

### AND (Both conditions must be true)

```sql
SELECT * FROM users WHERE age > 25 AND name = 'Alice';
```

### OR (At least one condition must be true)

```sql
SELECT * FROM users WHERE age > 30 OR email CONTAINS '@gmail.com';
```

### NOT (Opposite of condition)

```sql
SELECT * FROM users WHERE NOT age = 25;
```

---

## 9. Sorting Results (ORDER BY)

### Sort Ascending (smallest to largest)

```sql
SELECT * FROM users ORDER BY age ASC;
```

### Sort Descending (largest to smallest)

```sql
SELECT * FROM users ORDER BY age DESC;
```

### Sort by Name Alphabetically

```sql
SELECT * FROM users ORDER BY name ASC;
```

---

## 10. Limiting Results (LIMIT)

### Get First 5 Records

```sql
SELECT * FROM users LIMIT 5;
```

### Get 10 Records Starting from Position 0

```sql
SELECT * FROM users LIMIT 10 START 0;
```

---

## 11. Counting Records (COUNT)

### Count All Records

```sql
SELECT COUNT() as total FROM users;
```

### Count with Condition

```sql
SELECT COUNT() as total FROM users WHERE age > 25;
```

---

## 12. Working with Dates and Times

### Create Record with Timestamp

```sql
CREATE posts SET 
  title = 'My First Post',
  content = 'Hello World',
  created_at = time::now();
```

### Query by Date

```sql
SELECT * FROM posts WHERE created_at > '2024-01-01';
```

---

## 13. Arrays and Objects

### Create Record with Array

```sql
CREATE users SET 
  name = 'Charlie',
  tags = ['admin', 'user', 'moderator'];
```

### Create Record with Object

```sql
CREATE users SET 
  name = 'David',
  profile = {
    bio: 'Hello',
    location: 'New York'
  };
```

### Access Specific Field from Object

```sql
SELECT name, profile.location FROM users;
```

### Filter Using Array Contains

```sql
SELECT * FROM users WHERE 'admin' IN tags;
```

---

## 14. Complete Practical Example

```sql
-- Create table
CREATE TABLE products;

-- Add products
CREATE products SET 
  name = 'Laptop',
  price = 1000,
  stock = 5;

CREATE products SET 
  name = 'Mouse',
  price = 25,
  stock = 50;

-- View all products
SELECT * FROM products;

-- Find expensive items
SELECT * FROM products WHERE price > 100;

-- Update stock
UPDATE products SET stock = 10 WHERE name = 'Mouse';

-- Delete a product
DELETE FROM products WHERE name = 'Laptop';

-- Count remaining products
SELECT COUNT() as total FROM products;
```

---

## 15. Common Mistakes

- Forgetting WHERE clause deletes everything: `DELETE FROM users;`
- Wrong syntax with CREATE and UPDATE
- Using wrong operators: `=` for equals, `!=` for not equal
- Case sensitivity in table and field names

---

## Quick Reference Summary

| Action | Command |
|--------|---------|
| Create record | `CREATE table SET field = value;` |
| Read all | `SELECT * FROM table;` |
| Read with filter | `SELECT * FROM table WHERE condition;` |
| Update | `UPDATE table SET field = value WHERE condition;` |
| Delete | `DELETE FROM table WHERE condition;` |
| Count | `SELECT COUNT() as total FROM table;` |
| Sort | `SELECT * FROM table ORDER BY field ASC/DESC;` |
| Limit | `SELECT * FROM table LIMIT 10;` |

---

---

## 16. Working with Multiple Tables & Foreign Keys

### What is a Foreign Key?

- Link between two tables
- Store ID from one table in another table
- Connect related data without repetition

### Example: Users and Posts

**Table 1: Users**
```sql
CREATE users SET 
  name = 'Alice',
  email = 'alice@example.com';
```

**Table 2: Posts (with foreign key)**
```sql
CREATE posts SET 
  title = 'My First Post',
  content = 'Hello World',
  user_id = 'users:001';
```

- `user_id` is the foreign key
- It points to a user record

### Query Data from Multiple Tables

**Find all posts by Alice:**
```sql
SELECT * FROM posts WHERE user_id = 'users:001';
```

**Get posts with user details:**
```sql
SELECT posts.*, users.name FROM posts 
WHERE posts.user_id = users.id;
```

### Why Use Foreign Keys?

- Avoid repeating user data in every post
- Update user info once, affects all posts
- Keep data clean and organized
- Find related data easily

### Example Workflow

```sql
-- Create users table
CREATE TABLE users;

-- Create posts table
CREATE TABLE posts;

-- Add users
CREATE users SET name = 'Alice', email = 'alice@example.com';
CREATE users SET name = 'Bob', email = 'bob@example.com';

-- Add posts with foreign keys
CREATE posts SET 
  title = 'Post 1',
  user_id = 'users:001';

CREATE posts SET 
  title = 'Post 2',
  user_id = 'users:002';

-- Get all posts
SELECT * FROM posts;

-- Get posts by user ID
SELECT * FROM posts WHERE user_id = 'users:001';

-- Update user info (affects nothing, data stays clean)
UPDATE users:001 SET name = 'Alice Smith';
```

### Should You Use One Table or Two?

**Use Two Tables if:**
- Data repeats (users in multiple posts)
- You need to update data in one place
- Tables have different information types
- Professional/large project

**Use One Table if:**
- Very simple project
- Only a few records
- Data doesn't repeat
- Quick prototype/learning

### Common Mistake: Putting Everything in One Table

**Bad - Lots of Repetition:**
```sql
CREATE all_data SET 
  user_name = 'Alice',
  user_email = 'alice@example.com',
  post_title = 'Post 1',
  post_date = '2024-01-01';

CREATE all_data SET 
  user_name = 'Alice',
  user_email = 'alice@example.com',
  post_title = 'Post 2',
  post_date = '2024-01-02';
```

- Alice's info repeated twice
- If email changes, update both rows
- Wastes storage space
- Hard to query

**Good - Separate Tables:**
```sql
-- Users table
CREATE users SET name = 'Alice', email = 'alice@example.com';

-- Posts table (just references user)
CREATE posts SET title = 'Post 1', user_id = 'users:001';
CREATE posts SET title = 'Post 2', user_id = 'users:001';
```

- Alice's info stored once
- Update email one place, all posts stay connected
- Saves space
- Easy to query

---

## Key Points to Remember

- Namespaces organize data
- Tables store records
- Each record has auto-generated unique ID
- Always use WHERE except when you want all records
- CREATE for new records
- SELECT for reading
- UPDATE for changing
- DELETE for removing
- Operators: `=`, `!=`, `>`, `<`, `>=`, `<=`
- Logical: `AND`, `OR`, `NOT`
- Foreign keys connect tables and avoid repetition
- Use separate tables for organized, professional projects