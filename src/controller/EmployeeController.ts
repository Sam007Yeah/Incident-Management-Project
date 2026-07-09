import express from 'express';
import type { Request, Response } from 'express';
import { employeeService } from '../service/employeeService.js';
import type { Employee } from '../types/employeeType.js';
import { EmployeeSchema } from '../types/employeeType.js';
import { LoginRequestSchema } from '../types/RequestType.js';
import type { LoginRequest } from '../types/RequestType.js';
import { employeeErrorConstants } from '../errorHandler/employeeErrorConstants.js';
import { AssignRoleRequestSchema } from '../types/RequestType.js';

const employeeController = express.Router();
const empService = employeeService();
employeeController.use(express.json());

employeeController.use((req: Request, res: Response, next) => {
    //Middleware to authenticate
    console.log("Employee Controller Middleware: " + req.method + " " + req.url);
    next();
});

//User Services for registering, login, logout, etc

employeeController.post("/register", async (req: Request, res: Response, next: any) => {
    // Logic to register a new employee in the database
    const employee: Object = req.body;
    const parseResult = EmployeeSchema.safeParse(employee);
    if (parseResult.success) {
        try {
            await empService.registerEmpoyee(parseResult.data as Employee)
                .then(() => {
                    res.status(201).send({ "message": "Employee registered successfully" });
                })
                .catch((err) => {
                    // console.error("Error registering employee:", err);
                    // res.status(500).send({ "error": "Failed to register employee" });
                    err.statusCode = 500;
                    err.message = employeeErrorConstants.EMPLOYEE_REGISTRATION_FAILED;
                    next(err);
                });
        } catch (err) {
            // console.error("Error registering employee:", err);
            // res.status(500).send({ "error": "Failed to register employee" });
            (err as any).statusCode = 500;
            (err as any).message = employeeErrorConstants.EMPLOYEE_REGISTRATION_FAILED;
            next(err);
        }
    }
    else {
        // res.status(400).send({ "error": "Invalid employee data", "details": parseResult.error.issues });
        const error = new Error(employeeErrorConstants.EMPLOYEE_REGISTRATION_INVALID_DATA);
        (error as any).statusCode = 400;
        (error as any).detail = parseResult.error.issues;
        next(error);
    }
});

employeeController.post("/login", async (req: Request, res: Response, next: any) => {
    const loginRequest: Object = req.body;
    const parseResult = LoginRequestSchema.safeParse(loginRequest);
    if (parseResult.success) {
        await empService.loginEmployee(parseResult.data as LoginRequest)
            .then((token) => {
                res.status(200).send({ "message": "Login successful", "token": token });
            })
            .catch((err) => {
                // console.error("Error logging in employee:", err);
                // res.status(500).send({ "error": "Failed to login employee" });
                err.statusCode = 500;
                next(err);
            });
    }
    else {
        // res.status(400).send({ "error": "Invalid login data", "details": parseResult.error.issues });
        const error = new Error(employeeErrorConstants.EMPLOYEE_LOGIN_INPUT_INVALID);
        (error as any).statusCode = 400;
        (error as any).detail = parseResult.error.issues;
        next(error);
    }
});

employeeController.get("/health_check", (req: Request, res: Response) => {
    res.send({ "message": "Employee Controller is working!" });
});

employeeController.patch("/updateEmployee/:id", async (req: Request, res: Response, next: any) => {
    const employeeId = req.params.id;
    const updatedData: Partial<Employee> = req.body;
    await empService.updateEmployee(employeeId as string, updatedData).catch((err) => {
        // console.error("Error updating employee:", err.message);
        // res.status(500).send({ "error": "Failed to update employee" });
        err.statusCode = 500;
        err.message = employeeErrorConstants.EMPLOYEE_UPDATE_FAILED;
        throw next(err);
    }).then(() => {
        res.status(200).send({ "message": `Employee with ID ${employeeId} updated successfully.` });
    });
});

employeeController.post("/assignRole/:id", async (req: Request, res: Response, next: any) => {
    const employeeId = req.params.id;
    const requestBody = req.body;
    const parseResult = AssignRoleRequestSchema.safeParse(requestBody);
    if (!parseResult.success) {
        const error = new Error("Invalid request data for assigning role to employee");
        (error as any).statusCode = 400;
        (error as any).detail = parseResult.error.issues;
        return next(error);
    }
    const { role_id } = parseResult.data;
    await empService.assignRoleToEmployee(employeeId as string, role_id as string).catch((err) => {
        // console.error("Error assigning role to employee:", err.message);
        // res.status(500).send({ "error": "Failed to assign role to employee" });
        err.statusCode = 500;
        err.message = employeeErrorConstants.EMPLOYEE_ASSIGN_ROLE_FAILED;
        throw next(err);
    }).then(() => {
        res.status(200).send({ "message": `Role with ID ${role_id} assigned to employee with ID ${employeeId} successfully.` });
    });
});

employeeController.delete("/revokeRole/:id", async (req: Request, res: Response, next: any) => {
    const employeeId = req.params.id;
    const requestBody = req.body;
    const parseResult = AssignRoleRequestSchema.safeParse(requestBody);
    if (!parseResult.success) {
        const error = new Error("Invalid request data for revoking role from employee");
        (error as any).statusCode = 400;
        (error as any).detail = parseResult.error.issues;
        throw next(error);
    }
    const { role_id } = parseResult.data;
    await empService.revokeRoleFromEmployee(employeeId as string, role_id as string).catch((err) => {
        // console.error("Error revoking role from employee:", err.message);
        // res.status(500).send({ "error": "Failed to revoke role from employee" });
        err.statusCode = 500;
        err.message = "Failed to revoke role from employee";
        throw next(err);
    }).then(() => {
        res.status(200).send({ "message": `Role with ID ${role_id} revoked from employee with ID ${employeeId} successfully.` });
    });
});

export default employeeController;