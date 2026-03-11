MLBB Presidents Database

MLBB Presidents Database is a Node.js project for managing a list of presidents in a PostgreSQL database. The project demonstrates:
Creating a table with president information (name, country, steepness, rule, appearance, created_at)
Adding new records via the command line
Listing all presidents in a formatted table using console.table
Deleting records by ID
Resetting the table to start fresh
Features

Uses PostgreSQL for data storage
appearance field accepts only: young, old, normal
steepness field accepts only: cool, pro, noob
id auto-increments (SERIAL)
created_at automatically stores the creation timestamp

Usage
Run these commands in the terminal:
# List all presidents
node database.js list
# Add a new president
node database.js add <name> <country> <steepness> <rule> <appearance>
# Example:
node database.js add Joe USA cool 1980-2040 Old
# Delete a president by ID
node database.js delete <id>
# Reset the table
node database.js reset
# Show help
node database.js help
