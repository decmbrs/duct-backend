import 'dotenv/config';

import express from "express";
import cors from "cors";
import objectsRouter from "./objects.js";
import connectionsRouter from "./connections.js";
import cablesRouter from "./cables.js";
import splicesRouter from "./splices.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/objects", objectsRouter);
app.use("/connections", connectionsRouter);
app.use("/cables", cablesRouter);
app.use("/splices", splicesRouter);

const port = 3001;
app.listen(port, () => console.log(`API running on ${port}`));
