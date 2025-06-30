import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { workoutState } from '../Context/WorkoutProvider'
import { useState } from 'react'
import { Box, Button, Input, Select, Text, Heading, VStack, HStack, useToast } from '@chakra-ui/react'
import useThemeValues from '../hooks/useThemeValues'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'

import CalorieCalculate from '../utils/CalorieCalculate'
import axios from 'axios'
const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD


function UpdateWorkout() {
    const {id} = useParams();
    const {workouts, setWorkouts, user} = workoutState();
    const {inputBg, textColor, cardBg} = useThemeValues();

    const toast = useToast();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: "",
        activity: "",
        duration: "",
      });

     
      
      async function updateHandler(e) {
          e.preventDefault();

          const { date, activity, duration } = formData;
          if (!date || !activity || !duration) {
            toast({
              title: "Please fill in all fields.",
              status: "warning",
              duration: 3000,
              isClosable: true,
            });
            return;
          }
          const calories = CalorieCalculate({activity,duration, user});
          const updatedData = { date, activity, duration, calories};
          
          try {
            const config = {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
            const { data: updatedWorkout } = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/workouts/updateWorkout/${id}`, updatedData,
              config
            );
            toast({
              title: "Record updated successfully.",
              status: "success",
              duration: 2000,
              isClosable: true,
            });
            setWorkouts(
                workouts.map((workout) =>
                  workout._id === updatedWorkout._id ? updatedWorkout : workout
                )
              );
              navigate("/workoutList");
          } catch (error) {
            toast({
              title: "Error updating record.",
              description: error.message,
              status: "error",
              duration: 2000,
              isClosable: true,
            });
          }

      }

      useEffect(() => {
        async function getWorkouts() {
          await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/workouts/getWorkout/${id}`,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((res) => setFormData(res.data));
        }
        getWorkouts();    

      }, [workouts]);
    
      const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
   
  return (

    <Box
      
    p={4}
    textAlign={"center"}
    
    color={textColor}
  >

<Navbar/>

    <Heading>Update Workout</Heading>
     <Box
            maxW="500px"
            mx="auto"
            bg={cardBg}
            borderRadius="2xl"
            p={6}
            boxShadow="2xl"
            mb={10}
            mt={10}
          >
            
      <form onSubmit={updateHandler}>
          <VStack spacing={4}>
            <Input
              name="date"
              type="date"
              max={today} // restricts future dates

              value={formData.date ? new Date(formData.date).toLocaleDateString("en-CA") : ""}
              onChange={changeHandler}
              placeholder="Enter today's date"
              bg={inputBg}
              _placeholder={{ color: "blackAlpha.800" }}
              color={textColor}
              border="1px solid blackAlpha.300"
            />
            <Select
              name="activity"
              type="text"
              value={formData.activity}
              onChange={changeHandler}
              placeholder="Select workout type"
              bg={inputBg}
              color={textColor}
              border="1px solid blackAlpha.300"
            >
             <option style={{ color: "black" }} value="Running">Running</option>
              <option style={{ color: "black" }} value="Cycling">Cycling</option>
              <option style={{ color: "black" }} value="Walking">Walking</option>
              <option style={{ color: "black" }} value="Pushups">Pushups</option>
              <option style={{ color: "black" }} value="MountainClimb">MountainClimb</option>
              <option style={{ color: "black" }} value="Burpees">Burpees</option>
            </Select>
            
            <Input
              name="duration"
              type="number"
              value={formData.duration}
              onChange={changeHandler}
              placeholder="Duration (in minutes)" 
              bg={inputBg}
              color={textColor}
              border="1px solid blackAlpha.300"
            />
            <Button
              type="submit"
              bgGradient="linear(to-r, purple.400, blue.400)"
              _hover={{ bgGradient: "linear(to-r, purple.500, blue.500)" }}
              color={textColor}
              w="100%"
            >
              Update Workout
            </Button>
          </VStack>
        </form>
    </Box>
    </Box>
  )
}

export default UpdateWorkout