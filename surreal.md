SurrealDB Advanced Graph Queries - Complete Guide
Table of Contents
Basic Graph Concepts

Relationship Creation & Management

Graph Traversal Queries

Recursive Graph Algorithms

Bidirectional Relationships

Relationship Metadata & Filtering

Advanced Pattern Matching

Network Analysis

Performance Optimization

Basic Graph Concepts
Graph Structure in SurrealDB
sql
-- Nodes (Vertices)
CREATE person:alice SET name = "Alice";
CREATE person:bob SET name = "Bob";
CREATE person:charlie SET name = "Charlie";

-- Edges (Relationships)
RELATE person:alice->knows->person:bob;
RELATE person:bob->knows->person:charlie;
Understanding Edge Tables
sql
-- Edge tables store relationships
SELECT * FROM knows;
-- Returns: id, in, out fields automatically created

-- Edge tables can have additional fields
RELATE person:alice->works_with->person:bob SET 
    project = "Alpha",
    since = d'2024-01-01';
Relationship Creation & Management
Basic RELATE Statements
sql
-- Single relationship
RELATE person:alice->follows->person:bob;

-- Multiple relationships in one statement
RELATE person:alice->follows->[person:bob, person:charlie];

-- With content/data on the relationship
RELATE person:alice->friends_with->person:bob CONTENT {
    closeness: 0.8,
    since: d'2023-05-15',
    met_at: "school"
};

-- Using SET for relationship data
RELATE person:alice->collaborates->person:bob SET
    projects = ["Alpha", "Beta"],
    successful_projects = 2;
Advanced RELATE Patterns
sql
-- Using variables in relationships
LET $team = (SELECT id FROM person WHERE department = "engineering");
LET $manager = person:manager_john;

RELATE $manager->manages->$team SET 
    team_size = array::len($team),
    since = time::now();

-- Conditional relationships
FOR $person IN (SELECT id FROM person WHERE experience > 5) {
    RELATE person:senior_mentor->mentors->$person SET 
        mentorship_start = time::now();
};
Managing Relationships
sql
-- Update relationship data
UPDATE knows SET strength = strength + 0.1 
WHERE in = person:alice AND out = person:bob;

-- Delete specific relationships
DELETE person:alice->knows WHERE out = person:bob;

-- Delete all relationships from a node
DELETE person:alice->knows;
Graph Traversal Queries
Basic Traversal Syntax
sql
-- Single hop traversal
SELECT ->knows->person FROM person:alice;

-- Multiple hops (explicit)
SELECT ->knows->person->knows->person FROM person:alice;

-- Traverse with filtering
SELECT ->knows->person[WHERE name = "Bob"] FROM person:alice;

-- Bidirectional traversal
SELECT <->knows<->person FROM person:alice;
Advanced Traversal Patterns
sql
-- Traverse multiple relationship types
SELECT ->(knows, works_with)->person FROM person:alice;

-- Wildcard traversal (any relationship type)
SELECT ->(?)->person FROM person:alice;

-- Conditional traversal paths
SELECT 
    ->knows->person AS friends,
    ->works_with->person AS colleagues,
    ->manages->person AS subordinates
FROM person:alice;
Traversal with Relationship Data
sql
-- Access relationship properties during traversal
SELECT 
    ->knows->person AS friend,
    ->knows.since AS friendship_since,
    ->knows.closeness AS friendship_strength
FROM person:alice;

-- Filter based on relationship properties
SELECT ->knows[WHERE closeness > 0.7]->person 
FROM person:alice;
Recursive Graph Algorithms
Basic Recursive Syntax
sql
-- Fixed depth recursion
person:alice.{3}->knows->person;

-- Depth range
person:alice.{1..3}->knows->person;

-- Unlimited depth (up to 256)
person:alice.{..}->knows->person;
Advanced Recursive Algorithms
+path - Find All Paths
sql
-- Find all paths between two nodes
person:alice.{..+path}->knows->person
WHERE array::contains(@, person:charlie);

-- All paths with depth limit
person:alice.{..5+path}->knows->person;
+collect - Unique Nodes
sql
-- Collect all unique nodes in network
person:alice.{..+collect}->knows->person;

-- Collect with depth constraints
person:alice.{1..3+collect}->knows->person;
+shortest - Shortest Path
sql
-- Find shortest path
person:alice.{..+shortest=person:charlie}->knows->person;

-- Shortest path including start node
person:alice.{..+shortest=person:charlie+inclusive}->knows->person;
Complex Recursive Structures
sql
-- Recursive tree with metadata
person:alice.{..3}.{
    id,
    name,
    depth: array::len(->knows->person.id) + 1,
    connections: ->knows.{
        relationship_strength: closeness,
        friend: ->person.@
    }
};

-- Recursive network analysis
LET $network = person:alice.{..+collect}->knows->person;
SELECT {
    network_size: array::len($network),
    direct_connections: array::len(person:alice.{1+collect}->knows->person),
    extended_network: array::len(person:alice.{2..+collect}->knows->person)
};
Bidirectional Relationships
True Bidirectional Queries
sql
-- Basic bidirectional traversal
SELECT <->knows<->person FROM person:alice;

-- Remove self from results
SELECT array::complement(<->knows<->person, [id]) 
FROM person:alice;

-- Bidirectional with filtering
SELECT <->knows[WHERE closeness > 0.5]<->person 
FROM person:alice;
Mutual Relationship Detection
sql
-- Find mutual friendships
SELECT 
    id,
    array::intersect(
        ->knows->person.id,
        <-knows<-person.id
    ) AS mutual_friends
FROM person:alice;

-- Mutual relationships with metadata
SELECT 
    ->knows->person AS i_know,
    <-knows<-person AS knows_me,
    array::intersect(->knows->person.id, <-knows<-person.id) AS mutual
FROM person:alice;
Ensuring Bidirectional Integrity
sql
-- Create unique constraint for bidirectional relationships
DEFINE INDEX unique_friendships ON TABLE knows 
FIELDS array::sort([in, out]) UNIQUE;

-- This prevents duplicate bidirectional relationships
RELATE person:alice->knows->person:bob;  -- OK
RELATE person:bob->knows->person:alice;  -- Error due to unique constraint
Relationship Metadata & Filtering
Rich Relationship Data
sql
-- Complex relationship structure
RELATE person:alice->collaborates->person:bob CONTENT {
    timeline: [
        {action: "project_start", date: d'2023-01-15', hours_worked: 40},
        {action: "milestone_1", date: d'2023-02-20', hours_worked: 120},
        {action: "project_complete", date: d'2023-04-10', hours_worked: 80}
    ],
    total_hours: 240,
    success_metrics: {
        on_time: true,
        under_budget: false,
        client_satisfaction: 0.85
    }
};
Advanced Filtering Techniques
sql
-- Temporal filtering
SELECT ->knows[WHERE since > d'2023-01-01']->person 
FROM person:alice;

-- Numeric range filtering
SELECT ->knows[WHERE closeness BETWEEN 0.5 AND 0.9]->person 
FROM person:alice;

-- Array filtering
SELECT ->works_with[WHERE array::len(projects) > 2]->person 
FROM person:alice;

-- Nested object filtering
SELECT ->collaborates[WHERE success_metrics.client_satisfaction > 0.8]->person 
FROM person:alice;
Dynamic Relationship Queries
sql
-- Parameterized relationship queries
LET $min_closeness = 0.6;
LET $start_date = d'2023-01-01';

SELECT 
    ->knows[WHERE closeness > $min_closeness AND since > $start_date]->person AS recent_close_friends,
    ->knows[WHERE closeness <= $min_closeness]->person AS acquaintances
FROM person:alice;
Advanced Pattern Matching
Complex Graph Patterns
sql
-- Triangle detection (friends of friends who are also direct friends)
SELECT 
    ->knows->person->knows->person AS potential_triangles
FROM person:alice
WHERE array::contains(->knows->person.id, ->knows->person->knows->person.id);

-- Mutual friend discovery
SELECT 
    ->knows->person AS my_friends,
    ->knows->person->knows->person AS their_friends,
    array::intersect(
        ->knows->person.id,
        ->knows->person->knows->person.id
    ) AS mutual_friends
FROM person:alice;
Multi-hop Pattern Matching
sql
-- Find people with common interests through network
SELECT 
    person:alice->knows->person->interested_in->topic AS topics_via_friends,
    person:alice->knows->person->knows->person->interested_in->topic AS topics_via_friends_of_friends
FROM person:alice;
Conditional Path Queries
sql
-- Find paths that meet specific criteria
SELECT 
    ->knows->person[WHERE department = "engineering"]->works_on->project AS engineering_projects,
    ->knows->person[WHERE department = "design"]->works_on->project AS design_projects
FROM person:alice;
Network Analysis
Centrality Metrics
sql
-- Degree centrality
SELECT 
    id,
    name,
    array::len(->knows->person) AS out_degree,
    array::len(<-knows<-person) AS in_degree,
    array::len(<->knows<->person) AS total_degree
FROM person
ORDER BY total_degree DESC;

-- Weighted degree centrality
SELECT 
    id,
    name,
    sum(->knows.closeness) AS weighted_out_degree,
    count(->knows->person) AS connection_count
FROM person
GROUP BY id
ORDER BY weighted_out_degree DESC;
Network Connectivity
sql
-- Component analysis
LET $network = person:alice.{..+collect}->knows->person;
SELECT {
    component_size: array::len($network),
    network_density: math::round(
        count($network) / (count($network) * (count($network) - 1)), 
        4
    ),
    avg_closeness: math::mean($network.->knows.closeness)
};

-- Bridge detection
SELECT 
    id,
    name,
    array::len(->knows->person) AS direct_connections,
    count(->knows->person->knows->person) AS second_degree_connections
FROM person
WHERE array::len(->knows->person) = 1;  -- Potential bridges
Temporal Network Analysis
sql
-- Network growth over time
SELECT 
    time::group(since, 'month') AS month,
    count() AS new_relationships
FROM knows
GROUP BY month
ORDER BY month;

-- Relationship duration analysis
SELECT 
    id,
    name,
    math::mean(->knows[WHERE since != NONE].(time::now() - since)) AS avg_friendship_duration
FROM person
GROUP BY id;
Performance Optimization
Indexing Strategies
sql
-- Basic indexes for common traversals
DEFINE INDEX idx_knows_in ON knows FIELDS in;
DEFINE INDEX idx_knows_out ON knows FIELDS out;

-- Composite indexes for relationship queries
DEFINE INDEX idx_knows_in_out ON knows FIELDS in, out;
DEFINE INDEX idx_knows_strength ON knows FIELDS in, closeness;

-- Unique constraints to prevent duplicates
DEFINE INDEX unique_relationship ON knows FIELDS in, out UNIQUE;
Query Optimization Techniques
sql
-- Use depth limits for recursive queries
person:alice.{1..5}->knows->person;  -- Better than unlimited

-- Filter early in the traversal
SELECT ->knows[WHERE closeness > 0.7]->person FROM person:alice;

-- Use timeout for complex queries
SELECT person:alice.{..}->knows->person TIMEOUT 5s;

-- Batch related queries
LET $friends = person:alice->knows->person;
LET $colleagues = person:alice->works_with->person;

RETURN {
    friends: $friends,
    colleagues: $colleagues,
    overlap: array::intersect($friends.id, $colleagues.id)
};
Monitoring and Analysis
sql
-- Query performance analysis
SELECT * FROM surrealql:explain 
WHERE query = "person:alice.{..5}->knows->person";

-- Relationship statistics
SELECT 
    meta::tb(id) AS relationship_type,
    count() AS total_relationships,
    math::mean(closeness) AS avg_closeness
FROM knows 
GROUP BY relationship_type;
Best Practices Summary
Always use depth limits in recursive queries to prevent infinite loops

Create appropriate indexes on edge tables for common traversal patterns

Use bidirectional queries (<->) for mutual relationships

Add relationship metadata to enable rich filtering and analysis

Implement unique constraints to prevent duplicate relationships

Use timeouts for complex graph queries

Filter early in traversal paths to improve performance

Monitor query performance using surrealql:explain

Use structured metadata for complex relationship data

Batch related queries to reduce round trips