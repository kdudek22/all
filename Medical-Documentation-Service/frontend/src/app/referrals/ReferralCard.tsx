import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Referral } from "@/src/models/referral";
import { listDoctors, listPatients } from "@/src/utils/utils";

interface ReferralCardProps {
  referral: Referral;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ referral }) => {
  const [doctorName, setDoctorName] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");

  useEffect(() => {
    const fetchDoctorName = async () => {
      const doctors = await listDoctors()
      const doctor = doctors.find((doctor) => doctor.id === referral.doctorId);
      if (doctor) {
        setDoctorName(doctor.name);
      }
    }
    const fetchPatientName = async () => {
      const patients = await listPatients();
      const patient = patients.find((patient) => patient.id === referral.patientId);
      if (patient) {
        setPatientName(patient.name);
      }
    }

    fetchDoctorName();
    fetchPatientName();
  }, []);
  
  return (
    <Card sx={{ m: 1, width: "100%" }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          Referral #{referral.id}
        </Typography>
        <Typography variant="body1" component="p">
          Doctor: {doctorName}
        </Typography>
        <Typography variant="body1" component="p">
          Patient: {patientName}
        </Typography>
        <Typography variant="body1" component="p">
          Description: {referral.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReferralCard;
