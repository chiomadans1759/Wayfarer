import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import Route from './Routes/routes';

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

Route(app);

// define routes
app.get('/', (req, res) => {
  res.json({ Message: 'Welcome! This is the Wayfarer trip app' });
});

// get the port from the process env
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server is listening for requests at port ${PORT}`);
});

export default app;
