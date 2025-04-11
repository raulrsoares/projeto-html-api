import express from 'express';
import morgan from 'morgan';
import { router } from './routes/routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFound';

const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use('/api', router);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
