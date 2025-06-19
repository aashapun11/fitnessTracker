import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Select,
  Text,
  Heading,
  VStack,
  HStack,
  useToast
} from "@chakra-ui/react";

import useThemeValues from "../hooks/useThemeValues";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { workoutState } from "../Context/WorkoutProvider";
import axios from "axios";
import CalorieCalculate from "../utils/CalorieCalculate";
import Navbar from "./Navbar";
import StreakRewardModal from "./StreakRewardModal";
import useSound from 'use-sound';
import streakSound from '/sound/streak.mp3';

 

function WorkoutForm() {
  const [formData, setFormData] = useState({
    date: "",
    activity: "",
    duration: "",
  }); 
  const toast = useToast();
  const [showStreakModal, setShowStreakModal] = useState(false);

  const { workouts, setWorkouts, user, setUser } = workoutState();

  const { cardBg, inputBg, textColor } = useThemeValues();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const [playStreakSound] = useSound(streakSound);
  const navigate = useNavigate();


  const submitHandler = async(e) => {
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
    

    const calories = CalorieCalculate({activity, duration, user});
    const workoutData = { date, activity,  duration, calories};
    
    
//backend call with node.js
    try{
      const config = {
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      
      const  {data} = await axios.post("http://localhost:3000/api/workouts/addWorkout", workoutData, config);

      const {fitness, streak} = data;
     setWorkouts([...workouts, fitness]);
     // ✅ Update user streak in context and localStorage

     if(streak > user.streak){

      const updatedUser = { ...user, streak };
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      playStreakSound();

      setShowStreakModal(true);
      setTimeout(() => {
  navigate("/dashboard");
}, 3000);
toast({
        title: "Workout added!",
        status: "success",
        duration: 2000,
        isClosable: true,
      })

     }
     else{
      toast({
        title: "Workout added!",
        status: "success",
        duration: 2000,
        isClosable: true,
      })
      navigate("/dashboard");

     }


      

    }catch(err){
      toast({
        title: "Error: " + err,
        status: "error",
        duration: 2000,
        isClosable: true,
      })
    }
    setFormData({ date: "", activity: "", duration: "" });

    

    
  };

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

      <Heading mt={4}>My Fitness Tracker</Heading>
      <Text mt={2}>Track your workout & progress easily!</Text>
      <Box
        maxW="500px"
        mx="auto"
        bg={cardBg}
        borderRadius="2xl"
        p={6}
        boxShadow="2xl"
        mb={10}
      >
        
        <form onSubmit={submitHandler}>
          <VStack spacing={4}>
            <Input
              name="date"
              type="date"
              max={today} // restricts future dates
              value={formData.date}
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
              Add Exercise
            </Button>
          </VStack>
        </form>
      </Box>

      {/* Filter and controls */}
      <Box maxW="700px" mx="auto" mb={6}>
        <HStack spacing={4} mb={4} justifyContent={"center"}>
          <Button
            bgGradient="linear(to-r, blue.400, purple.400)"
            _hover={{ bgGradient: "linear(to-r, blue.500, purple.500)" }}
            color={textColor}
          >
            <NavLink to="/workoutList">
            Show Workouts History
            </NavLink>
          </Button>

          <Button 
           bgGradient="linear(to-r, blue.400, purple.400)"
           _hover={{ bgGradient: "linear(to-r, blue.500, purple.500)" }}
          color={textColor}
          
          >
            <NavLink to="/progressGraph" state={{ workouts }}>
            Show Progress Graph
            </NavLink>
            
          </Button>
        </HStack>

        

       
      </Box>
      <StreakRewardModal
  isOpen={showStreakModal}
  onClose={() => setShowStreakModal(false)}
  streak={user?.streak}
/>
    </Box>
  );
}

export default WorkoutForm;
