import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Prescription } from "@/src/models/prescription";
import { listDoctors, listPatients, snakeToCamel } from "@/src/utils/utils";
import { Drug } from "@/src/models/drug";

interface PrescriptionCardProps {
  prescription: Prescription;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
}) => {
  const [doctorName, setDoctorName] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [drug, setDrug] = useState<Drug | null>(null);

  useEffect(() => {
    const fetchDoctorName = async () => {
      const doctors = await listDoctors();
      const doctor = doctors.find(
        (doctor) => doctor.id === prescription.doctorId
      );
      if (doctor) {
        setDoctorName(doctor.name);
      }
    };
    const fetchPatientName = async () => {
      const patients = await listPatients();
      const patient = patients.find(
        (patient) => patient.id === prescription.patientId
      );
      if (patient) {
        setPatientName(patient.name);
      }
    };
    const fetchDrug = async () => {
      const res = await fetch(
        `http://localhost:6969/drugs/${prescription.drugId}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (res.ok) setDrug(snakeToCamel(await res.json()) as Drug);
      else console.error("Failed to fetch prescriptions:", res.statusText);
    };

    fetchDoctorName();
    fetchPatientName();
    fetchDrug();
  }, []);

  return (
    <Card sx={{ m: 1, width: "100%" }} className="prescription-card">
      <CardContent>
        <Typography variant="h5" component="h2">
          Prescription #{prescription.id}
        </Typography>
        <Typography variant="body1" component="p">
          Doctor: {doctorName}
        </Typography>
        <Typography variant="body1" component="p">
          Patient: {patientName}
        </Typography>
        <Typography variant="body1" component="p">
          Drug: {drug?.name}
        </Typography>
        <Typography variant="body1" component="p">
          Description: {prescription.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PrescriptionCard;
