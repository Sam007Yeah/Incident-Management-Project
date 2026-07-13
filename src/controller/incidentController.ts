import express from 'express';
import type { Request, Response } from 'express';
import { incidentService } from '../service/incidentService.js';
import { IncidentSchema } from '../types/incidentType.js';
import { IncidentUpdateSchema } from '../types/incidentType.js';
import type { Incident } from '../types/incidentType.js';
import { incidentErrorConstants } from '../errorHandler/incidentErrorConstants.js';

const incidentController = express.Router();
const incidentServiceInstance = incidentService();

incidentController.use(express.json());

incidentController.use((req: Request, res: Response, next) => {
    //Middleware to authenticate
    console.log("Incident Controller Middleware: " + req.method + " " + req.url);
    next();
});

incidentController.get("/getAllIncidents", async (req: Request, res: Response, next: any) => {
    try {
        const incidents = await incidentServiceInstance.getAllIncidents();
        res.status(200).send(incidents);
    }
    catch (err) {
        (err as any).statusCode = 500;
        (err as any).message = (err as any).message ? (err as any).message : incidentErrorConstants.INCIDENT_RETRIEVAL_FAILED;
        next(err);
        // console.error("Error getting all incidents:", err);
        // res.status(500).send({ "error": "Failed to get all incidents" });
    }
});

incidentController.get("/getIncident/:id", async (req: Request, res: Response, next: any) => {
    try {
        const incidentId = req.params.id;
        const incident = await incidentServiceInstance.getIncidentById(incidentId as string);
        if (incident) {
            res.status(200).send(incident);
        } else {
            // res.status(404).send({ "error": "Incident not found" });
            const error = new Error(incidentErrorConstants.INCIDENT_NOT_FOUND);
            (error as any).statusCode = 404;
            next(error);
        }
    }
    catch (err) {
        (err as any).statusCode = 500;
        (err as any).message = (err as any).message ? (err as any).message : incidentErrorConstants.INCIDENT_RETRIEVAL_FAILED;
        next(err);
        // console.error("Error getting incident by ID:", err);
        // res.status(500).send({ "error": "Failed to get incident by ID" });
    }
});

incidentController.get("/getIncidentByTeam/:teamId", async (req: Request, res: Response, next: any) => {
    try {
        const teamId = req.params.teamId;
        const incidents = await incidentServiceInstance.getIncidentByTeamId(teamId as string);
        res.status(200).send(incidents);
    } catch (err) {
        (err as any).statusCode = 500;
        (err as any).message = (err as any).message ? (err as any).message : incidentErrorConstants.INCIDENT_RETRIEVAL_FAILED;
        next(err)
        // console.error("Error getting incidents by team ID:", err);
        // res.status(500).send({ "error": "Failed to get incidents by team ID" });
    }
});

incidentController.post("/createIncident", async (req: Request, res: Response, next: any) => {
    try {
        const incident = req.body;
        const parseResult = IncidentSchema.safeParse(incident);
        if (!parseResult.success) {
            const error = new Error(incidentErrorConstants.INCIDENT_CREATION_INVALID_DATA);
            (error as any).statusCode = 400;
            (error as any).detail = parseResult.error.issues;
            next(error);
            // res.status(400).send({ "error": "Invalid incident data", "details": parseResult.error.issues });
            // return;
        }
        await incidentServiceInstance.createIncident(incident as Incident);
        res.status(201).send({ "message": "Incident created successfully" });
    } catch (err) {
        (err as any).statusCode = 500;
        (err as any).message = (err as any).message ? (err as any).message : incidentErrorConstants.INCIDENT_CREATION_FAILED;
        next(err);
        // console.error("Error creating incident:", err);
        // res.status(500).send({ "error": "Failed to create incident" });
    }
});

incidentController.patch("/updateIncident/:id", async (req: Request, res: Response, next: any) => {
    try {
        const incidentId = req.params.id;
        const updatedData = req.body;
        const parseResult = IncidentUpdateSchema.safeParse(updatedData);
        if (!parseResult.success) {
            const error = new Error(incidentErrorConstants.INCIDENT_UPDATE_FAILED);
            (error as any).statusCode = 400;
            (error as any).detail = (parseResult as any).error.message;
            next(error);
            return;
            // res.status(400).send({ "error": "Invalid incident update data", "details": parseResult.error.issues });
            // return;
        }
        const result = await incidentServiceInstance.updateIncident(incidentId as string, updatedData as Partial<Incident>);
        if (!result) {
            const error = new Error(incidentErrorConstants.INCIDENT_NOT_FOUND);
            (error as any).statusCode = 404;
            next(error);
            // res.status(404).send({ "error": "Incident not found" });
            return;
        }
        res.send({ "message": "Incident updated successfully" }).status(200);
    } catch (err) {
        (err as any).statusCode = 500;
        (err as any).message = (err as any).message ? (err as any).message : incidentErrorConstants.INCIDENT_UPDATE_FAILED;
        next(err);
        // console.error("Error updating incident:", err);
        // res.status(500).send({ "error": "Failed to update incident" });
    }
});

incidentController.get("/filterIncidents", async (req: Request, res: Response, next: any) => {
    try {
        const values = Object.values(req.query);
        if (values.length === 0) {
            incidentServiceInstance.getAllIncidents().then((incidents) => {
                res.status(200).send(incidents);
            }).catch((err) => {
                (err as any).statusCode = 500;
                (err as any).message = (err as any).message ? (err as any).message : incidentErrorConstants.INCIDENT_RETRIEVAL_FAILED;
                next(err);
                // console.error("Error getting all incidents:", err);
                // res.status(500).send({ "error": "Failed to get all incidents" });
            });
            return;
        }
        const incidents = await incidentServiceInstance.filterIncidents(req.query);
        res.status(200).send(incidents);
    } catch (err) {
        (err as any).statusCode = 500;
        (err as any).message = (err as any).message ? (err as any).message : incidentErrorConstants.INCIDENT_RETRIEVAL_FAILED;
        next(err);
        // console.error("Error filtering incidents:", err);
        // res.status(500).send({ "error": "Failed to filter incidents" });
    }
});

incidentController.get("/", (req: Request, res: Response) => {
    res.send({ "message": "Incident Controller is working!" });
});

export default incidentController;