import React, { useEffect, useState } from 'react'
import { Stack, HStack, Box, Text, Select, Button, Heading, useToast, SimpleGrid} from '@chakra-ui/react'
import useThemeValues from '../hooks/useThemeValues'
import { workoutState } from '../Context/WorkoutProvider'
import axios from 'axios'
import { NavLink, useNavigate} from 'react-router-dom'
import Navbar from './Navbar'


function WorkoutList() {
  const toast = useToast();
    const { cardBg, input, inputBg, textColor } = useThemeValues();
    
    const { workouts, setWorkouts } = workoutState();
    const navigate = useNavigate();

    const [showAll, setShowAll] = useState(true);
    const [filterType, setFilterType] = useState("");
    const filteredWorkouts = workouts.filter((w) => w.activity === filterType);
    useEffect(() => {
      async function fetchWorkouts() {
       
        
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          }
          const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/workouts/getWorkouts`, config);
          setWorkouts(data);
        } catch (error) {
          toast({
            title: "Failed to fetch workouts.",
            description: error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          
        }
      }
    
      fetchWorkouts();
    }, []);
    

  return (
  <Box minH="100vh" bg={cardBg} p={6}>
    <Navbar />

<Heading color={textColor} size="lg" justifyContent={"center"} textAlign={"center"} m={6}>
        My Workout History
      </Heading>
  <Box maxW="1000px" mx="auto" mt={8} >
    {/* Controls */}
    <HStack spacing={4} mb={8} flexWrap="wrap" justifyContent="center">
      <Select
        placeholder="Filter by type"
        value={filterType}
        onChange={(e) => {
          setFilterType(e.target.value);
          setShowAll(false);
        }}
        bg={inputBg}
        color={textColor}
        border="1px solid"
        borderColor="gray.300"
        maxW="200px"
      >
         <option style={{ color: "black" }} value="Running">Running</option>
              <option style={{ color: "black" }} value="Cycling">Cycling</option>
              <option style={{ color: "black" }} value="Walking">Walking</option>
              <option style={{ color: "black" }} value="Pushups">Pushups</option>
              <option style={{ color: "black" }} value="MountainClimb">MountainClimb</option>
              <option style={{ color: "black" }} value="Burpees">Burpees</option>

      </Select>

      <Button
        bgGradient="linear(to-r, blue.400, purple.400)"
        _hover={{ bgGradient: "linear(to-r, blue.500, purple.500)" }}
        color="white"
        onClick={() => {
          if (workouts.length === 0) {
            toast({
              title: "No records to Show.",
              status: "info",
              duration: 2000,
              isClosable: true,
            });
            return;
          }
          setFilterType("");
          setShowAll(true);
        }}
      >
        All Workouts
      </Button>

      <Button
        bgGradient="linear(to-r, red.400, orange.400)"
        _hover={{ bgGradient: "linear(to-r, red.500, orange.500)" }}
        color="white"
        onClick={async () => {
          if (workouts.length === 0) {
            toast({
              title: "No records to clear.",
              status: "info",
              duration: 2000,
              isClosable: true,
            });
            return;
          }
          const confirmDelete = window.confirm("Are you sure you want to delete all workouts?");
          if (!confirmDelete) return;

          try {
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/workouts/deleteWorkouts`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            toast({
              title: "All records cleared.",
              status: "info",
              duration: 2000,
              isClosable: true,
            });
            setWorkouts([]);
          } catch (error) {
            toast({
              title: "Error clearing records.",
              description: error.message,
              status: "error",
              duration: 2000,
              isClosable: true,
            });
          }
        }}
      >
        Clear All
      </Button>
    </HStack>

    {/* Workout Cards */}
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>

      {(showAll ? workouts : filteredWorkouts).length === 0 ? (
        <Text color={textColor} fontSize="lg" textAlign="center" gridColumn="1 / -1">
          No data available.
        </Text>
      ) : (
        (showAll ? workouts : filteredWorkouts)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((w, index) => (
            <Box
              key={index}
              bg={cardBg}
              p={6}
              borderRadius="2xl"
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.200"
              transition="all 0.2s"
              _hover={{ boxShadow: "xl", transform: "scale(1.01)" }}
            >
              <Stack spacing={2} mb={4} textAlign="left">
                <Text><b>Date:</b> {new Date(w.date).toISOString().split('T')[0]}</Text>
                <Text><b>Activity:</b> {w.activity}</Text>
                <Text><b>Duration:</b> {w.duration} min</Text>
                <Text color="purple.600" fontWeight="bold"><b>Calories Burned:</b> 🔥 {w.calories}</Text>
              </Stack>

              <HStack spacing={4} justifyContent="left">
                <Button
                  size="sm"
                  bgGradient="linear(to-r, purple.400, blue.400)"
                  _hover={{ bgGradient: "linear(to-r, purple.500, blue.500)" }}
                  color="white"
                  onClick={async () => {
                    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
                    if (!confirmDelete) return;
                    try {

                      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/workouts/deleteWorkout/${w._id}`,
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                        }
                      );
                      toast({
                        title: "Record deleted successfully.",
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                      });
                      setWorkouts(workouts.filter((workout) => workout._id !== w._id));
                    } catch (error) {
                      toast({
                        title: "Error deleting record.",
                        description: error.message,
                        status: "error",
                        duration: 2000,
                        isClosable: true,
                      });
                    }
                  }}
                >
                  Delete
                </Button>

                <Button
                  size="sm"
                  bgGradient="linear(to-r, purple.400, blue.400)"
                  _hover={{ bgGradient: "linear(to-r, purple.500, blue.500)" }}
                  color="white"
                  as={NavLink}
                  to={`/updateWorkout/${w._id}`}
                >
                  Update
                </Button>
              </HStack>
            </Box>
          ))
      )}
    </SimpleGrid>

  </Box>
</Box>

  )
}

export default WorkoutList