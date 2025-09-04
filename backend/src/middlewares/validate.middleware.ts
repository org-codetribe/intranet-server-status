import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

type ValidationSchemas = {
  body?: Schema;
  query?: Schema;
  params?: Schema;
};

export const validate =
  (schemas: ValidationSchemas) =>
  (req: Request, res: Response, next: NextFunction) => {
    const sources: (keyof ValidationSchemas)[] = ["body", "query", "params"];

    for (const source of sources) {
      const schema = schemas[source];
      if (!schema) continue;

      const { error, value } = schema.validate(req[source], {
        abortEarly: false, // collect all errors
        allowUnknown: false, // block unknown fields
        stripUnknown: true, // remove unknown fields
      });

      if (error) {
        return res.status(400).json({
          error: "Validation Error",
          details: error.details.map((d) => d.message),
        });
      }

      // replace request source with validated + sanitized values
      (req as any)[source] = value;
    }

    return next();
  };
