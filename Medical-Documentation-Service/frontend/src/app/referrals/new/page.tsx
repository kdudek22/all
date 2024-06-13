"use client";

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
import { Controller, useForm } from "react-hook-form";
import { NewReferralForm, Referral } from "@/src/models/referral";
import {
  camelToSnake,
  getCurrentUserClient,
  listPatients,
} from "@/src/utils/utils";
import { User } from "@/src/models/user";
import { useState, useEffect } from "react";

const sendNewReferral = async (newReferral: Omit<Referral, "id">) => {
  const res = await fetch("http://localhost:6969/referrals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(camelToSnake(newReferral)),
  });
  return res.ok;
};

export default function Page() {
  const { control, handleSubmit, setError } = useForm<NewReferralForm>();
  const [patients, setPatients] = useState<User[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<User[]>(patients);

  useEffect(() => {
    const fetchPatients = async () => {
      setPatients(await listPatients());
    };
    fetchPatients();
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h4">Add new referral</Typography>

      <Card>
        <form
          onSubmit={handleSubmit(async (values) => {
            console.debug(values);
            const currentUser = await getCurrentUserClient();
            if (!currentUser || currentUser.role !== "doctor") return;

            const patient = patients.find(
              (patient) => patient.name === values.patientName
            );
            if (!patient) return;

            const newReferral = {
              doctorId: currentUser.id,
              patientId: patient.id,
              description: values.description,
            };

            await sendNewReferral(newReferral);
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
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ m: 1, width: 300}}
                  label="Description"
                  {...field}
                  onChange={(diagnose) => field.onChange(diagnose)}
                />
              )}
            />
            <Button variant="contained" type="submit" sx={{ m: 1 }}>
              Submit
            </Button>
          </CardContent>
        </form>
      </Card>
    </Container>
  );
}
