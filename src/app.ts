import express from 'express';
import morgan from 'morgan';
// import routes from "./routes";
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFound';

const app = express();

app.use(express.json());
app.use(morgan('tiny'));
// app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
