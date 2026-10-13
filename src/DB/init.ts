import DB from './db.js';

export async function initDB(additionalQueries?: string[]) {
    const queries = [
        `CREATE TABLE IF NOT EXISTS teams (
            id VARCHAR PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS roles (
            id VARCHAR PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS employees (
            id VARCHAR PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            team_id VARCHAR(255),
            password_hash VARCHAR(500) NOT NULL,
            FOREIGN KEY (team_id) REFERENCES teams(id)
        );`,
        `CREATE TABLE IF NOT EXISTS employee_roles (
            employee_id VARCHAR,
            role_id VARCHAR,
            PRIMARY KEY (employee_id, role_id),
            FOREIGN KEY (employee_id) REFERENCES employees(id),
            FOREIGN KEY (role_id) REFERENCES roles(id)
        );`,
        `CREATE TABLE IF NOT EXISTS incidents (
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
        );`,
        `CREATE TABLE IF NOT EXISTS customers (
            id VARCHAR PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            eamil VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(500) NOT NULL
        );`,
        ...(additionalQueries ?? []),
    ];

    try {
        for (const query of queries) {
            await DB.query(query);
        }

        console.log('Database Tables Initialised Successfully');
    } catch (error) {
        console.error('Error initialising Database Tables:', error);
        throw error;
    }
}
