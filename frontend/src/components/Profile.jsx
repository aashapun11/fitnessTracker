import {
    Box,
    Avatar,
    Heading,
    SimpleGrid,
    Input,
    FormControl,
    FormLabel,
    Flex,
    VStack,
    Select,
    Button,
  } from "@chakra-ui/react";
  import Navbar from "./Navbar";
  import { useState, useEffect } from "react";
  import axios from "axios";
  import { useToast } from "@chakra-ui/react";
  import {useNavigate} from "react-router-dom"
  import { workoutState } from "../Context/WorkoutProvider";
  
  
  function ProfilePage() {

    const { user, setUser } = workoutState();

    const [formData, setFormData] = useState({
  name: "",
  email: "",
  weight: "",
  height: "",
  age: "",
  sex: "",
});

    const toast = useToast();
    const navigate = useNavigate();

     useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        weight: user.weight || "",
        height: user.height || "",
        age: user.age || "",
        sex: user.sex || "",
      });
    }
  }, [user]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
          const token = localStorage.getItem("token"); // or stored user token
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };

          // Make the API call
          const { data:response } = await axios.put("http://localhost:3000/api/auth/updateProfile", formData, config);
      
           const updatedUser = {
        _id: response._id,
        name: response.name,
        username: response.username,
        email: response.email,
        age: response.age,
        height: response.height,
        weight: response.weight,
        sex: response.sex,
      };

      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setUser(updatedUser);

      
          toast({
            title: "Profile updated successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          })
          navigate("/workoutList");
        } catch (error) {
          console.error(error);
          toast({
            title: "Failed to update profile",
            description: error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      };
  
    return (
      <>
        <Navbar />
        <Box p={6} maxW="700px" mx="auto" textAlign="center">
          <Heading fontSize="xl" mb={4}>
            Profile Information
          </Heading>
          <Avatar size="2xl" name={formData.name} />
  
          <form onSubmit={submitHandler}>
            <VStack spacing={4} align="stretch" mt={6} alignItems="center">
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormControl>
  
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormControl>
  
              <SimpleGrid columns={3} spacing={4}>
                <FormControl>
                  <FormLabel>Weight (kg)</FormLabel>
                  <Input
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </FormControl>
  
                <FormControl>
                  <FormLabel>Height (cm)</FormLabel>
                  <Input
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </FormControl>
  
                <FormControl>
                  <FormLabel>Age (Years)</FormLabel>
                  <Input
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </FormControl>
              </SimpleGrid>
  
              <FormControl>
                <FormLabel>Gender</FormLabel>
                <Select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
              </FormControl>
  
              <Button
                type="submit"
                w="50%"
                mt={4}
                bgGradient="linear(to-r, purple.400, blue.400)"
                _hover={{ bgGradient: "linear(to-r, purple.500, blue.500)" }}
                color="white"
              >
                Save
              </Button>
            </VStack>
          </form>
        </Box>
      </>
    );
  }
  
  export default ProfilePage;
