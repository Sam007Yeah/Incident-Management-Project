import express from 'express';
import type { Request, Response } from 'express';

const employeeController = express.Router();

employeeController.use(express.json());

employeeController.use((req: Request, res: Response, next) => {
    //Middleware to authenticate
    console.log("Employee Controller Middleware: " + req.method + " " + req.url);
    next();
});

//User Services for registering, login, logout, etc

employeeController.post("/register", (req: Request, res: Response) => {
    // Logic to register a new employee in the database
    res.send({ "message": "Register a new employee" });
});

employeeController.post("/login", (req: Request, res: Response) => {
    // Logic to login an employee
    res.send({ "message": "Employee login" });
});

employeeController.post("/logout", (req: Request, res: Response) => {
    // Logic to logout an employee
    res.send({ "message": "Employee logout" });
});

employeeController.get("/", (req: Request, res: Response) => {
    res.send({ "message": "Employee Controller is working!" });
});

employeeController.patch("/updateEmployee/:id", (req: Request, res: Response) => {
    const employeeId = req.params.id;
    // Logic to update an existing employee in the database
    res.send({ "message": `Update employee with ID: ${employeeId}` });
});

export default employeeController;