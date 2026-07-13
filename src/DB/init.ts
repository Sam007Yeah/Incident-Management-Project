import DB from './db.js'

export async function initDB(additionalQueries?: string[]) {
    try {
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
                password_hash VARCHAR(500) NOT NULL,
                FOREIGN KEY (team_id) REFERENCES teams(id)
            );
        `);

        const createEmpRolesTableQuery = await DB.query(`
            CREATE TABLE IF NOT EXISTS employee_roles (
                employee_id VARCHAR,
                role_id VARCHAR,
                PRIMARY KEY (employee_id, role_id),
                FOREIGN KEY (employee_id) REFERENCES employees(id),
                FOREIGN KEY (role_id) REFERENCES roles(id)
            );
        `);

        const createIncidentsTableQuery = await DB.query(`
            CREATE TABLE IF NOT EXISTS incidents (
                id VARCHAR PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                status VARCHAR(50) NOT NULL,
                priority VARCHAR(50) NOT NULL,
                assigned_to VARCHAR,
                assigned_team VARCHAR,
                start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by_id VARCHAR NOT NULL,
                FOREIGN KEY (assigned_to) REFERENCES employees(id),
                FOREIGN KEY (assigned_team) REFERENCES teams(id)
            );
        `);

        const createCustomersTableQuery = await DB.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id VARCHAR PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                eamil VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(500) NOT NULL
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
            createUsersTableQuery,
            createEmpRolesTableQuery,
            createCustomersTableQuery]).then(() => {
                console.log("Database Tables Initialised Successfully");
            }).catch((error) => {
                console.error("Error initialising Database Tables with error:", error);
            });
    }
    catch (error) {
        console.error("Error initialising Database Tables with error:", error);
    }
}