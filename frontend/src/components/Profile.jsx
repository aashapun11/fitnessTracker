import {
    Box,
    Avatar,
    Text,
    Heading,
    SimpleGrid,
    Input,
    FormControl,
    FormLabel,
    VStack,
    HStack,
    Select,
    Button,
  } from "@chakra-ui/react";
  import Navbar from "./Navbar";
  import { useState, useEffect } from "react";
  import axios from "axios";
  import { useToast } from "@chakra-ui/react";
  import {useNavigate} from "react-router-dom"
  import { workoutState } from "../Context/WorkoutProvider";
  import { FiCamera } from "react-icons/fi";
  
  function ProfilePage() {

    const { user, setUser } = workoutState();
    const [preview, setPreview] = useState(user?.avatar || "");
    const [selectedFile, setSelectedFile] = useState(null);
     const toast = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
  name: "",
  weight: "",
  height: "",
  age: "",
  sex: "",
  avatar:""
});

    
  
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
          const { data:response } = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/auth/updateProfile`, formData, config);
      
           const updatedUser = {
        _id: response._id,
        name: response.name,
        age: response.age,
        height: response.height,
        weight: response.weight,
        sex: response.sex,
        email: response.email,
        username: response.username,
        streak: response.streak,
        pushSubscribed: response.pushSubscribed,
        avatar: response.avatar,

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
            description: error.response?.data?.message || error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      };

       const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if(file.size > maxSize){
        toast({
          title: "File size limit exceeded.",
          description: "Please select a file smaller than 2MB.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setSelectedFile(file);
      // preview
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);

      // auto-upload right after selection
      uploadAvatar(file);
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const data = new FormData();
      data.append("avatar", file);

      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/updateAvatar`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );


      
const updatedUser = { ...user, avatar: res.secure_url };
setUser(updatedUser);
localStorage.setItem("userInfo", JSON.stringify(updatedUser));

            
     toast({
        title: "Profile picture updated!",
        status: "success",
        duration: 2000,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to update picture",
        status: "error",
      });
    }
  };



       useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        weight: user.weight || "",
        height: user.height || "",
        age: user.age || "",
        sex: user.sex || "",
      });
    }
  }, [user]);
  
    return (
      <>
        <Navbar />
        <Box p={6} maxW="700px" mx="auto" textAlign="center">
          <Heading fontSize="xl" mb={4}>
            Basic Information
          </Heading>
          
          <Box position={"relative"} display={"inline-block"}   role="group">
          <Avatar size={"2xl"} src={preview} name={formData.name} />
          {/* //Hidden input fields */}
    <Input id="avatar-upload" type="file" accept="image/*"  display="none"  onChange={handleFileChange}/>
    <Box
    as="label"
    htmlFor="avatar-upload"
    position="absolute"
    top={0}
    left={0}
    w="100%"
    h="100%"
    bg="blackAlpha.800"
    display="flex"
    alignItems="center"
    justifyContent="center"
    opacity={0}
    transition="opacity 0.3s"
    cursor="pointer"
    _groupHover={{ opacity: 1 }} 
    borderRadius="full"
  >
    <VStack spacing={1}><FiCamera size="20px" color="white" />
  <Text color="white" fontWeight="bold">
    Edit
  </Text></VStack>
  
  </Box>

          </Box>
          {/* Username display */}
  <Text mt={4} fontSize="xl" fontWeight="semibold">
    @{user.username}
  </Text>
          
          
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
  
              <SimpleGrid columns={3} spacing={3}>
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
