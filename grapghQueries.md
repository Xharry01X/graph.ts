## Nodes and Edges

```
(Person) --[bought]--> (Product)
```

**Node** = Entities (the "things" in your system like users, products, companies)
**Edge** = Relationships between nodes (the connections like "bought", "follows", "owns")

## What is RELATE?

RELATE is a SurrealDB statement that creates a relationship (edge) between two nodes. It establishes connections that form the backbone of graph queries.

### SQL Analogy

In relational databases, you use JOIN or foreign keys to connect data across tables:
```sql
SELECT * FROM people 
JOIN purchases ON people.id = purchases.person_id 
JOIN products ON purchases.product_id = products.id;
```

In SurrealDB's graph model, you use RELATE to explicitly model these relationships as first-class citizens:

```sql
RELATE person:harry -> bought -> product:iphone;
```

This creates a new edge record in a table named `bought` with:
- **in** = `person:harry` (the source node)
- **id** = a unique identifier for this relationship
- **out** = `product:iphone` (the target node)

This forms what's called a **semantic triple**:
```
in → id → out
```
Or in natural language: **noun → verb → noun**

## What are `in` and `out`?

These are automatically generated fields that SurrealDB creates on every edge table. They store the direction of the relationship:

- **in** = the starting node of the relationship (where the arrow originates)
- **out** = the target node the edge points to (where the arrow points)

Think of them as directional pointers:

```
(in) person:harshit ──[bought]──> (out) product:iphone
```

This directional structure enables SurrealDB to support efficient graph traversal queries.

## What is `->` (Traversal Operator)?

The arrow `->` is SurrealDB's traversal operator. It means "follow this relationship forward."

```sql
SELECT ->bought->product FROM person:harshit;
```

This query reads as: "Starting from person:harshit, traverse the bought edge to reach the connected product records."

**Breaking it down:**
- `->bought` = traverse the bought edge forward (following the out direction)
- `->product` = continue to product records connected via that edge
- The `*` after would fetch all fields: `SELECT ->bought->product.* FROM person:harshit;`

### Reverse Traversal with `<-`

You can also traverse edges in reverse using `<-`:

```sql
SELECT <-bought<-person FROM product:iphone;
```

This reads as: "Starting from product:iphone, traverse backward to find people who bought this product."

Note: The RELATE statement creates bidirectional relationships by default, so you can traverse in either direction even though you only specified one direction.

## Creating Edges with Properties

Edges can store their own metadata, not just point from one node to another:

```sql
RELATE person:harshit -> bought -> product:iphone 
CONTENT {
    quantity: 2,
    purchased_at: time::now(),
    price: 899.99,
    currency: "USD"
};
```

Here, the edge itself stores transaction details. You can query this metadata:

```sql
SELECT ->bought.quantity, ->bought.price FROM person:harshit;
```

## Querying Connected Data

One of the most powerful features is fetching related data in a single query:

```sql
SELECT 
    name,
    ->bought->product.name AS products_bought,
    ->bought.quantity AS quantities
FROM person:harshit;
```

Or with reverse traversal to see which customers bought a specific product:

```sql
SELECT 
    name,
    <-bought<-person.name AS customer_names
FROM product:iphone;
```

## Graph Query Examples

**Find all products a person bought:**
```sql
SELECT ->bought->product.* FROM person:harshit;
```

**Find all people who bought a specific product:**
```sql
SELECT <-bought<-person.name FROM product:iphone;
```

**Find extended relationships (people who bought products similar to what someone else bought):**
```sql
SELECT ->bought->product<-bought<-person.name FROM person:harshit;
```

## Why Graph Databases?

Traditional relational databases flatten these relationships into foreign keys, requiring expensive JOIN operations. SurrealDB treats relationships as primary citizens, making:

- **Faster traversals** of connected data
- **More intuitive queries** that reflect real-world relationships
- **Flexible data modeling** that captures context (edge properties)
- **Cleaner query syntax** for complex relationship patterns