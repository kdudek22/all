"use client";

import { mockPrescriptions } from "@/src/mocks/mockPrescriptions";
import { getCurrentUserClient, listPatients, snakeToCamel } from "@/src/utils/utils";
import { Container, Typography, Card, CardContent, Paper, TextField, Autocomplete, Button } from "@mui/material";
import { PrescriptionCard } from "./PrescriptionCard";
import { Prescription } from "@/src/models/prescription";
import { LinkButton } from "../components/LinkButton";
import { User } from "@/src/models/user";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const getPrescriptions = async (patientId: string) => {
  const res = await fetch(
    `http://localhost:6969/prescriptions?` +
      new URLSearchParams({
        patient_id: patientId,
      }),
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (res.ok) return snakeToCamel(await res.json()) as Prescription[];
  else console.error("Failed to fetch prescriptions:", res.statusText);

  return (
    mockPrescriptions.filter(
      (prescription) => prescription.patientId === patientId
    ) ?? null
  );
};

export default function Page() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    getCurrentUserClient().then((u) => setCurrentUser(u));
  }, []);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<User[]>(patients);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  useEffect(() => {
    listPatients().then((p) => {
      setPatients(p);
      setFilteredPatients(p);
    }
    );
  }, []);
  useEffect(() => {
    if (!currentUser) return;
    getPrescriptions(currentUser.id).then((r) => setPrescriptions(r));
  }, [currentUser]);

  const {handleSubmit, control, setError } = useForm<{
    patientName: String;
  }>();

  if (!currentUser) return null;

  if (currentUser.role === "patient") {
    return (
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">
          Prescriptions for user {currentUser.name}
        </Typography>
        {prescriptions.map((prescription) => {
          return (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
            />
          );
        })}
      </Container>
    );
  }

  if (currentUser.role === "doctor") {
    return (
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
         <Card>
          <form
            onSubmit={handleSubmit(async ({ patientName }) => {
              const patient = patients.find(
                (patient) => patient.name === patientName
              );
              if (!patient) return;

              const referals = await getPrescriptions(
                patient.id
              );
              setSelectedPatient(patient);
              setPrescriptions(referals);
            })}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Controller
                name="patientName"
                control={control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    options={filteredPatients.map((patient) => patient.name)}
                    sx={{ m: 1, width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Patient"
                        error={!!fieldState.error}
                        helperText={
                          fieldState.error ? fieldState.error.message : ""
                        }
                      />
                    )}
                    noOptionsText=""
                    PaperComponent={({ children }) =>
                      filteredPatients.length === 0 ? null : (
                        <Paper>{children}</Paper>
                      )
                    }
                    onInputChange={(_, value) => {
                      field.onChange(value);
                      const newFilteredPatients = patients.filter((patient) =>
                        patient.name.startsWith(value)
                      );
                      setFilteredPatients(newFilteredPatients);

                      if (newFilteredPatients.length === 0) {
                        setError("patientName", {
                          type: "manual",
                          message: "Patient not found",
                        });
                      }
                    }}
                  />
                )}
              />
              <Button variant="contained" type="submit" sx={{ m: 1 }}>
                Select patient
              </Button>
            </CardContent>
          </form>
        </Card>
        {prescriptions && selectedPatient && (
          <>
          <Typography variant="h4">
            Prescriptions for user {selectedPatient.name}
          </Typography>
        {prescriptions.map((prescription) => {
          return (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
            />
          );
        })}
        <LinkButton linkProps={{ href: `/prescriptions/new` }}>
          Add new prescription
        </LinkButton>
        </>)}
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4">
        Prescriptions for user {currentUser.name}
      </Typography>
      {prescriptions.map((prescription) => {
        return (
          <PrescriptionCard key={prescription.id} prescription={prescription} />
        );
      })}

      <LinkButton linkProps={{ href: `/prescriptions/new` }}>
        Add new prescription
      </LinkButton>
    </Container>
  );
}
