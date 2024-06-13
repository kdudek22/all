export type User = {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
};
