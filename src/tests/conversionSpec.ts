import supertest from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '../server';

const req = supertest(app);
const apiBase = '/img-pro-api/api/v1/convert/?filename=default';
const formats = ['jpeg', 'png', 'webp', 'gif', 'avif', 'tiff'];
let testImg;

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
    const result = await req.get(`${apiBase}&height=300&width=200&output=SVR`);
    expect(result.statusCode).toBe(400);
  });

  it('should return status code 200 after conversion is complete', async () => {
    const result = await req.get(`${apiBase}&height=300&width=200`);
    expect(result.statusCode).toBe(200);
  });

  it('should return status code 200 if height and width are not provided', async () => {
    const result = await req.get(apiBase);
    expect(result.statusCode).toBe(200);
  });
});

describe('Conversion actually creates a new image', () => {
  it(`should not create image in the thumb directory if extension is not supported`, async () => {
    await req.get(`${apiBase}&height=300&width=300&output=SVRRR`);
    expect(
      fs.existsSync(
        path.join(__dirname, `../images/thumb/default_300x300.SVRRR`)
      )
    ).toBeFalsy();
  });

  formats.forEach((format) => {
    it(`should create a ${format} image in the thumb directory after conversion`, async () => {
      await req.get(`${apiBase}&height=300&width=200&output=${format}`);
      expect(
        fs.existsSync(
          path.join(__dirname, `../images/thumb/default_200x300.${format}`)
        )
      ).toBeTruthy();
    });
  });
});

describe('Conversion from one supported type to another', () => {
  it('should not convert input extension is not supported', async () => {
    await req.get(`${apiBase}&height=150&width=150&input=vsn&output=png`);
    expect(
      fs.existsSync(path.join(__dirname, `../images/thumb/default_150x150.png`))
    ).toBeFalsy();
  });

  it('should not convert if  output extension is not supported', async () => {
    await req.get(`${apiBase}&height=150&width=150&input=png&output=tdd`);
    expect(
      fs.existsSync(path.join(__dirname, `../images/thumb/default_150x150.png`))
    ).toBeFalsy();
  });

  it('should convert jpeg to specified format if input is missing', async () => {
    await req.get(`${apiBase}&height=450&width=450&output=png`);
    expect(
      fs.existsSync(path.join(__dirname, `../images/thumb/default_450x450.png`))
    ).toBeTruthy();
  });

  for (let i = 0; i < formats.length; i++) {
    const output = formats[formats.length - 1 - i];
    const input = formats[i];

    it(`should be able to convert from ${input} to ${output}`, async () => {
      await req.get(
        `${apiBase}&height=250&width=200&input=${input}&output=${output}`
      );
      expect(
        fs.existsSync(
          path.join(__dirname, `../images/thumb/default_200x250.${output}`)
        )
      ).toBeTruthy();
    });
  }
});

describe('Dynmically handling image sizes', () => {
  it('should work with just width specified', async() => {
    testImg = `${apiBase}&width=140&input=jpeg&output=png`;
    await req.get(testImg);
    let result = await req.get(`${apiBase}&height=auto&width=140input=jpeg&output=png`);
    expect(result.statusCode).toBe(200);
    result = await req.get(`${apiBase}&width=140input=jpeg&output=png`);
    expect(result.statusCode).toBe(200);
    expect(
      fs.existsSync(
        path.join(__dirname, `../images/thumb/default_140xauto.png`)
      )
    ).toBeTruthy();
  })

  it('should work with height specified and width set to auto', async() => {
    testImg = `${apiBase}&height=160&&width=auto&input=jpeg&output=tiff`;
    await req.get(testImg);
    let result = await req.get(`${apiBase}&height=160&input=jpeg&output=png`);
    expect(result.statusCode).toBe(200);
    result = await req.get(`${apiBase}&width=auto&height=160input=jpeg&output=png`);
    expect(result.statusCode).toBe(200);
    expect(
      fs.existsSync(
        path.join(__dirname, `../images/thumb/default_140xauto.png`)
      )
    ).toBeTruthy();
  })

  it('should dynamically calculate height given width', async () => {
    testImg = `${apiBase}&height=150&input=jpeg&output=png`;
    await req.get(testImg);
    expect(
      fs.existsSync(
        path.join(__dirname, `../images/thumb/default_autox150.png`)
      )
    ).toBeTruthy();
  });

  it('should dynamically calculate width given height', async () => {
    testImg = `${apiBase}&width=300&input=jpeg&output=png`;
    await req.get(testImg);
    expect(
      fs.existsSync(
        path.join(__dirname, `../images/thumb/default_300xauto.png`)
      )
    ).toBeTruthy();
  });
});
