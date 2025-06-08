import React from 'react';
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
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  Tooltip,
} from 'recharts';
import { NavLink } from 'react-router-dom';
import { workoutState } from '../Context/WorkoutProvider';
import useThemeValues from '../hooks/useThemeValues';
import Navbar from './Navbar';

function MyProgressGraph() {
  const { workouts } = workoutState();
  const { cardBg, textColor } = useThemeValues();

 
  const hasData = workouts.length > 0;

  return (
    <Box textAlign="center" p={4} bg={cardBg} minH="80vh">
      <Navbar />
      <Heading color={textColor} mb={4}>
        Progress Graph
      </Heading>

      {hasData ? (
        <Box
          maxW="900px"
          mx="auto"
          mb={6}
          spacing={4}
          mt={6}
          borderRadius="xl"
          boxShadow="md"
        >
          <Text color={textColor}>My progress over time</Text>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={[...workouts].sort(
                (a, b) => new Date(a.date) - new Date(b.date)
              )}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="date"
                tickFormatter={(dateStr) =>
                  new Date(dateStr).toLocaleDateString('en-CA')
                }
              />
              <YAxis
                label={{
                  value: 'Calories',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip
                formatter={(value) => `${value} cal`}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString('en-CA')
                }
              />
              
              <Line
                type="monotone"
                dataKey="duration"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
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
