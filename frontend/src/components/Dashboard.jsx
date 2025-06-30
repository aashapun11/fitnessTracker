import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  SimpleGrid
} from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import Sidebar from "./Sidebar";
import { workoutState } from "../Context/WorkoutProvider";
import useThemeValues from "../hooks/useThemeValues";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1", "#ff69b4"];
import { format, subDays } from "date-fns";


const Dashboard = () => {
  const [caloriesToday, setCaloriesToday] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [lastSevenDayChartData, setLastSevenDayChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, workouts } = workoutState();
  const {textColor,  cardBg } = useThemeValues();

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    calculateTodayCalories();
    prepareChartData();
    lastSevenDayChart();
  }, [workouts]);

  const lastSevenDayChart= () => {
     const past7Days = [...Array(7)].map((_, i) => {
    const date = subDays(new Date(), i);
    const key = date.toISOString().split("T")[0];
    return {
      date,
      key,
      label: format(date, "MMM-dd"), // e.g., Jun-18
      calories: 0,
    };
  }).reverse(); // So oldest comes first

   workouts.forEach((w) => {
    const workoutDate = w.date.split("T")[0];
    const entry = past7Days.find((d) => d.key === workoutDate);
    if (entry) {
      entry.calories += parseFloat(w.calories);
    }
  });

    setLastSevenDayChartData(past7Days.map(d => ({
    label: d.label,
    calories: Number(d.calories.toFixed(2))
  })));
  
  setLoading(false);
  }

  const calculateTodayCalories = () => {
    
    const total = workouts
      .filter((w) => w.date.split("T")[0] === today)
      .reduce((sum, w) => sum + parseFloat(w.calories), 0);
    setCaloriesToday(total.toFixed(2));
  };

  const prepareChartData = () => {
    const activityMap = {};
    workouts.forEach((w) => {
      if (w.date.split("T")[0] === today) {
        const calories = parseFloat(w.calories);
      if (activityMap[w.activity]) {
        activityMap[w.activity] += calories;
      } else {
        activityMap[w.activity] = calories;
      }
    }
  });

  const formattedData = Object.entries(activityMap).map(([name, calories]) => ({
    name,
    calories: Number(calories.toFixed(2)), // rounded for display
  }));

  setChartData(formattedData);
  setLoading(false);
};



  return (
<HStack spacing={0} align="start" m={0} p={0}>
            <Box w="60px" />  



      <Sidebar />

        <Box bgGradient="linear(to-b, gray.100, white)"  w="100%" >


      <VStack spacing={2} m={6} px={8} textColor={textColor}  >

  
        

       
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} px={0} width= "full" >
  {/* 👤 User Info */}
  <Box
    bgGradient="linear(to-r, purple.100, blue.100)"
    p={4}
    borderRadius="2xl"
    boxShadow="2xl"
              border="2px solid"
              borderColor="purple.300"
              transition="all 0.2s"
              _hover={{ boxShadow: "3xl", transform: "scale(1.01)" }}
    w="full"
  >
    <Text size="lg">
          Welcome <Text as="span" color="#8884d8" fontWeight="bold" >{user?.name}!</Text>
        </Text>
    <VStack spacing={2}>
     
        <Avatar name={user?.name} boxSize={"80px"} size="xl" bg="blue.500" color="white" />

    
      <Box>
        <Heading fontWeight="bold" fontSize="lg">
          {user?.name}
        </Heading>
      
      </Box>
    </VStack>

    <HStack mt={4} justify="space-between">
      <VStack spacing={0}>
        <Text fontWeight="bold">{user?.weight || "0"}<small>kg</small></Text>
        <Text fontSize="sm" color="gray.500">Weight</Text>
      </VStack>
      <VStack spacing={0}>
        <Text fontWeight="bold">{user?.height || "0"}<small>ft</small></Text>
        <Text fontSize="sm" color="gray.500">Height</Text>
      </VStack>
      <VStack spacing={0}>
        <Text fontWeight="bold">{user?.age || "0"}<small>yrs</small></Text>
        <Text fontSize="sm" color="gray.500">Age</Text>
      </VStack>
    </HStack>
  </Box>

  {/* 🔥 Calories Burned */}
 <Box
  bg={cardBg}
  p={4}
  borderRadius="2xl"
  boxShadow="2xl"
              border="2px solid"
              borderColor="purple.300"
              transition="all 0.2s"
              _hover={{ boxShadow: "3xl", transform: "scale(1.01)" }}
  textAlign="center"
  w="full"
  
  minH="200px"
>
  <Heading size="md" mb={2}>
    Calories Burned today
  </Heading>
  <Box position="relative" height="160px" width="100%" mx="auto">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={[
            { name: "Burned", value: Number(caloriesToday) },
          ]}
          innerRadius={60}
          outerRadius={80}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
          <Cell fill="#FFA500" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>

    <Box
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      textAlign="center"
      
    >
      <Text fontSize="5xl" fontWeight="bold" color="orange.100">
        🔥
      </Text>
      <Text fontWeight="bold" fontSize="lg">
        {caloriesToday}
      </Text>
    </Box>
  </Box>
</Box>


  {/* 📊 Workout Summary Pie Chart */}
  <Box
    bg={cardBg}
    p={2}
    borderRadius="2xl"
    boxShadow="2xl"
              border="2px solid"
              borderColor="purple.300"
              transition="all 0.2s"
              _hover={{ boxShadow: "3xl", transform: "scale(1.01)" }}
    textAlign="center"
    w="full"
    minH="200px"
  >
    <Heading size="md" mb={4}>
      Today's Workout Summary
    </Heading>
    {!loading && chartData.reduce((sum, item) => sum + item.calories, 0) > 0 ? (
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="calories"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} kcal`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    ) : (
      <Text color="gray.500">No workout data for today</Text>
      // <Image src="/reward.webp" alt="Reward Coin" mx="auto" boxSize="100px" />
    )}
  </Box>
</SimpleGrid>
 <Box width={'full'} mt={3} bg={cardBg} p={4} borderRadius="2xl" boxShadow="2xl"
              border="2px solid"
              borderColor="purple.300"
              transition="all 0.2s"
              _hover={{ boxShadow: "3xl", transform: "scale(1.01)" }}>
          <Heading size="md" mb={4} boxShadow={"sm"}>Weekly Activity</Heading>
          
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={lastSevenDayChartData}>
              <XAxis dataKey="label" />
              <YAxis label={{ value: "kcal", angle: -90, position: "insideLeft" }} />
              <Tooltip formatter={(value) => `${value} kcal`} />
              <Bar dataKey="calories" fill="#8884d8" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>

    
        
      </VStack>
    </Box>
</HStack>
  );
};

export default Dashboard;
