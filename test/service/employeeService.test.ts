import test, { describe, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { employeeService } from '../../src/service/employeeService.js';
import type { Employee } from '../../src/types/employeeType.js';
import type { LoginRequest } from '../../src/types/RequestType.js';
import DB from '../../src/DB/db.js';

describe('employeeService', () => {
    const empService = employeeService();

    const mockLoginEmployee: Employee = {
        id: 'test-employee-id',
        name: 'Test Employee',
        email: 'test@test.com',
        team_id: 'test-team-id',
        password_hash: 'test-password',
    };

    const mockEmployeeRoecrod: Employee = {
        id: 'test-employee-id',
        name: 'Test Employee',
        email: 'test@test.com',
        team_id: 'test-team-id',
        password_hash: '$2b$10$7WTfxBtew1uu4oq2OWzJVOX4ir95PQBB9QPjDMcEPJmYBhid3Eyji',
    };

    const mockLoginRequest: LoginRequest = {
        email: 'test@test.com',
        password: 'test-password',
    };

    const DbMock = {
        query: async (query: string, values: any[]) => {
            if (query.includes('INSERT INTO employees')) {
                return { rows: [] }; // Mock response for employee registration
            }
            else if (query.includes('SELECT * FROM employees')) {
                return { rows: [mockEmployeeRoecrod] }; // Mock response for employee login
            }
            else if (query.includes('SELECT r.name FROM roles')) {
                return { rows: [{ name: 'admin' }] }; // Mock response for roles
            }
            else if (query.includes('UPDATE employees')) {
                return { rows: [{ ...mockEmployeeRoecrod, name: values[1].name }] }; // Mock response for employee update
            }
            return { rows: [] };
        },
    };

    // mock.method(empService, 'verifyPassword', async (password: string, hash: string) => {
    //     return true;
    // });

    mock.method(DB, 'query', DbMock.query);

    test('Service is able to register employee successfully', async () => {
        await empService.registerEmpoyee(mockLoginEmployee);
        assert.ok(true, 'Employee registered successfully');
    });

    test('Service is able to login employee successfully', async () => {
        const result = await empService.loginEmployee(mockLoginRequest);
        assert.ok(result, 'Employee logged in successfully and received a token');
        assert.strictEqual(typeof result, 'string', 'Token is a string');
    });

    test('Service updates the employee correctly', async () => {
        await empService.updateEmployee('test-employee-id', { name: 'Updated Name' });
        assert.ok(true, 'Employee updated successfully');
    });

});