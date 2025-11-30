import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Heading,
  VStack,
  useToast,
  FormControl,
  FormLabel,
  Text,
  Link,
  Divider,
  Flex
} from "@chakra-ui/react";
import useThemeValues from "../../hooks/useThemeValues"; // Reuse your dark/light mode styling
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { workoutState } from "../../Context/WorkoutProvider";


function SignUpForm() {
  const { cardBg, inputBg, textColor } = useThemeValues();
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setUser } = workoutState();
  

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async(e) => {
    e.preventDefault();

    const {name, username, email, password, confirmPassword } = formData;

    if ( !name || !username || !email || !password || !confirmPassword ) {
      toast({
        title: "Please fill in all fields.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: "Password must be at least 6 characters long.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setFormData({ ...formData, password: "", confirmPassword: "" });
      return;
    }
    if (!email.includes("@")) {
      toast({
        title: "Please enter a valid email address.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    

    try{
      const { confirmPassword, ...userData } = formData;
     const {data:response} = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/signup`, formData);
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      
       setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        
      });
      navigate("/login");
      
    }catch(error){
      toast({
        title: "Registration failed.",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGoogleSignup =useGoogleLogin({
      onSuccess: async (tokenResponse) => {
      try {      
        const  credential  = tokenResponse.access_token;
      const { data : response  } = await axios.post(
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
        pushSubscribed,
        avatar,
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
        pushSubscribed,
        avatar,
        ...(isProfileComplete && { age, height, weight, sex }),
      };

      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(userPayload));
      setUser(userPayload);

      toast({
        title: "Signup successful with Google!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      navigate(isProfileComplete ? "/workoutForm" : "/complete-profile");
    } catch (err) {
      toast({
        title: "Google Sign-UP failed",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }
  });


  return (
    <Box p={2} textAlign={"center"}>

    <Box p={4} maxW="500px" mx="auto" bg={cardBg} borderRadius="2xl" boxShadow="2xl">
      <Heading textAlign="center" mb={2} color={textColor}>
        Sign Up
      </Heading>
      <Text mb={4}>Already have an account? <Link 
          href="/login" 
          fontWeight="bold" 
          fontSize="lg" 
          textDecoration="underline"
          color={textColor}
          _hover={{ color: "blue.700" }}
        >  Login
        </Link></Text>


      <form onSubmit={submitHandler}>

<Button
      onClick={() => handleGoogleSignup()}
      leftIcon={
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          width="20"
          alt="google"
        />
      }
      variant="outline"
      colorScheme="blue"
      width="100%"
    >
      Sign Up with Google
    </Button>
      <Flex align="center" width="100%" >
  <Divider borderColor="gray.400" />
  <Text
    px={2}
    fontWeight="semibold"
    color={textColor}
    fontSize="sm"
    whiteSpace="nowrap"
    m={4}
  >
    OR
  </Text>
  <Divider borderColor="gray.300" />
</Flex>

      
        <VStack spacing={4}>
        <FormControl>
            <FormLabel color={textColor}>Full Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={changeHandler}
              bg={inputBg}
              color={textColor}
            />
          </FormControl>
          <FormControl>
            <FormLabel color={textColor}>Username</FormLabel>
            <Input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              bg={inputBg}
              color={textColor}
            />
          </FormControl>

          <FormControl>
            <FormLabel color={textColor}>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={changeHandler}
              bg={inputBg}
              color={textColor}
            />
          </FormControl>

          <FormControl>
            <FormLabel color={textColor}>Password</FormLabel>
            <InputGroup>
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            bg={inputBg}
            color={textColor}
            border="1px solid blackAlpha.300"
            value={formData.password}
            onChange={changeHandler}
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


          <FormControl>
            <FormLabel color={textColor}>Confirm Password</FormLabel>
            <InputGroup>
          <Input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            bg={inputBg}
            color={textColor}
            border="1px solid blackAlpha.300"
            value={formData.confirmPassword}
            onChange={changeHandler}
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

         

          <Button
            type="submit"
            w="100%"
            bgGradient="linear(to-r, purple.400, blue.400)"
            _hover={{ bgGradient: "linear(to-r, purple.500, blue.500)" }}
            color="white"
          >
            Register
          </Button>
        </VStack>
      </form>
  </Box>
   
    </Box>
  );
}

export default SignUpForm;
