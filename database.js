import dotenv from 'dotenv'
import pg from 'pg';
dotenv.config()

const { Pool } = pg;
const pool = new Pool({
   connectionString: `${process.env.DB_URL}`,
});
async function initializeDatabase() {

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS president (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    steepness Text NOT Null,
    Rule_start DATE,
    appearance Text NOT Null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
   `;

   try {
      await pool.query(createTableQuery);
      console.log('president are ready')
   } catch (error) {
      console.error('Error initializing database:', error.message);
      throw error;
   }
};

async function addPresident (name, country, steepness, Rule_start, appearance) {

   const appearancePresident = ['young', 'old', 'Normal'];
   if (!appearancePresident.includes(appearance.toLowerCase())) {
      console.error(`error there should be only one president: ${appearancePresident.join(', ')}`);
      return;
   }

   const Presidentsteepness = ['cool', 'pro',"noob"];
   if (!Presidentsteepness.includes(steepness.toLowerCase())) {
      console.error(`error: You either have to be cool or not so cool: ${Presidentsteepness.join(', ')}`);
      return;
   }

   const query = `
        INSERT INTO President(
           name, country, steepness ,Rule_start, appearance
            
        ) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`;

   const values = [name, country, steepness, Rule_start, appearance ];

   try {
      const res = await pool.query(query, values);
      console.log('President ready:', res.rows[0]);
   } catch (err) {
      console.error('Error:', err.message);
   }
}

async function getAllPresident() {
   const res = await pool.query('SELECT * FROM President');
   console.table(res.rows);
}

async function PresidentExists(id) {
   const res = await pool.query('SELECT * FROM President WHERE id = $1', [id]);
   return res.rows.length > 0;
}

async function deletePresident(id) {
   if (isNaN(id) || id <= 0) {
      console.error('Error: ID must be an additional number');
      return;
   }

   if (!(await PresidentExists(id))) {
      console.error(`Error: President with ID ${id} not found`);
      return;
   }

   await pool.query('DELETE FROM President WHERE id = $1', [id]);
   console.log(`The President with ID ${id} has been successfully removed from the database.`);
}

(async () => {
   try {
      await initializeDatabase();   

      switch(process.argv[2]) { 
         case "list": {
            await getAllPresident();
            break;
         }
         case "add": {
            if (process.argv.length < 7) {
               console.log("Usage: node database.js add <name> <country> <steepness> <Rule_start> <appearance> ");
               console.log("Example: node database.js add Joe USA cool 1970-03-01 Old");
               break; 
            }
             await addPresident(
               process.argv[3],
               process.argv[4],
               process.argv[5],
               process.argv[6],
               process.argv[7]
            );
            break;
         }
         case "delete": {
            if (process.argv.length < 4) {
               console.log("Usage: node database.js delete <id>");
               break;
            }
            const id = parseInt(process.argv[3]);
            await deletePresident(id);
            break;
         }
         case "reset": {
            await pool.query('DROP TABLE IF EXISTS President');
            console.log("Your president was stolen RIP ,table successfully deleted! Run any command (e.g. list) to create a new clean table.");
            break;
         }
         case "help": {
            console.log("Codes");
            console.log("node database.js list - all President");
            console.log("node database.js add <name> <country> <steepness> <Rule_start> <appearance>");
            console.log("node database.js delete <id> - remove the president");
            console.log("node database.js reset - reset the table");
            break;
         }
         default: {
            console.log("Usage: node database.js [list|add|delete|reset|help]");
            break;
         }
      }

   } catch (err) {
      console.error("Error:", err.message);
   } finally {
      console.log('Completing database work...');
      //uncomment to delete the table
      //await pool.query('DROP TABLE Presedent');
      process.exit();
   }
})();
