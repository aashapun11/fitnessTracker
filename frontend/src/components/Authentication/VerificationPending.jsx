// src/pages/VerificationPending.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Image,
  useToast,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import useThemeValues from "../../hooks/useThemeValues";

function VerificationPending() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
const { cardBg, inputBg, textColor } = useThemeValues();
  

  const handleResend = async () => {
    if (!email) {
      toast({
        title: "Email missing.",
        description: "Please enter your email.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/api/auth/resend-verification", {
        email
      });

      toast({
        title: "Verification email resent!",
        description: "Check your inbox (or spam folder).",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Failed to resend email.",
        description: "Try again later.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center"  p={4}>
      <Box maxW="md" p={6} borderRadius="xl"  shadow="lg" textAlign="center" bg={cardBg}>
        <Image
          src="/email.png" // Replace with your image path or icon
          alt="Email expired"
          mx="auto"
          boxSize="120px"
          mb={4}
        />
        <Heading size="md" mb={2}>Email verification link expired?</Heading>
        <Text fontSize="sm" mb={4}>
         Don’t worry, we can send you a new one.
        </Text>

        <Input 
          placeholder="Email"
          value={email}
          type="email"
          bg={inputBg}
          color={textColor}

          onChange={(e) => setEmail(e.target.value)}
        border="1px solid blackAlpha.300"

          mb={2}
          w="100%"
        />

        <Button
          colorScheme="blue"
          onClick={handleResend}
          isLoading={loading}
          mb={2}
          w="100%"
           bgGradient="linear(to-r, purple.400, blue.400)"
              _hover={{ bgGradient: "linear(to-r, purple.500, blue.500)" }}
              color={textColor}
        >
          Resend Verification Link
        </Button>

      </Box>
    </Box>
  );
}

export default VerificationPending;
