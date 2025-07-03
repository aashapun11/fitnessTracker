import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

import {
  Box,
  Button,
  Input,
  InputGroup,
  Image,
  InputRightElement, 
  Heading,
  VStack,
  useToast,
  Text,
  Flex,
  Link,
  Divider
} from "@chakra-ui/react";
import useThemeValues from "../../hooks/useThemeValues"; // assuming you have this hook
import axios from "axios";
import { useNavigate} from "react-router-dom";
import LightMode from "../LightMode";
import { workoutState } from "../../Context/WorkoutProvider";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginForm() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const toast = useToast();
  const { cardBg, inputBg, textColor } = useThemeValues();
  const navigate = useNavigate();
  const { setUser } = workoutState();
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      toast({
        title: "Please fill in all fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    

    try {
      
      const {data:response} = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`, {
        username,
        password,
      });
          // Handle success: save token/user and redirect

      const {
        _id,
        name,
        username: uname,
        email,
        token,
        streak,
        isProfileComplete,
        age,
        height,
        weight,
        sex,
      } = response;

      const userPayload = {
        _id,
        name,
        username: uname,
        email,
        streak,
        ...(isProfileComplete && { age, height, weight, sex }),
      };

      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(userPayload));
      setUser(userPayload);

      toast({
        title: "Login successful!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      navigate(isProfileComplete ? "/workoutForm" : "/complete-profile");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Try again.";
      toast({
        title: `Login failed. ${errorMsg}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      if (errorMsg === "Email not verified") {
          navigate("/verification-pending");

      }
      
    }
  };



const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      const { data : response } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/google`,
        { token: credential }
      );

      const {
        _id,
        name,
        username: uname,
        email,
        token,
        streak,
        isProfileComplete,
        age,
        height,
        weight,
        sex,
      } = response;

      const userPayload = {
        _id,
        name,
        username: uname,
        email,
        streak,
        ...(isProfileComplete && { age, height, weight, sex }),
      };

      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(userPayload));
      setUser(userPayload);

      toast({
        title: "Login with Google successful!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      navigate(isProfileComplete ? "/workoutForm" : "/complete-profile");
    } catch (err) {
      toast({
        title: "Google Sign-In failed",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  return (
    <Box p={2} textAlign={"center"}>
     <LightMode />

    <Flex 
      minH="80vh" 
      align="center" 
      justify="center"
      bg={cardBg}
      p={4}
    >
      
      <Box
        maxW="400px"
        w="50%"
        bg={cardBg}
        borderRadius="2xl"
        p={4}
        boxShadow="2xl"
        justifyContent={"center"}
        alignItems={"center"}
        textAlign={"center"}

      >
        <Heading mb={2} color={textColor}>Login</Heading>
        <Text mb={2}>Don't have an account? <Link 
    href="/signup" 
    fontWeight="bold" 
    fontSize="lg" 
    textDecoration="underline"
    color={textColor}
    _hover={{ color: "blue.700" }}
  >  Sign Up
  </Link></Text>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Input
              name="username"
              placeholder="Username"
              bg={inputBg}
              color={textColor}
              border="1px solid blackAlpha.300"
              value={formData.username}
              onChange={handleChange}
            />
            <InputGroup>
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            bg={inputBg}
            color={textColor}
            border="1px solid blackAlpha.300"
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
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
            <Button
              type="submit"
              w="100%"
              bgGradient="linear(to-r, purple.400, blue.400)"
              _hover={{ bgGradient: "linear(to-r, purple.500, blue.500)" }}
              color={textColor}
            >
              Login
            </Button>


<Flex align="center" width="100%" >
  <Divider borderColor="gray.400" />
  <Text
    px={2}
    fontWeight="semibold"
    color={textColor}
    fontSize="sm"
    whiteSpace="nowrap"
  >
    OR
  </Text>
  <Divider borderColor="gray.300" />
</Flex>



<Box width="100%">
<GoogleLogin
    
      onSuccess={handleGoogleLogin}
      onError={() =>
        toast({
          title: "Google Sign-In failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        })

      }
     
    />

</Box>




            <Text fontSize="sm" textAlign="right">
  <Link color="blue.500" href="/forgot-password">Forgot Password?</Link>
</Text>

            
          </VStack>
        </form>
      </Box>
    </Flex>
    </Box>
  );
}

export default LoginForm;
