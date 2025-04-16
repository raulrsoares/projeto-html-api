import express, { Express } from 'express';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import { router } from './routes/routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFound';
import { timeLog } from './middlewares/timer.middlewares';

const app: Express = express();

const corsOptions: CorsOptions = {
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(timeLog);
app.use(morgan('tiny'));
app.use('/api', router);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
