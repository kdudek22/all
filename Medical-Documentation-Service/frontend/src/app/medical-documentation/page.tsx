"use client";

import { mockMedicalDocumentations } from "@/src/mocks/mockMedicalDocumentations";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { MedicalDocumentationEntryCard } from "./MedicalDocumentationEntryCard";
import {
  getCurrentUserClient,
  listPatients,
  snakeToCamel,
} from "@/src/utils/utils";
import { MedicalDocumentation } from "@/src/models/medicalDocumentation";
import { LinkButton } from "../components/LinkButton";
import { User } from "@/src/models/user";
import { useState, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

const getMedicalDocumentation = async (patientId: string) => {
  const res = await fetch(
    `http://localhost:6969/medical-documentations?` +
      new URLSearchParams({
        user_id: patientId,
      }),
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (res.ok) return snakeToCamel(await res.json()) as MedicalDocumentation;
  else console.error("Failed to fetch medical documentation:", res.statusText);

  return (
    mockMedicalDocumentations
      .filter(
        (medicalDocumentation) => medicalDocumentation.patientId === patientId
      )
      .pop() ?? null
  );
};

// type MedicalDocumentationProps = {
//   params: {
//     id: number;
//   };
// };

export default function Page() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    getCurrentUserClient().then((u) => setCurrentUser(u));
  }, []);

  const [patients, setPatients] = useState<User[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<User[]>(patients);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  useEffect(() => {
    listPatients().then((p) => {
      setPatients(p);
      setFilteredPatients(p);
    });
  }, []);

  const [medicalDocumentation, setMedicalDocumentation] =
    useState<MedicalDocumentation | null>(null);
  useEffect(() => {
    if (!currentUser || currentUser.role === "doctor") return;
    getMedicalDocumentation(currentUser.id).then((r) =>
      setMedicalDocumentation(r)
    );
  }, [currentUser]);

  const { handleSubmit, control, setError } = useForm<{
    patientName: string;
  }>();

  if (!currentUser) return null;

  if (currentUser.role === "doctor") {
    return (
      <Container
        maxWidth="xl"
        sx={{
          m: 1,
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

              const patientMedicalDocumentation = await getMedicalDocumentation(
                patient.id
              );
              setSelectedPatient(patient);
              setMedicalDocumentation(patientMedicalDocumentation);
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
        {medicalDocumentation && selectedPatient && (
          <>
            <Typography variant="h4">
              Medical documentation for user {selectedPatient.name}
            </Typography>

            {medicalDocumentation.medicalDocumentationEntries.map((entry) => {
              return (
                <MedicalDocumentationEntryCard key={entry.id} entry={entry} />
              );
            })}
            <LinkButton
              linkProps={{
                href: `/medical-documentation/${medicalDocumentation.id}/entry/new`,
              }}
            >
              Add new medical documentation entry
            </LinkButton>
          </>
        )}
      </Container>
    );
  }

  if (!medicalDocumentation)
    return (
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h4">
          Medical documentation not found for user {currentUser.name}
        </Typography>
      </Container>
    );

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
        Medical documentation for user {currentUser.name}
      </Typography>

      {medicalDocumentation.medicalDocumentationEntries.map((entry) => {
        return <MedicalDocumentationEntryCard key={entry.id} entry={entry} />;
      })}
    </Container>
  );
}
