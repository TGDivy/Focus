import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { auth } from "./Common/Firestore/firebase-config";
import { Stack } from "@mui/system";

const LoginPage = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        console.log("popup result");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container>
      <Stack
        spacing={2}
        alignContent="center"
        justifyContent="center"
        textAlign="center"
        sx={{
          height: "90vh",
        }}
      >
        <Box
          sx={{
            height: "20vh",
          }}
        >
          <Typography variant="h2">Welcome to GROW!</Typography>
        </Box>

        <Typography variant="h4" component="h1">
          Sign in or Sign up
        </Typography>

        <Button variant="contained" size="large" disabled>
          with Email (coming soon)
        </Button>
        <Typography variant="h6" component="h2">
          or
        </Typography>
        <Button variant="contained" onClick={signInWithGoogle} size="large">
          with Google
        </Button>
        <Box
          sx={{
            height: "20vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" component="h2">
            GROW is a web app that helps you track your progress in your
            personal growth journey.
          </Typography>
          <Typography variant="h6" component="h2">
            Its fundamental principle is to compete with yourself, not with
            others.
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default LoginPage;
