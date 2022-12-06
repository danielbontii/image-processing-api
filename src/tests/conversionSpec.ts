//TODO: implement conversion tests

import supertest from 'supertest';
import app from '../server';

const req = supertest(app);

describe('Conversion enpoint provides the appropriate respone', () => {
  it('should return status code 200 after conversion is complete', async () => {
    const result = await req.get(
      '/img-pro-api/api/v1/convert/?filename=monkey&height=300&width=200'
    );
    expect(result.statusCode).toBe(200);
  });
  it('should serve original image with status code 200 if height and width are not provided', async () => {
    const result = await req.get(
      '/img-pro-api/api/v1/convert/?filename=monkey'
    );
    expect(result.statusCode).toBe(200);
  });
});
