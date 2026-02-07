import React, { useMemo, useEffect, useState } from 'react';
import {
  HStack,
  Box,
  Text,
  Heading,
  Button,
  Center,
  VStack,
  
  Image,
} from '@chakra-ui/react';
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend
} from 'recharts';
import { NavLink } from 'react-router-dom';
import { workoutState } from '../Context/WorkoutProvider';
import useThemeValues from '../hooks/useThemeValues';
import Navbar from './Navbar';
import { format, isSameMonth, parseISO } from 'date-fns';
  import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import axios from 'axios';

function MyProgressGraph() {
  const { workouts } = workoutState();
  const { cardBg, textColor } = useThemeValues();
  const [nutritionData, setNutritionData] = useState([]);


  //Calorie burnt and consumed merged for the month
const monthlyData = useMemo(() => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  const days = eachDayOfInterval({ start, end });

  const map = {};

  days.forEach((date) => {
    const label = format(date, 'd');
    map[label] = { label, burned: 0, consumed: 0 };
  });
  
const filteredWorkouts = workouts.filter((w) => {
  const date = parseISO(w.date); // or new Date(w.date)
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
});

  filteredWorkouts.forEach((w) => {
    const label = format(parseISO(w.date), 'd');
    if (map[label]) {
      map[label].burned += parseFloat(w.calories);
    }
  });

  nutritionData.forEach((n) => {
    const label = n.label;
    if (map[label]) {
      map[label].consumed = n.consumed;
    }
  });

  return Object.values(map);
}, [workouts, nutritionData]);


const hasData = monthlyData.length > 0;

//Calorie consumed for 1 month
useEffect(() => {
  const fetchNutrition = async () => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const days = eachDayOfInterval({ start, end });

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      const promises = days.map((day) =>
        axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/nutrition/getNutrition?date=${format(
            day,
            "yyyy-MM-dd"
          )}`,
          config
        )
      );

      const responses = await Promise.all(promises);

      const mappedData = responses.map((res, idx) => {
        const date = format(days[idx], "d");
        const total = Array.isArray(res.data)
          ? res.data.reduce((sum, i) => sum + (i.calories || 0), 0)
          : 0;
        return { label: date, consumed: Number(total.toFixed(2)) };
      });

      setNutritionData(mappedData);
    } catch (err) {
      console.log("Failed to fetch nutrition:", err.message);
    }
  };

  fetchNutrition();
}, []);

const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);




  return (
    <Box textAlign="center" p={4} bg={cardBg} minH="80vh">
      <Navbar />
      <Heading color={textColor} m={4}>
        Monthly Progress (Calories per Day)
      </Heading>

      {hasData ? (
        <Box  mx="auto" w="95%" maxW="1200px" mb={8} mt={6} borderRadius="xl" boxShadow="md">
          <Text color={textColor}>Calories burned vs consumed per day in <span style={{ fontWeight: 'bold'}}>{format(new Date(), 'MMMM yyyy')}</span> </Text>
         <ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={monthlyData}
    barCategoryGap={2}
    barGap={0}
    margin={{ top: 5, right: 20, left: 20, bottom: 30 }}
  >
  <XAxis
  dataKey="label"
  interval={isMobile ? 'preserveStartEnd' : 0}
  angle={isMobile ? 0 : -40}
  textAnchor={isMobile ? 'middle' : 'end'}
/>


    <YAxis label={{ value: 'kcal', angle: -90, position: 'insideLeft' }} />
    <Tooltip
    key={cardBg}
    formatter={(value, name) => [`${Number(value).toFixed(2)} kcal`, name]} 
    contentStyle={{
    backgroundColor: cardBg
  }}
    
    />
    <Legend />
      
    <Bar dataKey="burned" fill="#8884d8" name="Calories Burned" radius={[6, 6, 0, 0]} />
    <Bar dataKey="consumed" fill="#82ca9d" name="Calories Consumed" radius={[6, 6, 0, 0]} />
  </BarChart>
  
</ResponsiveContainer>


        </Box>
      ) : (
        <Center mt={20}>
          <VStack spacing={6}>
            <Image
              src="https://cdn-icons-png.flaticon.com/512/4076/4076501.png"
              alt="No data"
              boxSize="120px"
              opacity={0.6}
            />
            <Text fontSize="xl" fontWeight="semibold" color={textColor}>
              No workout data to display.
            </Text>
            <Text color={textColor}>
              Start tracking your workouts to see your progress here.
            </Text>
            <Button
              colorScheme="blue"
              as={NavLink}
              to="/workoutForm"
              bgGradient="linear(to-r, purple.400, blue.400)"
              _hover={{ bgGradient: 'linear(to-r, purple.500, blue.500)' }}
            >
              Go to Workout Tracker
            </Button>
          </VStack>
        </Center>
      )}

      {hasData && (
        <HStack spacing={4} mb={4} mt={4} justifyContent="center">
          <Button
          w={"150px"}
            colorScheme="blue"
            onClick={() => window.print()}
            bgGradient="linear(to-r, purple.400, blue.400)"
            _hover={{ bgGradient: 'linear(to-r, purple.500, blue.500)' }}
            
          >
            Print
          </Button>
        </HStack>
      )}
    </Box>
  );
}

export default MyProgressGraph;

