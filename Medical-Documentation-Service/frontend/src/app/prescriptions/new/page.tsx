"use client";

import {
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Autocomplete,
  Paper,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Prescription, NewPrescriptionForm } from "@/src/models/prescription";
import {
  camelToSnake,
  getCurrentUserClient,
  listPatients,
} from "@/src/utils/utils";
import { useEffect, useState } from "react";
import { Drug } from "@/src/models/drug";
import { User } from "@/src/models/user";

const sendNewPrescription = async (
  newPrescription: Omit<Prescription, "id">
) => {
  const res = await fetch("http://localhost:6969/prescriptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(camelToSnake(newPrescription)),
  });

  return res.ok;
};

export default function Page() {
  const { control, handleSubmit, getValues, setError, clearErrors } =
    useForm<NewPrescriptionForm>({});

  const [drugSuggestions, setDrugSuggestions] = useState<string[]>([]);

  const [patients, setPatients] = useState<User[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<User[]>(patients);

  const fetchDrugSuggestions = async () => {
    try {
      const response = await fetch(
        `http://localhost:6969/drugs?name=${getValues("drugName")}`
      );
      if (response.status === 404) {
        setError("drugName", {
          type: "manual",
          message: "Drug not found",
        });
        setDrugSuggestions([]);
      } else {
        const data = (await response.json()) as Drug[];
        const drugNames = data.map((drug) => drug.name);
        setDrugSuggestions(drugNames);
        clearErrors("drugName");
      }
    } catch (error) {
      setError("drugName", {
        type: "manual",
        message: "Error fetching drugs",
      });
    }
  };

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
      <Typography variant="h4">Add new prescription</Typography>

      <Card>
        <form
          onSubmit={handleSubmit(async (values) => {
            console.debug(values);
            const currentUser = await getCurrentUserClient();
            if (!currentUser || currentUser.role !== "doctor") return;

            const patientId = patients.find(
              (patient) => patient.name === values.patientName
            )?.id;
            if (!patientId) return;

            const newPrescription = {
              doctorId: currentUser.id,
              patientId: patientId,
              drugName: values.drugName,
              description: values.description,
            } as Omit<Prescription, "id">;
            await sendNewPrescription(newPrescription);
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
                  onInputChange={(event, value) => {
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
              name="drugName"
              control={control}
              render={({ field, fieldState }) => (
                <Autocomplete
                  options={drugSuggestions}
                  sx={{ m: 1, width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Drug"
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error ? fieldState.error.message : ""
                      }
                    />
                  )}
                  noOptionsText=""
                  PaperComponent={({ children }) =>
                    drugSuggestions.length === 0 ? null : (
                      <Paper>{children}</Paper>
                    )
                  }
                  onInputChange={(event, value) => {
                    field.onChange(value);
                    fetchDrugSuggestions();
                  }}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ m: 1, width: 300 }}
                  label="Description"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
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
