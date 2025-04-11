import path from 'path';
import dotenv from 'dotenv';
import config from './config/config';
import app from './app';
import expressListRoutes from 'express-list-routes';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

expressListRoutes(app);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
