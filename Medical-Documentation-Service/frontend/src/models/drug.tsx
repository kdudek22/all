import { z } from "zod";

export type Drug = {
  id: number;
  name: string;
};

export const NewDrugValidationSchema = z.object({
  name: z.string(),
});

export type NewdrugForm = z.infer<
  typeof NewDrugValidationSchema
>;
