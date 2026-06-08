import 'dotenv/config';
import express from 'express';
import postsRouter from './routes/postsRouter.js';

import './db/connection.js';

const app = express();

app.use(express.json());

app.use('/posts', postsRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});