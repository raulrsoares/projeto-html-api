import './loadEnv';
import { config } from './config/config';
import app from './app';

if (process.env.NODE_ENV === 'development') {
}

app.listen(config.port, (err) => {
  if (err) console.log(err);
  console.log(`Server running on port ${config.port}`);
});
