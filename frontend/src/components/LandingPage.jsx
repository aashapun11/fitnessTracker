import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Stack,
  Image,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import LightMode from "./LightMode";
import useThemeValues from "../hooks/useThemeValues";

function LandingPage() {
  const { bg, textColor } = useThemeValues();
 


  return (
    // Main Container

    <Box bg={bg}  py={6} px={6}>
      <LightMode />

      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        maxW="1200px"
        mx="auto"
      >
        
        {/* Hero Text */}

        <VStack align="start" spacing={4} flex={1}>
          <Heading as="h1" size="2xl" color={textColor}>
            Track Your Fitness, Stay Healthy
          </Heading>
          <Text fontSize="lg" color={textColor}>
            Your personalized fitness tracker to monitor workouts, progress, and goals—all in one place.
          </Text>
          <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
            <Link to="/login">
              <Button colorScheme="teal" size="lg">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" colorScheme="teal" size="lg">
                Sign Up
              </Button>
            </Link>
          </Stack>
        </VStack>

        {/* Hero Image */}
        <Box flex={1} mt={{ base: 10, md: 0 }}>
          <Image
            src="/exercise.png"
            alt="Fitness illustration"
            borderRadius="xl"
            boxShadow="xl"
          />
        </Box>
      </Flex>

      {/* Features Section */}
      <Box mt={19} textAlign="center">
        <Heading size="lg" mb={4} color={textColor}>
          Why Use Our Tracker?
        </Heading>
        <Stack direction={{ base: "column", md: "row" }} spacing={10} mt={6} justify="center">
          <VStack spacing={2}>
            <Heading size="md" color="teal.500">Log Workouts</Heading>
            <Text color={textColor}>Easily add and manage your daily exercises.</Text>
          </VStack>
          <VStack spacing={2}>
            <Heading size="md" color="teal.500">Track Progress</Heading>
            <Text color={textColor}>Visualize your fitness growth with charts.</Text>
          </VStack>
          <VStack spacing={2}>
            <Heading size="md" color="teal.500">Personal Insights</Heading>
            <Text color={textColor}>Get accurate calorie burns based on your body profile.</Text>
          </VStack>
        </Stack>
      </Box>
    </Box>
  );
}

export default LandingPage;
