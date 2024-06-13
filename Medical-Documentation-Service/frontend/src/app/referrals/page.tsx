"use client";

import { mockReferrals } from "@/src/mocks/mockReferrals";
import { getCurrentUserClient, listPatients, snakeToCamel } from "@/src/utils/utils";
import { Container, Typography, Card, CardContent, Paper, TextField, Autocomplete, Button } from "@mui/material";
import ReferralCard from "./ReferralCard";
import { Referral } from "@/src/models/referral";
import { LinkButton } from "../components/LinkButton";
import { useEffect, useState } from "react";
import { User } from "@/src/models/user";
import { Controller, useForm } from "react-hook-form";
import { set } from "zod";

const getReferrals = async (patientId: string) => {
  const res = await fetch(
    `http://localhost:6969/referrals?` +
      new URLSearchParams({
        patient_id: patientId,
      }),
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (res.ok) return snakeToCamel(await res.json()) as Referral[];
  else console.error("Failed to fetch referrals:", res.statusText);

  return (
    mockReferrals.filter((referral) => referral.patientId === patientId) ?? null
  );
};

export default function Page() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    getCurrentUserClient().then((u) => setCurrentUser(u));
  }, []);

  const [referrals, setReferrals] = useState<Referral[]>([]);
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
    getReferrals(currentUser.id).then((r) => setReferrals(r));
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
          Referrals for user {currentUser.name}
        </Typography>
        {referrals.map((referral) => {
          return <ReferralCard key={referral.id} referral={referral} />;
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

              const referals = await getReferrals(
                patient.id
              );
              setSelectedPatient(patient);
              setReferrals(referals);
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
        {referrals && selectedPatient && (
          <>
          <Typography variant="h4">
            Referrals for user {selectedPatient.name}
          </Typography>
          {referrals.map((referral) => {
            return <ReferralCard key={referral.id} referral={referral} />;
          })}
          <LinkButton linkProps={{ href: `/referrals/new` }}>
            Add new referral
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
        Referrals for user {currentUser.name}
      </Typography>
      {referrals.map((referral) => {
        return <ReferralCard key={referral.id} referral={referral} />;
      })}

      <LinkButton linkProps={{ href: `/referrals/new` }}>
        Add new referral
      </LinkButton>
    </Container>
  );
}
