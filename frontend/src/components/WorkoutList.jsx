import React, { useEffect, useState } from 'react'
import { Stack, HStack, Flex,Box, Text,  Button, Heading, useToast, SimpleGrid, Grid} from '@chakra-ui/react'
import useThemeValues from '../hooks/useThemeValues'
import { workoutState } from '../Context/WorkoutProvider'
import axios from 'axios'
import { NavLink, useNavigate} from 'react-router-dom'
import DateSelector from './DateSelector'
import Navbar from './Navbar'


function WorkoutList() {
  const toast = useToast();
    const { cardBg, textColor, inputBg } = useThemeValues();
    
    const { workouts, setWorkouts } = workoutState();
    const [searchWorkouts, setSearchWorkouts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const navigate = useNavigate();
    const [totals, setTotals] = useState({
  totalTime: 0,
  totalExercises: 0,
  totalCalories: 0,
  totalSets: 0,
});

    useEffect(() => {
    const filteredWorkouts = workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return (
        workoutDate.getFullYear() === selectedDate.getFullYear() &&
        workoutDate.getMonth() === selectedDate.getMonth() &&
        workoutDate.getDate() === selectedDate.getDate()
      );
    })

    setSearchWorkouts(filteredWorkouts);


    // Calculate totals
  let totalTime = 0;
let totalExercises = filteredWorkouts.length;
let totalCalories = 0;
let totalSets = 0;

filteredWorkouts.forEach((w) => {
  // Always count calories if present
  totalCalories += Number(w.calories) || 0;

  if (w.exercise_type === "Cardio") {
    totalTime += Number(w.duration) || 0;
  } else {
    totalSets += Number(w.sets) || 0;
  }
});

// Optional: round once at the end
setTotals({
  totalTime,
  totalExercises,
  totalCalories: Number(totalCalories.toFixed(2)),
  totalSets,
});
    }, [workouts, selectedDate]);
    
    

  return (
  <Box minH="100vh" bg={cardBg} p={6}>
    <Navbar />

<Heading color={textColor} size="lg" justifyContent={"center"} textAlign={"center"} m={4}>
        My Workouts Summary
      </Heading>
  <Box maxW="1000px" mx="auto" mt={4} >

    <HStack spacing={4}  flexWrap="wrap" justifyContent="center">
   <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
    </HStack>

  
<Box
      bg={cardBg}
      p={4}
      borderRadius="xl"
      boxShadow="2xl"
      w="full"
      maxW="600px"
      mx="auto"
    >
  
<Grid templateColumns="repeat(2, 1fr)" gap={4}>
    <Box
      p={4}
      borderRadius="md"
      bg={inputBg}
      textAlign="center"
      boxShadow="sm"
    >
      <Text fontSize="sm" color={textColor}>
        Active Time
      </Text>
      <Text fontSize="lg" fontWeight="bold" color={textColor}>
        {totals.totalTime} mins
      </Text>
    </Box>

    <Box
      p={4}
      borderRadius="md"
      bg={inputBg}
      textAlign="center"
      boxShadow="sm"
    >
      <Text fontSize="sm" color={textColor}>
        Exercises
      </Text>
      <Text fontSize="lg" fontWeight="bold" color={textColor}>
        {totals.totalExercises}
      </Text>
    </Box>

    <Box
      p={4}
      borderRadius="md"
      bg={inputBg}
      textAlign="center"
      boxShadow="sm"
    >
      <Text fontSize="sm" color={textColor}>
        Calories Burned
      </Text>
      <Text fontSize="lg" fontWeight="bold" color={textColor}>
        {totals.totalCalories} kcal
      </Text>
    </Box>

    <Box
      p={4}
      borderRadius="md"
      bg={inputBg}
      textAlign="center"
      boxShadow="sm"
    >
      <Text fontSize="sm" color={textColor}>
        Sets
      </Text>
      <Text fontSize="lg" fontWeight="bold" color={textColor}>
        {totals.totalSets}
      </Text>
    </Box>
  </Grid>
</Box>
    {/* Controls */}
    <HStack spacing={4} mb={8} flexWrap="wrap" justifyContent="center">
     

      
    </HStack>

    {/* Workout Cards */}
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>

      {searchWorkouts.length === 0 ? (
        <Text color={textColor} fontSize="lg" textAlign="center" gridColumn="1 / -1">
          No data available.
        </Text>
      ) : (
        
        searchWorkouts.map((w, index) => (
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
              {(w.exercise_type === "Cardio") ?(
                <Stack spacing={2} mb={4} textAlign="left">
                <Text><b>Activity:</b> {w.activity}</Text>
                <Text><b>Duration:</b> {w.duration} <b>Minutes</b></Text>
                <Text color="purple.600" fontWeight="bold"><b>Calories Burned:</b> 🔥 {w.calories}</Text>
              </Stack> 
               ): (
                 <Stack spacing={2} mb={4} textAlign="left">
                <Text><b>Activity:</b> {w.activity}</Text>
                <Text><b>Sets:</b> {w.sets}</Text>
                <Text><b>Reps:</b> {w.reps}</Text>
              </Stack> 

               )}
              

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