import DB from './db.js'

export async function initDB(additionalQueries?: string[]) {
    try {
        const createIncidentsTableQuery = await DB.query(`
            CREATE TABLE IF NOT EXISTS incidents (
                id VARCHAR PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                status VARCHAR(50) NOT NULL,
                assigned_to VARCHAR,
                start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const createTeamsTableQuery = await DB.query(`
            CREATE TABLE IF NOT EXISTS teams (
                id VARCHAR PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
        `);

        const createRolesTableQuery = await DB.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id VARCHAR PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );
        `);

        const createUsersTableQuery = await DB.query(`
            CREATE TABLE IF NOT EXISTS employees (
                id VARCHAR PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                team_id VARCHAR(255),
                role_id VARCHAR(50),
                password_hash VARCHAR(500) NOT NULL,
                FOREIGN KEY (team_id) REFERENCES teams(id),
                FOREIGN KEY (role_id) REFERENCES roles(id)
            );
        `);

        if (additionalQueries && additionalQueries.length > 0) {
            for (const query of additionalQueries) {
                await DB.query(query);
            }
        }

        Promise.allSettled([
            createIncidentsTableQuery,
            createTeamsTableQuery,
            createRolesTableQuery,
            createUsersTableQuery]).then(() => {
                console.log("Database Tables Initialised Successfully");
            }).catch((error) => {
                console.error("Error initialising Database Tables with error:", error);
            });
    }
    catch (error) {
        console.error("Error initialising Database Tables with error:", error);
    }
}