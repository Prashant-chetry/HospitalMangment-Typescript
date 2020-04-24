import { Request, Response, NextFunction } from 'express';
import ApiResponses from '../db/models/apiResponses/collection';
export default async function RequestLogger(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { rawHeaders, ip, body, originalUrl, method } = req;
  try {
    const doc = new ApiResponses({
      url: originalUrl,
      headers: rawHeaders,
      client: ip || '',
      body,
      method,
      pid: process.pid,
      processingTime: new Date(),
    });
    await doc.save();
    next();
  } catch (error) {
    next();
  }
}
