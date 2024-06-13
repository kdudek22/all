import { MedicalDocumentation } from "@/src/models/medicalDocumentation";
import { mockMedicalDocumentationEntries } from "@/src/mocks/mockMedicalDocumentationEntry";

export const mockMedicalDocumentations: MedicalDocumentation[] = [
  {
    id: 301,
    patientId: "a5f96fd2-a29f-4d95-bdcb-1545b59310fd",
    medicalDocumentationEntries: mockMedicalDocumentationEntries.filter(
      (entry) => entry.medicalDocumentationId === 301
    ),
  },
  {
    id: 302,
    patientId: "a5f96fd2-a29f-4d95-bdcb-1545b59310fd",
    medicalDocumentationEntries: mockMedicalDocumentationEntries.filter(
      (entry) => entry.medicalDocumentationId === 302
    ),
  },
  {
    id: 303,
    patientId: "a5f96fd2-a29f-4d95-bdcb-1545b59310fd",
    medicalDocumentationEntries: mockMedicalDocumentationEntries.filter(
      (entry) => entry.medicalDocumentationId === 303
    ),
  },
  {
    id: 304,
    patientId: "a5f96fd2-a29f-4d95-bdcb-1545b59310fd",
    medicalDocumentationEntries: mockMedicalDocumentationEntries.filter(
      (entry) => entry.medicalDocumentationId === 304
    ),
  },
  {
    id: 305,
    patientId: "a5f96fd2-a29f-4d95-bdcb-1545b59310fd",
    medicalDocumentationEntries: mockMedicalDocumentationEntries.filter(
      (entry) => entry.medicalDocumentationId === 305
    ),
  },
  {
    id: 306,
    patientId: "a5f96fd2-a29f-4d95-bdcb-1545b59310fd",
    medicalDocumentationEntries: mockMedicalDocumentationEntries.filter(
      (entry) => entry.medicalDocumentationId === 306
    ),
  },
  {
    id: 307,
    patientId: "a5f96fd2-a29f-4d95-bdcb-1545b59310fd",
    medicalDocumentationEntries: mockMedicalDocumentationEntries.filter(
      (entry) => entry.medicalDocumentationId === 307
    ),
  },
];
