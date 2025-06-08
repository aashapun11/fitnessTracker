import React, { useState, useEffect, createContext, useContext } from 'react'
import axios from 'axios'
import { Toast } from '@chakra-ui/react';
const WorkoutContext = createContext();
function WorkoutProvider({children}) {
    const [workouts, setWorkouts] = useState([]);
    const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem("userInfo");
      return savedUser ? JSON.parse(savedUser) : null;
    });
    
    
    useEffect(() => {
      if(localStorage.getItem("token") === null){
        return;
      }
      async function getWorkouts() {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
        const response = await axios.get("http://localhost:3000/api/workouts/getWorkouts", config);
        setWorkouts(response.data);
      }
      getWorkouts();
      
    }, [user]);
  return (
    <WorkoutContext.Provider value={{ workouts, setWorkouts, user, setUser }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export const workoutState = () =>{
    const context = useContext(WorkoutContext);
    return context;
}

export default WorkoutProvider