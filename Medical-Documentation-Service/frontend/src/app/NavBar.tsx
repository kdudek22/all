"use client";

import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Avatar,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";

export const NavBar = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button sx={{ my: 2, color: "white", display: "block" }}>
              <Link href={`/medical-documentation`}>Medical Documentation</Link>
            </Button>
            <Button sx={{ my: 2, color: "white", display: "block" }}>
              <Link href={`/referrals`}>Referrals</Link>
            </Button>
            <Button sx={{ my: 2, color: "white", display: "block" }}>
              <Link href={`/prescriptions`}>Prescriptions</Link>
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
