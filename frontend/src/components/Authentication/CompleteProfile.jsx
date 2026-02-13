import { useState} from "react";
import {
  Box,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  VStack,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { workoutState } from "../../Context/WorkoutProvider"; // adjust path as needed
import useThemeValues from "../../hooks/useThemeValues";

function CompleteProfile() {
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = workoutState();
  const {textColor, inputTextColor} = useThemeValues();

  const [profileData, setProfileData] = useState({
    age: "",
    height: "",
    weight: "",
    sex: "",
  });

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast({
        title: "Unauthorized",
        description: "Please log in again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }
    const { age, height, weight, sex } = profileData;

    if(!age || !height || !weight || !sex) {
      toast({
        title: "Invalid input",
        description: "Please enter valid and complete profile data",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
      return;
    }

    // Simple input validation
    if (+age <= 0 || +height <= 0 || +weight <= 0 || !sex) {
      toast({
        title: "Invalid input",
        description: "Please enter valid and complete profile data.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const { data: response } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/complete-profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update user in context and localStorage
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
        title: "Profile completed!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      navigate("/workoutForm");
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Failed to complete profile.";
      toast({
        title: "Error",
        description: errMsg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="500px" mx="auto" mt={10} p={6} borderRadius="2xl" boxShadow="xl" color={textColor}>
      <Heading textAlign="center" mb={6}>
        Complete Your Profile
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Age</FormLabel>
            <Input
              type="number"
              name="age"
              min={1}
              value={profileData.age}
              onChange={handleChange}
              color={inputTextColor}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Height (cm)</FormLabel>
            <Input
              type="number"
              name="height"
              min={1}
              value={profileData.height}
              onChange={handleChange}
              color={inputTextColor}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Weight (kg)</FormLabel>
            <Input
              type="number"
              name="weight"
              min={1}
              value={profileData.weight}
              onChange={handleChange}
              color={inputTextColor}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Sex</FormLabel>
            <Select
              name="sex"
              value={profileData.sex}
              onChange={handleChange}
              placeholder="Select sex"
              color={inputTextColor}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </FormControl>

          <Button
            type="submit"
            width="100%"
           variant={"primary"}
          >
            Save Profile
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default CompleteProfile;
