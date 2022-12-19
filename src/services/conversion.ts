import sharp from 'sharp';
import path from 'path';

const convert = async (
  filename: string | undefined,
  conversionWidth: number | undefined,
  conversionHeight: number | undefined,
  output: string,
  input: string
): Promise<string> => {
  try {
    const inputPath: string = path.join(
      __dirname,
      `../images/${filename}.${input}`
    );

    const outputPath = path.join(
      __dirname,
      `../images/thumb/${filename}_${conversionWidth ?? 'auto'}x${
        conversionHeight ?? 'auto'
      }.${output}`
    );

    await sharp(inputPath)
      .resize(conversionWidth, conversionHeight, {
        kernel: sharp.kernel.nearest,
        fit: 'cover'
      })
      .toFile(outputPath);
    return outputPath;
  } catch (error) {
    console.log(error);
    throw new Error('something went wrong');
  }
};

export default {convert};
