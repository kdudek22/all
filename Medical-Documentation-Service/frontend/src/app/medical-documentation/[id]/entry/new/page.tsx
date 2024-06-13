"use client";

import {
  MedicalDocumentationEntry,
  NewMedicalDocumentationEntryForm,
} from "@/src/models/medicalDocumentationEntry";
import {
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { camelToSnake, getCurrentUserClient } from "@/src/utils/utils";

const sendNewMedicalDocumentationEntry = async (
  medicalDocumentationId: number,
  newEntry: Omit<MedicalDocumentationEntry, "id">
) => {
  const res = await fetch(
    "http://localhost:6969/medical-documentations/medical-documentation-entries",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "medical-documentation-id": String(medicalDocumentationId),
      },
      body: JSON.stringify(camelToSnake(newEntry)),
    }
  );

  return res.ok;
};

type MedicalDocumentationEntryNewProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: MedicalDocumentationEntryNewProps) {
  const { control, handleSubmit } = useForm<NewMedicalDocumentationEntryForm>({
    defaultValues: {
      medicalDocumentationId: Number(params.id),
      date: dayjs(),
    },
  });

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
      <Typography variant="h4">
        Add new medical documentation entry for medical documentation{" "}
        {params.id}
      </Typography>

      <Card>
        <form
          onSubmit={handleSubmit(async (values) => {
            const { date, ...valuesRest } = values;

            console.debug(values);

            await sendNewMedicalDocumentationEntry(
              values.medicalDocumentationId,
              {
                date: date.format("DD-MM-YYYY"),
                ...valuesRest,
              }
            );
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
              name="diagnose"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ m: 1 }}
                  label="Diagnose"
                  {...field}
                  onChange={(diagnose) => field.onChange(diagnose)}
                />
              )}
            />
            <Controller
              name="recommendations"
              control={control}
              render={({ field }) => (
                <TextField
                  sx={{ m: 1 }}
                  label="Recommendation"
                  {...field}
                  onChange={(recommendation) => field.onChange(recommendation)}
                />
              )}
            />
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ m: 1 }}
                    label="Date"
                    value={field.value}
                    inputRef={field.ref}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                  />
                </LocalizationProvider>
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
