import express from 'express';
import type { Request, Response } from 'express';
import { initDB } from './DB/init.js';
import employeeController from './controller/EmployeeController.js';
import incidentController from './controller/incidentController.js';
import openController from './controller/OpenController.js';
import { globalErrorHandler } from './errorHandler/globalErrorHandler.js';


const app = express();
app.use(express.json());

app.use("/api/v1", openController);
app.use("/api/v1/employee", employeeController);
app.use("/api/v1/incident", incidentController);

app.get("/", (req: Request, res: Response) => {
    res.send({ "message": "Hello World!" });
});

app.use(globalErrorHandler);

const PORT = Number(process.env.PORT ?? 3000);

async function startServer() {
    try {
        await initDB();

        app.listen(PORT, () => {
            console.log(`App listening on port: ${PORT}`);
        });
    } catch (error) {
        console.error('Application startup failed:', error);
        process.exitCode = 1;
    }
}

void startServer();



export default app;