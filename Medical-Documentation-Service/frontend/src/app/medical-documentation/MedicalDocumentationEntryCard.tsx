import { MedicalDocumentationEntry } from "@/src/models/medicalDocumentationEntry";
import { Card, CardContent, Typography } from "@mui/material";

type MedicalDocumentationEntryCardProps = { entry: MedicalDocumentationEntry };

export const MedicalDocumentationEntryCard = ({
  entry,
}: MedicalDocumentationEntryCardProps) => {
  return (
    <Card sx={{ m: 1, width: "100%" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          ID: {entry.id} related to medical documentation ID:{" "}
          {entry.medicalDocumentationId}
        </Typography>
        <Typography variant="h5" component="div">
          Date: {new Date(entry.date).toLocaleDateString()}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Diagnose: {entry.diagnose}
        </Typography>
        <Typography variant="body2">
          Recommendation: {entry.recommendations}
        </Typography>
      </CardContent>
    </Card>
  );
};
