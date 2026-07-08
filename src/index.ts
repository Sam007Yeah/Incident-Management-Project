import express from 'express';
import type { Request, Response } from 'express';
import { initDB } from './DB/init.js';

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send({ "message": "Hello World!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await initDB();
    console.log("App Listening on port: " + PORT);
});

export default app;