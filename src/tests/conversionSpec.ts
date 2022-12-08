import supertest from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '../server';

const req = supertest(app);

beforeEach(() => {
  const thumDir = path.join(__dirname, '../images/thumb');
  const thumbs = fs.readdirSync(thumDir);
  if (thumbs.length > 0) {
    thumbs.forEach((thumb) => fs.unlinkSync(`${thumDir}/${thumb}`));
  }
});

describe('Conversion enpoint provides the appropriate response', () => {
  it('should return status code 400 if image is absent', async () => {
    const result = await req.get(
      '/img-pro-api/api/v1/convert/?filename=maxresdefault&height=300&width=200'
    );
    expect(result.statusCode).toBe(400);
  });

  it('should return status code 400 if extension is not supported', async () => {
    const result = await req.get(
      '/img-pro-api/api/v1/convert/?filename=default&height=300&width=200&type=SVR'
    );
    expect(result.statusCode).toBe(400);
  });

  it('should return status code 200 after conversion is complete', async () => {
    const result = await req.get(
      '/img-pro-api/api/v1/convert/?filename=default&height=300&width=200'
    );
    expect(result.statusCode).toBe(200);
  });

  it('should serve original image with status code 200 if height and width are not provided', async () => {
    const result = await req.get(
      '/img-pro-api/api/v1/convert/?filename=default'
    );
    expect(result.statusCode).toBe(200);
  });
});

describe('Conversion actually creates a new image', () => {
  const formats = ['JPEG', 'PNG', 'WebP', 'GIF', 'AVIF', 'TIFF'];

  formats.forEach((format) => {
    it(`should not create a ${format} image in the thumb directory after conversion if extension is not supported`, async () => {
      await req.get(
        '/img-pro-api/api/v1/convert/?filename=default&height=300&width=300'
      );
      expect(
        fs.existsSync(
          path.join(__dirname, `../images/thumb/default_300x300.${format}`)
        )
      ).toBeFalsy();
    });
  });

  formats.forEach((format) => {
    it(`should create a ${format} image in the thumb directory after conversion`, async () => {
      await req.get(
        `/img-pro-api/api/v1/convert/?filename=default&height=300&width=200&type=${format}`
      );
      expect(
        fs.existsSync(
          path.join(__dirname, `../images/thumb/default_200x300.${format}`)
        )
      ).toBeTruthy();
    });
  });
});
