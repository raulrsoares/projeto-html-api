import './loadEnv';
import { config } from './config/config';
import app from './app';
import expressListEndpoints from 'express-list-endpoints';

if (process.env.NODE_ENV === 'development') {
  const endpoints = expressListEndpoints(app);
  console.log('METHOD\tPATH');
  endpoints.forEach((route) => {
    route.methods.forEach((method) => {
      console.log(`${method}\t${route.path}`);
    });
  });
  console.log();
}

app.listen(config.port, (err) => {
  if (err) console.log(err);
  console.log(`Server running on port ${config.port}`);
});
