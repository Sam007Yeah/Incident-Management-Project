import express from 'express';
import type { Request, Response } from 'express';
import { employeeService } from '../service/employeeService.js';
import type { Employee } from '../types/employeeType.js';
import { employeeErrorConstants } from '../errorHandler/employeeErrorConstants.js';
import { AssignRoleRequestSchema } from '../types/RequestType.js';
import { JwtAuthService } from '../service/authService/jwtAuthService.js';

const employeeController = express.Router();
const empService = employeeService();
const jwtAuthService = new JwtAuthService();
employeeController.use(express.json());

employeeController.use((req: Request, res: Response, next) => {
    //Middleware to authenticate
    // console.log("Employee Controller Middleware: " + req.method + " " + req.url);
    const token = req.headers.authorization?.split(' ')[1];
    const user = jwtAuthService.authenticate({ token }).then((user) => {
        console.log("Authentication successful");
        if (user?.role.includes("admin") || user?.role.includes("manager")) {
            next();
        }
        else {
            const error = new Error(employeeErrorConstants.EMPLOYEE_ACCESS_OUT_OF_SCOPE);
            (error as any).statusCode = 403;
            next(error);
        }
    }).catch((err) => {
        // console.error("Authentication failed:", err.message);
        err.statusCode = 401;
        err.message = employeeErrorConstants.EMPLOYEE_AUTHENTICATION_FAILED;
        next(err);
    });
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