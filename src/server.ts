import express from 'express';
import routes from './routes';
import fs, { promises as fsPromises } from 'fs';
import path from 'path';

const app = express();

const PORT = process.env.PORT || 5000;

app.use('/img-pro-api/api/v1', routes);

app.listen(PORT, async () => {
  const imgDir = path.join(__dirname, '/images');

  try {
    if (!fs.existsSync(imgDir)) {
      fs.mkdirSync(imgDir);
      await fsPromises.copyFile(
        path.join(__dirname, '../default.jpg'),
        `${imgDir}/default.jpg`
      );
      fs.mkdirSync(`${imgDir}/thumb`);
    }

    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});

export default app;
