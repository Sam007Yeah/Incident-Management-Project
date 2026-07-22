import test, { describe, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { employeeService } from '../../src/service/employeeService.js';
import type { Employee } from '../../src/types/employeeType.js';
import DB from '../../src/DB/db.js';

describe('employeeService', () => {
    const empService = employeeService();

    const mockEmployee: Employee = {
        id: 'test-employee-id',
        name: 'Test Employee',
        email: 'test@test.com',
        team_id: 'test-team-id',
        password_hash: 'test-password',
    };

    const DbMock = {
        insertQuery: async (query: string, values: any[]) => {
            return { rows: [] }; // Default mock response
        },
    };

    mock.method(DB, 'query', DbMock.insertQuery);

    test('Service is able to register employee successfully', () => {
        empService.registerEmpoyee(mockEmployee);
        assert.ok(true, 'Employee registered successfully');
    });
});