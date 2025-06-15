// pages/auth/ForgotPasswordForm.jsx
import React, { useState } from "react";
import {
  Box, Input, Button, FormControl, FormLabel, Heading, useToast
} from "@chakra-ui/react";
import axios from "axios";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/auth/forgot-password", { email });
      toast({
        title: "Reset link sent.",
        description: "Check your inbox for the password reset link.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Failed to send reset link.",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setEmail("");

  };

  return (
    <Box maxW="400px" mx="auto" mt={10}>
      <Heading mb={4}>Forgot Password</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" width="100%">Send Reset Link</Button>
      </form>
    </Box>
  );
}

export default ForgotPasswordForm;
