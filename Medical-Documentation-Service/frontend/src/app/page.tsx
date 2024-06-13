import { Container, Typography } from "@mui/material";

export default function Home() {
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
      <Typography variant="h4">Medical Documentation Service</Typography>
    </Container>
  );
}
