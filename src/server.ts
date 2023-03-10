import fs, { promises as fsPromises } from 'fs';
import express from 'express';
import path from 'path';

import routes from './routes';

const app = express();

const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');

app.use('/img-pro-api/api/v1', routes);

app.listen(PORT, async () => {
  const imgDir = path.join(__dirname, '/images');
  try {
    if (!fs.existsSync(imgDir)) {
      fs.mkdirSync(imgDir);
      const defaults = ['jpeg', 'png', 'webp', 'gif', 'avif', 'tiff'];
      defaults.forEach((d) => {
        fsPromises.copyFile(
          path.join(__dirname, `../defaults/default.${d}`),
          `${imgDir}/default.${d}`
        );
      });
      fs.mkdirSync(`${imgDir}/thumb`);
    }

    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});

export default app;
