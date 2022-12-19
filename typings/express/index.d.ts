
import 'express';

declare module 'express' {
  interface Request {
    filename?: string;
    input?: string;
    output?: string;
    conversionWidth?: number;
    conversionHeight?: number;
  }
}
