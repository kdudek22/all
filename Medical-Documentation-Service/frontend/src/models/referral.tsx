import { z } from "zod";

export type Referral = {
  id: number;
  doctorId: string;
  patientId: string;
  description: string;
};

export const NewReferralValidationSchema = z.object({
  patientName: z.string(),
  description: z.string(),
});

export type NewReferralForm = z.infer<typeof NewReferralValidationSchema>;
