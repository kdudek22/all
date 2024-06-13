import dayjs, { Dayjs } from "dayjs";
import { z } from "zod";

export type MedicalDocumentationEntry = {
  id: number;
  date: string;
  diagnose: string;
  recommendations: string;
  medicalDocumentationId: number;
};

export const NewMedicalDocumentationEntryValidationSchema = z.object({
  date: z.custom<Dayjs>((val) => val instanceof dayjs, "Invalid date"),
  diagnose: z.string(),
  recommendations: z.string(),
  medicalDocumentationId: z.number(),
});

export type NewMedicalDocumentationEntryForm = z.infer<
  typeof NewMedicalDocumentationEntryValidationSchema
>;
