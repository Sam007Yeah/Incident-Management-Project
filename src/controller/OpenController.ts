// Controller for handling registration and Login of employees, will use no authentication for now.

import express from 'express';
import type { Request, Response } from 'express';
import { employeeErrorConstants } from '../errorHandler/employeeErrorConstants.js';
import { EmployeeSchema, type Employee } from '../types/employeeType.js';
import { LoginRequestSchema, type LoginRequest } from '../types/RequestType.js';
import { employeeService } from '../service/employeeService.js';

const empService = employeeService();
const openController = express.Router();
openController.use(express.json());

openController.get("/health_check", (req: Request, res: Response) => {
    res.send({ "message": "Open Controller is working!" });
});

openController.post("/register", async (req: Request, res: Response, next: any) => {
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

openController.post("/login", async (req: Request, res: Response, next: any) => {
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

export default openController;