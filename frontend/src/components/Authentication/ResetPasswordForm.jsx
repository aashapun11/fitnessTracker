// pages/auth/ResetPasswordForm.jsx
import React, { useState } from "react";
import {
  Box, Input, Button, FormControl, FormLabel, Heading, useToast,
  InputGroup, InputRightElement
} from "@chakra-ui/react";
import { useSearchParams , useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEyeSlash, FaEye } from "react-icons/fa";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


const [searchParams] = useSearchParams();
const token = searchParams.get("token"); // ✅ Correct for query param 

  const navigate = useNavigate();
  const toast = useToast();

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/reset-password?token=${token}`, {
        newPassword: password,
      });
      toast({
        title: "Password reset successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Reset failed.",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={10}>
      <Heading mb={4}>Reset Password</Heading>
      <form onSubmit={handleReset}>
        <FormControl mb={4}>
          <FormLabel>New Password</FormLabel>
          <InputGroup>
          <Input
            name="password"
            type = {showPassword ? "text" : "password"}
            value= {password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <InputRightElement width="3rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        _hover={{ bg: "transparent" }}
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </Button>
                    </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl mb={4}>

          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
          <Input
            name="password"
            type = {showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <InputRightElement width="3rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        variant="ghost"
                        _hover={{ bg: "transparent" }}
                      >
                        {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                      </Button>
                    </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button type="submit" colorScheme="teal" width="100%">Reset Password</Button>
      </form>
    </Box>
  );
}

export default ResetPasswordForm;
