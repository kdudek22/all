import { MedicalDocumentationEntry } from "./medicalDocumentationEntry";

export type MedicalDocumentation = {
  id: number;
  patientId: string;
  medicalDocumentationEntries: MedicalDocumentationEntry[];
};
