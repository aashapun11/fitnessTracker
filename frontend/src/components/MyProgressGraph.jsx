// import React from 'react';
// import {
//   HStack,
//   Box,
//   Text,
//   Heading,
//   Button,
//   Center,
//   VStack,
//   Image,
// } from '@chakra-ui/react';
// import {
//   LineChart,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   Line,
//   Tooltip,
// } from 'recharts';
// import { NavLink } from 'react-router-dom';
// import { workoutState } from '../Context/WorkoutProvider';
// import useThemeValues from '../hooks/useThemeValues';
// import Navbar from './Navbar';

// function MyProgressGraph() {
//   const { workouts } = workoutState();
//   const { cardBg, textColor } = useThemeValues();

 
//   const hasData = workouts.length > 0;

//   return (
//     <Box textAlign="center" p={4} bg={cardBg} minH="80vh">
//       <Navbar />
//       <Heading color={textColor} mb={4}>
//         Progress Graph
//       </Heading>

//       {hasData ? (
//         <Box
//           maxW="900px"
//           mx="auto"
//           mb={6}
//           spacing={4}
//           mt={6}
//           borderRadius="xl"
//           boxShadow="md"
//         >
//           <Text color={textColor}>My progress over time</Text>

//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart
//               data={[...workouts].sort(
//                 (a, b) => new Date(a.date) - new Date(b.date)
//               )}
//               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//               <XAxis
//                 dataKey="date"
//                 tickFormatter={(dateStr) =>
//                   new Date(dateStr).toLocaleDateString('en-CA')
//                 }
//               />
//               <YAxis
//                 label={{
//                   value: 'Calories',
//                   angle: -90,
//                   position: 'insideLeft',
//                 }}
//               />
//               <Tooltip
//                 formatter={(value) => `${value} cal`}
//                 labelFormatter={(label) =>
//                   new Date(label).toLocaleDateString('en-CA')
//                 }
//               />
              
//               <Line
//                 type="monotone"
//                 dataKey="duration"
//                 stroke="#8884d8"
//                 activeDot={{ r: 8 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </Box>
//       ) : (
//         <Center mt={20}>
//           <VStack spacing={6}>
//             <Image
//               src="https://cdn-icons-png.flaticon.com/512/4076/4076501.png"
//               alt="No data"
//               boxSize="120px"
//               opacity={0.6}
//             />
//             <Text fontSize="xl" fontWeight="semibold" color={textColor}>
//               No workout data to display.
//             </Text>
//             <Text color={textColor}>
//               Start tracking your workouts to see your progress here.
//             </Text>
//             <Button
//               colorScheme="blue"
//               as={NavLink}
//               to="/workoutForm"
//               bgGradient="linear(to-r, purple.400, blue.400)"
//               _hover={{ bgGradient: 'linear(to-r, purple.500, blue.500)' }}
//             >
//               Go to Workout Tracker
//             </Button>
//           </VStack>
//         </Center>
//       )}

//       {hasData && (
//         <HStack spacing={4} mb={4} mt={4} justifyContent="center">
//           <Button
//             colorScheme="blue"
//           onClick={() => window.print()}
//             bgGradient="linear(to-r, purple.400, blue.400)"
//             _hover={{ bgGradient: 'linear(to-r, purple.500, blue.500)' }}
//           >
//             Print
//           </Button>
         
//         </HStack>
//       )}
//     </Box>
//   );
// }

// export default MyProgressGraph;




import React, { useMemo } from 'react';
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
  Cell
} from 'recharts';
import { NavLink } from 'react-router-dom';
import { workoutState } from '../Context/WorkoutProvider';
import useThemeValues from '../hooks/useThemeValues';
import Navbar from './Navbar';
import { format, isSameMonth, parseISO } from 'date-fns';
  import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';


function MyProgressGraph() {
  const { workouts } = workoutState();
  const { cardBg, textColor } = useThemeValues();


const monthlyData = useMemo(() => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  // Step 1: create all days in current month
  const days = eachDayOfInterval({ start, end }).map((date) => {
    const label = format(date, 'MMM-dd');
    return {
      label,
      calories: 0,
      fill: '#e0e0e0', // default gray color
    };
  });

  // Step 2: add calories if workout exists for that day
  const dayMap = Object.fromEntries(days.map((d) => [d.label, d]));

  workouts.forEach((workout) => {
    const dateObj = parseISO(workout.date);
    const label = format(dateObj, 'MMM-dd');

    if (dayMap[label]) {
      dayMap[label].calories += parseFloat(workout.calories);
      dayMap[label].fill = '#8884d8'; // update color if workout done
    }
  });

  return Object.values(dayMap);
}, [workouts]);

  const hasData = monthlyData.length > 0;

  return (
    <Box textAlign="center" p={4} bg={cardBg} minH="80vh">
      <Navbar />
      <Heading color={textColor} m={6}>
        Monthly Progress (Calories per Day)
      </Heading>

      {hasData ? (
        <Box  mx="auto" mb={8} mt={6} borderRadius="xl" boxShadow="md">
          <Text color={textColor}>Calories burned per day in <span style={{ fontWeight: 'bold'}}>{format(new Date(), 'MMMM yyyy')}</span> </Text>
          <ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={monthlyData}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
  >
    <XAxis dataKey="label" />
    <YAxis label={{ value: 'kcal', angle: -90, position: 'insideLeft' }} />
    <Tooltip formatter={(value) => `${value} kcal`} />
    <Bar
      dataKey="calories"
      radius={[6, 6, 0, 0]}
    >
      {monthlyData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.fill} />
      ))}
    </Bar>
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

