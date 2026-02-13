import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Icon,
  Image
} from "@chakra-ui/react";
import { motion, px } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaRunning,
  FaBicycle,
  FaChartLine,
  FaUtensils,
  FaClipboardList
} from "react-icons/fa";
import { GiBodyBalance } from "react-icons/gi";
import Footer from "./Footer";

const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionBox = motion(Box);

const popularExercises = [
  { icon: FaRunning, title: "Running", description: "Running for every body type" },
  { icon: GiBodyBalance, title: "Push-up", description: "Strength training for the whole body" },
  { icon: FaBicycle, title: "Cycling", description: "Boost cardiovascular health" },
];

const features = [
  { icon: FaClipboardList, title: "Log Workouts", description: "Easily log your daily workouts" },
  { icon: FaUtensils, title: "Track Nutrition", description: "Log meals with real nutrition data via API" },
  { icon: FaChartLine, title: "Track Progress", description: "Monitor your fitness journey" },
];



const LandingPage = () => {
  return (
    <Box minH="100vh" bgGradient="linear(to-br, blue.50, white)"  overflow="hidden">
      {/* Hero Section */}
       
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        maxW="7xl"
        mx="auto"
        px={6}
        py={6}
        gap={4}
        position="relative"
        zIndex={2}
      >
        {/* LEFT */}

        <VStack align="start" spacing={6} maxW="7xl" zIndex={2}>
         <VStack align="start" spacing={2}>
    <MotionText
      fontSize="sm"
      fontWeight="bold"
      textTransform="uppercase"
      color="orange.400"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      Fitness Tracker
    </MotionText>

    <MotionHeading
      size="2xl"
      fontWeight="extrabold"
      color="purple.700"
      lineHeight="short"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      Track Your Fitness.
      <br />
      Transform Life.
    </MotionHeading>
    <Text fontSize="md" color="gray.600">
            Your Body Can Stand Almost Anything. It’s Your Mind That You Have To Condition.
            Turn The Pain Into Power And Conquer The Pain. Let's Go!
          </Text>
  </VStack>

          

          <MotionText
            fontSize="lg"
            color="gray.600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Already a member of our community?{" "}
            <Link to="/login">
              <Text as="span" color="orange.400" fontWeight="bold">
                Sign in
              </Text>
            </Link>
          </MotionText>

          <Button as={Link} to="/signup" colorScheme="orange" borderRadius="full" size="lg">
            Get Started
          </Button>
        </VStack>

        {/* RIGHT - Hero Image with Glow & Floating Card */}
        <Box position="relative" w="full" maxW="7xl" zIndex={1}>
          {/* Glow Blob */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="350px"
            h="350px"
            bgGradient="radial(orange.100, transparent)"
            borderRadius="full"
            zIndex={0}
          />

          {/* Image */}
          <Image
            src="/real.png"
            alt="Hero Fitness"
            maxH="500px"
            objectFit="contain"
            position="relative"
            zIndex={1}
            mx="auto"
          />
          </Box>

          {/* Floating Badge Card */}

          <Box maxW="7xl" mx="auto" px={6} py={12}>
        <Heading fontSize="2xl" color="purple.700" ml={0} mb={6} borderLeft="4px solid orange" pl={2}>
  Popular Exercises
</Heading>
        <VStack align="start" spacing={4} maxW="2xl" mx="auto" >
          {popularExercises.map((item, idx) => (
            <MotionBox
            
            height="100px"
            width={"120px"}
              key={idx}
              p={2}
              bg="white"
              borderRadius="xl"
              textAlign="center"
               boxShadow="lg"
              border="2px solid"
              borderColor="purple.200"
              transition="all 0.2s"
              _hover={{ boxShadow: "3xl", transform: "scale(1.01)" }}

            >
              <Icon as={item.icon} boxSize={10} color="orange.400" />
              <Heading size="md" mt={2} color="purple.600">
                {item.title}
              </Heading>
             
            </MotionBox>
          ))}
        </VStack>
      </Box>

          
      </Flex>

      
      <Box
        py={12}
        px={6}
        bg={"white"}
        maxW="8xl"
        
        mx={"auto"}
        borderTop="2px solid #eee"
        borderRadius="xl"
        textAlign="center"
      >
        <Heading fontSize="3xl" color="purple.700">
          Why Choose Us?
        </Heading>
        <Text maxW="2xl" mx="auto" mt={2} color="gray.600" fontSize="sm">
          Of Course It's Hard. It's Supposed To Be Hard. If It Were Easy, Everybody Would Do It.
          Hard Is What Makes It Great.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mt={10} maxW="5xl" mx="auto">
          {features.map((feature, idx) => (
            <MotionBox
              key={idx}
              p={4}
              borderRadius="xl"
              bg="orange.50"
              boxShadow="lg"
              border="2px solid"
              borderColor="purple.200"
              transition="all 0.2s"
              _hover={{ boxShadow: "3xl", transform: "scale(1.01)" }}
            >
              <Icon as={feature.icon} boxSize={10} color="purple.500" />
              <Text fontSize="xl" fontWeight="bold" mt={4} color="orange.500">
                {feature.title}
              </Text>
              <Text mt={2} fontSize="sm" color="gray.600">
                {feature.description}
              </Text>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Box>

      <Footer />
    </Box>
  );
};

export default LandingPage;
