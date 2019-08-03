import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import Route from './Routes/routes';
import * as swaggerDocs from './swagger.json';

dotenv.config();
const app = express();

// to avoid cors issue
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// use the body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use swagger for documentation
app.use('/', swaggerUi.serve);

Route(app);

// define routes
app.get('/api/v1/docs', swaggerUi.setup(swaggerDocs));
app.get('/', (req, res) => {
  res.json({ Message: 'Welcome! This is the Wayfarer home page.' });
});
app.get('*', (req, res) => {
  res.json({ Message: 'Endpoint Not Found' });
});

// get the port from the process env
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is listening for requests at port ${PORT}`);
});

export default app;
