import supertest from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '../server';

const req = supertest(app);
const apiBase = '/img-pro-api/api/v1/convert/?filename=default';
const formats = ['jpeg', 'png', 'webp', 'gif', 'avif', 'tiff'];
let testImg: string | null;
const imgBase = path.join(__dirname, '../images/thumb/default');

afterEach(() => {
  if (testImg && fs.existsSync(testImg)) {
    fs.unlinkSync(testImg);
  }
  testImg = null;
});

describe('Conversion enpoint provides the appropriate response', () => {
  it('should return status code 400 if image is absent', async () => {
    const result = await req.get(
      '/img-pro-api/api/v1/convert/?filename=maxresdefault&height=300&width=200'
    );
    testImg = `${imgBase}_200x300.jpeg`;
    expect(result.statusCode).toBe(400);
  });

  it('should return status code 400 if extension is not supported', async () => {
    const result = await req.get(`${apiBase}&height=300&width=200&output=SVR`);
    testImg = `${imgBase}_200x300.svr`;
    expect(result.statusCode).toBe(400);
  });

  it('should return status code 200 after conversion is complete', async () => {
    const result = await req.get(`${apiBase}&height=300&width=200`);
    testImg = `${imgBase}_200x300.jpeg`;
    expect(result.statusCode).toBe(200);
  });

  it('should return status code 200 if height and width are not provided', async () => {
    const result = await req.get(apiBase);
    expect(result.statusCode).toBe(200);
  });

  it('should return status code 400 if height is invalid', async () => {
    const result = await req.get(`${apiBase}&height=300&width=200&output=png&height=myheight`);
    testImg = `${imgBase}_200x300.png`;
    expect(result.statusCode).toBe(400);
  });

  it('should return status code 400 if width is invalid', async () => {
    const result = await req.get(`${apiBase}&height=300&width=customwidth&output=png&height=500`);
    testImg = `${imgBase}_200x300.png`;
    expect(result.statusCode).toBe(400);
  });
});

describe('Conversion actually creates a new image', () => {
  it(`should not create image in the thumb directory if extension is not supported`, async () => {
    await req.get(`${apiBase}&height=300&width=300&output=SVRRR`);
    testImg = `${imgBase}_300x300.svrrr`;
    expect(fs.existsSync(`${imgBase}_300x300.SVRRR`)).toBeFalsy();
  });

  formats.forEach((format) => {
    it(`should create a ${format} image in the thumb directory after conversion`, async () => {
      await req.get(`${apiBase}&height=300&width=200&output=${format}`);
      testImg = `${imgBase}_200x300.${format}`;
      expect(fs.existsSync(`${imgBase}_200x300.${format}`)).toBeTruthy();
    });
  });
});

describe('Conversion from one supported type to another', () => {
  it('should convert default if filename is missing', async () => {
    await req.get(
      `/img-pro-api/api/v1/convert/?height=150&width=150&input=tiff&output=avif`
    );
    testImg = `${imgBase}_150x150.avif`;
    expect(fs.existsSync(testImg)).toBeTruthy();
  });

  it('should not convert if input extension is not supported', async () => {
    await req.get(`${apiBase}&height=150&width=150&input=vsn&output=png`);
    testImg = `${imgBase}_150x150.png`;
    expect(fs.existsSync(testImg)).toBeFalsy();
  });

  it('should not convert if  output extension is not supported', async () => {
    await req.get(`${apiBase}&height=150&width=150&input=png&output=tdd`);
    testImg = `${imgBase}_150x150.tdd`;
    expect(fs.existsSync(testImg)).toBeFalsy();
  });

  it('should convert jpeg to specified format if input is missing', async () => {
    await req.get(`${apiBase}&height=450&width=450&output=png`);
    testImg = `${imgBase}_450x450.png`;
    expect(fs.existsSync(testImg)).toBeTruthy();
  });

  for (let i = 0; i < formats.length; i++) {
    const output = formats[formats.length - 1 - i];
    const input = formats[i];

    it(`should be able to convert from ${input} to ${output}`, async () => {
      await req.get(
        `${apiBase}&height=250&width=200&input=${input}&output=${output}`
      );
      testImg = `${imgBase}_200x250.${output}`;
      expect(fs.existsSync(testImg)).toBeTruthy();
    });
  }
});

describe('Dynmically handling image sizes', () => {
  it('should work with just width specified', async () => {
    await req.get(`${apiBase}&width=140&input=jpeg&output=png`);
    let result = await req.get(
      `${apiBase}&height=auto&width=140input=jpeg&output=png`
    );
    expect(result.statusCode).toBe(200);
    testImg = `${imgBase}_140xauto.png`;
    if (fs.existsSync(testImg)) {
      fs.unlinkSync(testImg);
    }
    result = await req.get(`${apiBase}&width=140input=jpeg&output=png`);
    testImg = `${imgBase}_140xauto.png`;
    expect(result.statusCode).toBe(200);
    expect(fs.existsSync(testImg)).toBeTruthy();
  });

  it('should work with height specified and width set to auto', async () => {
    await req.get(`${apiBase}&height=160&width=auto&input=jpeg&output=tiff`);
    let result = await req.get(`${apiBase}&height=160&input=jpeg&output=tiff`);
    expect(result.statusCode).toBe(200);
    testImg = `${imgBase}_autox160.tiff`;
    if (fs.existsSync(testImg)) {
      fs.unlinkSync(testImg);
    }
    result = await req.get(
      `${apiBase}&width=auto&height=160input=jpeg&output=png`
    );
    testImg = `${imgBase}_autox160.png`;
    expect(result.statusCode).toBe(200);
    expect(fs.existsSync(testImg)).toBeTruthy();
  });

  it('should dynamically calculate height given width', async () => {
    await req.get(`${apiBase}&height=150&input=jpeg&output=png`);
    testImg = `${imgBase}_autox150.png`;
    expect(fs.existsSync(testImg)).toBeTruthy();
  });

  it('should dynamically calculate width given height', async () => {
    await req.get(`${apiBase}&width=300&input=jpeg&output=png`);
    testImg = `${imgBase}_300xauto.png`;
    expect(fs.existsSync(testImg)).toBeTruthy();
  });
});
