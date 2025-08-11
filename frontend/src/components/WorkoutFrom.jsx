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
    exercise_type: "",
    activity: "",
    duration: "",
    sets: "",
    reps: "",
    equipmentWeight: "",

  }); 

  const activityOptions = {
    Cardio: ["Running", "Cycling", "Walking", "Swimming", "Plank"],
    Strength: ["Pushups", "MountainClimb", "Burpees", "Squats","JumpingJacks", "Pullups", "Lunges"],
    WeightTraining: ["Deadlifts", "BenchPress", "DumpbellPress", "LegPress"],
  }

  const toast = useToast();
  const [showStreakModal, setShowStreakModal] = useState(false);

  const { workouts, setWorkouts, user, setUser } = workoutState();

  const { cardBg, inputBg, textColor } = useThemeValues();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const [playStreakSound] = useSound(streakSound);
  const navigate = useNavigate();


  const submitHandler = async(e) => {
    e.preventDefault();

const { date, activity, exercise_type, duration, sets, reps, equipmentWeight} = formData;
if(exercise_type === "Cardio"){
  if (!date || !activity || !duration) {
      toast({
        title: "Please fill in all fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
} 
else if(exercise_type === "Strength"){
  if (!date || !activity || !sets || !reps) {
    toast({
      title: "Please fill in all fields.",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
    return;
  }
}
else if(exercise_type === "WeightTraining"){
  if (!date || !activity ||  !sets || !reps || !equipmentWeight) {
    toast({
      title: "Please fill in all fields.",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
    return;
  }
}
    
    
    

   let calories = 0;

    calories = CalorieCalculate({ activity, duration, exercise_type, sets, reps, equipmentWeight, user });
    

const workoutData = {
  date,
  exercise_type,
  activity,
  duration: Number(duration),
  sets: sets ? Number(sets) : null,
  reps: reps ? Number(reps) : null,
  equipmentWeight: equipmentWeight ? Number(equipmentWeight) : null,
  calories: calories
};
    
    
//backend call with node.js
    try{
      const config = {
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      
      const  {data} = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/workouts/addWorkout`, workoutData, config);

      const {fitness, streak} = data;
      console.log(data);
      
     setWorkouts([...workouts, fitness]);
     // ✅ Update user streak in context and localStorage
    const currentStreak = Number(user?.streak) || 0;

     if(streak > currentStreak){

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
setFormData({
  date: "",
  activity: "",
  exercise_type: "",
  duration: "",
  sets: "",
  reps: "",
  equipmentWeight: ""
});

    

    
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

      <Heading mt={12}>💪 My Fitness Tracker</Heading>
      <Text m={2}>Track your workout & progress easily!</Text>
      <Box
        maxW="500px"
        mx="auto"
        bg={cardBg}
        borderRadius="2xl"
        p={6}
        boxShadow="2xl"
        mb={10}
        mt={18}
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
{/* Exercise Type */}
            <Select
              name="exercise_type"
              type="text"
              value={formData.exercise_type}
              onChange={changeHandler}
              placeholder="Select exercise type"
              bg={inputBg}
              color={textColor}
              border="1px solid blackAlpha.300"
            >
              <option style={{ color: "black" }} value="Cardio">Cardio</option>
               <option style={{ color: "black" }} value="Strength">Strength</option>
              <option style={{ color: "black" }} value="WeightTraining">Weight Training</option>
            </Select>

{/* Exercise activity as per the exercise_type */}
{formData.exercise_type &&(
  <Select
    name="activity"
    type="text"
    value={formData.activity}
    onChange={changeHandler}
    placeholder={`Enter ${formData.exercise_type} activity`}
    bg={inputBg}
    color={textColor}
    border="1px solid blackAlpha.300"
  >
    {activityOptions[formData.exercise_type]?.map((activity) => (
      <option style={{ color: "black" }} key={activity} value={activity}>
        {activity}
      </option>
    ))}
    </Select>



)}
        

            {/* Show these fields conditionally */}
{formData.exercise_type === "Cardio" && (
  <>
 
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
  </>
)}

{formData.exercise_type === "Strength" && (
  <>
    <Input
      name="sets"
      type="number"
      value={formData.sets}
      onChange={changeHandler}
      placeholder="Sets"
      bg={inputBg}
      color={textColor}
      border="1px solid blackAlpha.300"
    />
    <Input
      name="reps"
      type="number"
      value={formData.reps}
      onChange={changeHandler}
      placeholder="Reps"
      bg={inputBg}
      color={textColor}
      border="1px solid blackAlpha.300"
    />
   
  </>
)}

{formData.exercise_type === "WeightTraining" && (
  <>
    <Input
      name="sets"
      type="number"
      value={formData.sets}
      onChange={changeHandler}
      placeholder="Sets"
      bg={inputBg}
      color={textColor}
      border="1px solid blackAlpha.300"
    />
    <Input
      name="reps"
      type="number"
      value={formData.reps}
      onChange={changeHandler}
      placeholder="Reps"
      bg={inputBg}
      color={textColor}
      border="1px solid blackAlpha.300"
    />
    <Input
      name="equipmentWeight"
      type="number"
      value={formData.equipmentWeight}
      onChange={changeHandler}
      placeholder="Weight of Equipment (kg)"
      bg={inputBg}
      color={textColor}
      border="1px solid blackAlpha.300"
    />
  </>
)}

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

     
      <StreakRewardModal
  isOpen={showStreakModal}
  onClose={() => setShowStreakModal(false)}
  streak={user?.streak}
/>
    </Box>
  );
}

export default WorkoutForm;
