import express from 'express';
import type { Request, Response } from 'express';
import { initDB } from './DB/init.js';
import employeeController from './controller/EmployeeController.js';
import incidentController from './controller/incidentController.js';
import { globalErrorHandler } from './errorHandler/globalErrorHandler.js';

const app = express();
app.use(express.json());

app.use("/api/v1/employee", employeeController);
app.use("/api/v1/incident", incidentController);

app.get("/", (req: Request, res: Response) => {
    res.send({ "message": "Hello World!" });
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await initDB();
    console.log("App Listening on port: " + PORT);
});

export default app;