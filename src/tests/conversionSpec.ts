import supertest from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '../server';

const req = supertest(app);
const apiBase = '/img-pro-api/api/v1/convert/?filename=default';
const formats = ['jpg', 'png', 'webp', 'gif', 'avif', 'tiff'];

// beforeEach(() => {
//   const thumDir = path.join(__dirname, '../images/thumb');
//   const thumbs = fs.readdirSync(thumDir);
//   if (thumbs.length > 0) {
//     thumbs.forEach((thumb) => fs.unlinkSync(`${thumDir}/${thumb}`));
//   }
// });

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
  it(`should not create image in the thumb directory if extension is not supported`, async () => {
    await req.get(
      '/img-pro-api/api/v1/convert/?filename=default&height=300&width=300&type=SVRRR'
    );
    expect(
      fs.existsSync(
        path.join(__dirname, `../images/thumb/default_300x300.SVRRR`)
      )
    ).toBeFalsy();
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

describe('Conversion from one supported type to another', () => {
  for (let i = 0; i < formats.length; i++) {
    const output = formats[formats.length -1 - i];
    const input = formats[i];

    it(`should be able to convert from ${input} to ${output}`, async () => {
      await req.get(
        `${apiBase}&height=250&width=250&input=${input}&output=${output}`
      );
      expect(
        fs.existsSync(
          path.join(__dirname, `../images/thumb/default_250x250.${output}`)
        )
      ).toBeTruthy();
    });
  }
});
