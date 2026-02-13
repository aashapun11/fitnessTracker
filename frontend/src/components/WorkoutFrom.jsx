import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Select,
  Text,
  Heading,
  VStack,
  useToast
} from "@chakra-ui/react";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import useThemeValues from "../hooks/useThemeValues";
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
    intensity: ""
  }); 

  const activityOptions = {
    Cardio: ["Running", "Cycling", "Walking", "Swimming", "Plank"],
    Strength: ["Pushups", "MountainClimb", "Burpees", "Squats","JumpingJacks", "Pullups", "Lunges"]
  }

  const toast = useToast();
  const [showStreakModal, setShowStreakModal] = useState(false);

  const { workouts, setWorkouts, user, setUser } = workoutState();

  const { bg, cardBg, inputBg, textColor,inputTextColor } = useThemeValues();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const [playStreakSound] = useSound(streakSound);
  const navigate = useNavigate();


  const submitHandler = async(e) => {
    e.preventDefault();

const { date, activity, exercise_type, duration, sets, reps, intensity} = formData;

let calories = 0;

calories = CalorieCalculate({ activity, duration, exercise_type, intensity, user });
    

const workoutData = {
  date,
  exercise_type,
  activity,
  duration: Number(duration),
  sets: sets ? Number(sets) : null,
  reps: reps ? Number(reps) : null,
  intensity: intensity ? (intensity) : null,
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
      
     setWorkouts([...workouts, fitness]);
     // Update user streak in context and localStorage
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
  intensity: ""
});
    
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


   useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    axios.get(`${import.meta.env.VITE_SERVER_URL}/api/notifications/getNotifications`, config).then(res => {
      const welcomeNote = res.data.find(
        n => n.type === "welcome" && !n.isRead
      );

      if (welcomeNote) {
        toast({
          title: welcomeNote.title,
          description: welcomeNote.message,
          status: "info",
          duration: 3000,
          position: "top",
          isClosable: true
        });

        axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/notifications/markNotificationAsRead/${welcomeNote._id}`, {}, config);
      }
    });
  }, []);

  return (
    <Box
    
      textAlign={"center"}
      color={textColor}
      minH="100vh"
      
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
              color={inputTextColor}
              baseStyle="primary"
              required
            />
{/* Exercise Type */}
            <Select
              name="exercise_type"
              type="text"
              value={formData.exercise_type}
              onChange={changeHandler}
              placeholder="Select exercise type"
              bg={inputBg}
              color={inputTextColor}
              border="1px solid blackAlpha.300"
              required
            >
              <option value="Cardio"  >Cardio</option>
               <option value="Strength">Strength</option>
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
    color={inputTextColor}
    border="1px solid blackAlpha.300"
    required
  >
    {activityOptions[formData.exercise_type]?.map((activity) => (
      <option style={{ color: "black" }} key={activity} value={activity}>
        {activity}
      </option>
    ))}
    </Select>

)}

{formData.exercise_type === "Cardio" && (
  <>
  <Input
    name="duration"
    type="text"
    value={formData.duration}
    onChange={changeHandler}
    placeholder="Duration (in minutes)"
    bg={inputBg}
    color={inputTextColor}
                  variant="outline"

    required
  />
  </>
)}
        
{formData.exercise_type === "Strength" && (
  <>
  <Select
    name="intensity"
    type="text"
    value={formData.intensity}
    onChange={changeHandler}
    placeholder="How hard was it?"
    bg={inputBg}
    color={inputTextColor}
    border="1px solid blackAlpha.300"
    required
  >
    <option style={{ color: "black" }} value="Low">Low</option>
    <option style={{ color: "black" }} value="Medium">Medium</option>
    <option style={{ color: "black" }} value="High">High</option>
  </Select>

   <Input
    name="duration"
    type="number"
    value={formData.duration}
    onChange={changeHandler}
    placeholder="Duration (in minutes)"
    bg={inputBg}
    color={inputTextColor}
    border="1px solid blackAlpha.300"
    required
  />
    <Input
      name="sets"
      type="number"
      value={formData.sets}
      onChange={changeHandler}
      placeholder="Sets (optional)"
      bg={inputBg}
      color={inputTextColor}
      border="1px solid blackAlpha.300"
    />
    <Input
      name="reps"
      type="number"
      value={formData.reps}
      onChange={changeHandler}
      placeholder="Reps (optionla)"
      bg={inputBg}
      color={inputTextColor}
      border="1px solid blackAlpha.300"
      
    />
   
  </>
)}
            <Button
              type="submit"
              variant="primary"
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
