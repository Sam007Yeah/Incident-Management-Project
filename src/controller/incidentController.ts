import express from 'express';
import type { Request, Response } from 'express';

const incidentController = express.Router();

incidentController.use(express.json());

incidentController.use((req: Request, res: Response, next) => {
    //Middleware to authenticate
    console.log("Incident Controller Middleware: " + req.method + " " + req.url);
    next();
});

incidentController.get("/getAllIncidents", (req: Request, res: Response) => {
    // Logic to get all incidents from the database
    res.send({ "message": "Get all incidents" });
});

incidentController.get("/getIncident/:id", (req: Request, res: Response) => {
    const incidentId = req.params.id;
    // Logic to get a specific incident by ID from the database
    res.send({ "message": `Get incident with ID: ${incidentId}` });
});

incidentController.post("/createIncident", (req: Request, res: Response) => {
    // Logic to create a new incident in the database
    res.send({ "message": "Create a new incident" });
});

incidentController.patch("/updateIncident/:id", (req: Request, res: Response) => {
    const incidentId = req.params.id;
    // Logic to update an existing incident in the database
    res.send({ "message": `Update incident with ID: ${incidentId}` });
});

incidentController.get("/", (req: Request, res: Response) => {
    res.send({ "message": "Incident Controller is working!" });
});

export default incidentController;