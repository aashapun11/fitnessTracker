import React, { useState } from "react";
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
  Link
} from "@chakra-ui/react";
import useThemeValues from "../../hooks/useThemeValues"; // Reuse your dark/light mode styling
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function SignUpForm() {
  const { cardBg, inputBg, textColor } = useThemeValues();
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  

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
        duration: 3000,
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
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    

    try{
      const { confirmPassword, ...userData } = formData;
     await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/signup`, formData);
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
        status: "success",
        duration: 3000,
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
        description:  error.response?.data?.error || error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
