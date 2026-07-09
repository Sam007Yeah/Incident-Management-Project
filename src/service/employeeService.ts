import type { Employee } from "../types/employeeType.js";
import DB from "../DB/db.js";
import bcrypt from "bcrypt";
import { jwtService } from "./jwtService.js";
import type { LoginRequest } from "../types/RequestType.js";

export function employeeService() {

    const jwt = jwtService();

    async function generateHash(password: string): Promise<string> {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds)
        return hash;
    }

    async function verifyPassword(password: string, hash: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    }
    return {
        async registerEmpoyee(employee: Employee) {
            //Register Employee
            const passwordHash = await generateHash(employee.password_hash);
            const query = `
                INSERT INTO employees (id, name, email, team_id, password_hash)
                VALUES ($1, $2, $3, $4, $5)
            `;
            const values = [employee.id, employee.name, employee.email, employee.team_id, passwordHash];
            await DB.query(query, values);
        },

        async loginEmployee(loginRequestBody: LoginRequest): Promise<string | null> {
            //login the employee by verifyiing the password and then return a new JWT token
            const query = `
                SELECT * FROM employees WHERE email = $1
            `;
            const values = [loginRequestBody.email];
            const result = await DB.query(query, values);

            if (result.rows.length === 0) {
                throw new Error("Employee not found in the database");
            }

            const employee: Employee = result.rows[0];
            const isPasswordValid = await verifyPassword(loginRequestBody.password, employee.password_hash);

            if (!isPasswordValid) {
                throw new Error("Invalid password");
            }

            const getRolesQuery = `
                SELECT r.name FROM roles r
                JOIN employee_roles er ON r.id = er.role_id
                WHERE er.employee_id = $1
            `;
            const rolesResult = await DB.query(getRolesQuery, [employee.id]);
            const roles = rolesResult.rows.map((row) => row.name);

            const payload = {
                id: employee.id,
                email: employee.email,
                roles: roles
            }
            const token = jwt.createToken(payload);
            return token;
        },

        async updateEmployee(employeeId: string, updatedData: Partial<Employee>) {
            //Update the employee data in the database
            const fields = Object.keys(updatedData);
            const values = Object.values(updatedData);
            const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
            const query = `
                UPDATE employees
                SET ${setClause}
                WHERE id = $${fields.length + 1}
            `;
            values.push(employeeId);
            await DB.query(query, values);
        },

        async assignRoleToEmployee(employeeId: string, roleId: string) {
            //Assign a role to an employee in the database
            const query = `
                INSERT INTO employee_roles (employee_id, role_id)
                VALUES ($1, $2)
            `;
            const values = [employeeId, roleId];
            await DB.query(query, values);
        },

        async revokeRoleFromEmployee(employeeId: string, roleId: string) {
            //Revoke a role from an employee in the database
            const query = `
                DELETE FROM employee_roles
                WHERE employee_id = $1 AND role_id = $2
            `;
            const values = [employeeId, roleId];
            await DB.query(query, values);
        }
    }
}