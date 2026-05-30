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
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaUtensils,
  FaClipboardList,
  FaFireAlt
} from "react-icons/fa";
import Footer from "./Footer";
import LandingNavbar from "./LandingNavbar";
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionBox = motion(Box);

const features = [
  { icon: FaClipboardList, title: "Log Workouts", description: "Easily log your daily workouts" },
  { icon: FaUtensils, title: "Track Nutrition", description: "Log meals with real nutrition data via API" },
  { icon: FaChartLine, title: "Track Progress", description: "Monitor your fitness journey" },
];


const LandingPage = () => {
  return (
    <Box minH="100vh" bgGradient="linear(to-br, blue.50, white)"  overflow="hidden">
      <LandingNavbar />
      {/* Hero Section */}
  <Box
  position="relative"
  overflow="hidden"
  bg="white"
  pt={{ base: 10, md: 16 }}
  pb={{ base: 16, md: 24 }}
>
  {/* soft background glow */}
  <Box
    position="absolute"
    top="-120px"
    left="-120px"
    w="320px"
    h="320px"
    borderRadius="full"
    bg="orange.100"
    filter="blur(90px)"
    opacity="0.7"
    pointerEvents="none"
  />
  <Box
    position="absolute"
    bottom="-140px"
    right="-120px"
    w="360px"
    h="360px"
    borderRadius="full"
    bg="purple.100"
    filter="blur(100px)"
    opacity="0.8"
    pointerEvents="none"
  />

  <Flex
    direction={{ base: "column", lg: "row" }}
    align="center"
    justify="space-between"
    maxW="7xl"
    mx="auto"
    px={6}
    gap={{ base: 14, lg: 10 }}
    position="relative"
    zIndex={1}
  >
    {/* LEFT SIDE */}
    <VStack align="start" spacing={6} flex={1} maxW="650px">
      <MotionBox
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Flex
          align="center"
          gap={2}
          px={4}
          py={2}
          borderRadius="full"
          bg="purple.50"
          border="1px solid"
          borderColor="purple.100"
          boxShadow="sm"
          w="fit-content"
        >
          <Box
            w="2.5"
            h="2.5"
            borderRadius="full"
            bg="orange.400"
            boxShadow="0 0 18px rgba(237, 137, 54, 0.55)"
          />
          <Text fontSize="sm" fontWeight="bold" color="purple.700">
            All-in-one fitness dashboard
          </Text>
        </Flex>
      </MotionBox>

      <MotionHeading
        fontSize={{ base: "4xl", md: "5xl", xl: "6xl" }}
        lineHeight="0.95"
        fontWeight="black"
        letterSpacing="-0.04em"
        color="gray.900"
        maxW="12ch"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Track your{" "}
        <Box as="span" bgGradient="linear(to-r, purple.600, orange.400)" bgClip="text">
          health
        </Box>
        <br />
        like a premium app.
      </MotionHeading>

      <MotionText
        fontSize={{ base: "md", md: "lg" }}
        color="gray.600"
        maxW="560px"
        lineHeight="1.8"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Log meals, track workouts, monitor calories burned.
      </MotionText>

      <MotionBox
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Flex gap={4} direction={{ base: "column", sm: "row" }}>
          <Button
            as={Link}
            to="/signup"
            size="lg"
            px={8}
            bg="orange.400"
            color="white"
            fontWeight="bold"
            borderRadius="full"
            boxShadow="0 14px 30px rgba(237, 137, 54, 0.25)"
            _hover={{
              bg: "orange.500",
              transform: "translateY(-2px)",
              boxShadow: "0 18px 36px rgba(237, 137, 54, 0.32)",
            }}
          >
            Get Started Free
          </Button>

        </Flex>
      </MotionBox>

    </VStack>

    {/* RIGHT SIDE */}
    <Box flex={1} w="full" position="relative">
      <MotionBox
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        position="relative"
        mx="auto"
        maxW="560px"
      >
        {/* outer glow */}
        <Box
          position="absolute"
          inset="-18px"
          borderRadius="3xl"
          bgGradient="linear(to-br, purple.200, orange.100)"
          filter="blur(22px)"
          opacity="0.55"
          zIndex={0}
        />

        {/* main device card */}
        <Box
          position="relative"
          zIndex={1}
          borderRadius="3xl"
          bg="rgba(255,255,255,0.78)"
          backdropFilter="blur(16px)"
          border="1px solid"
          borderColor="whiteAlpha.700"
          boxShadow="0 30px 80px rgba(76, 29, 149, 0.16)"
          p={5}
        >
          <Flex justify="space-between" align="center" mb={5}>
            <Box>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                Today&apos;s Summary
              </Text>
              <Heading size="md" color="purple.700">
                Fitness Dashboard
              </Heading>
            </Box>

            <Flex
              align="center"
              gap={2}
              px={3}
              py={1.5}
              borderRadius="full"
              bg="orange.50"
              border="1px solid"
              borderColor="orange.100"
            >
              <Box w="2" h="2" borderRadius="full" bg="orange.400" />
              <Text fontSize="sm" fontWeight="bold" color="orange.500">
                Live
              </Text>
            </Flex>
          </Flex>

          {/* top stats */}
          <SimpleGrid columns={3} spacing={3} mb={4}>
            {[
              { label: "Consumed", value: "1,840" },
              { label: "Burned", value: "620" },
              { label: "Goal", value: "2,100" },
            ].map((stat) => (
              <Box
                key={stat.label}
                p={4}
                borderRadius="2xl"
                bg="white"
                border="1px solid"
                borderColor="gray.100"
                boxShadow="sm"
              >
                <Text fontSize="xs" color="gray.500" mb={1}>
                  {stat.label}
                </Text>
                <Heading size="md" color="gray.800">
                  {stat.value}
                </Heading>
              </Box>
            ))}
          </SimpleGrid>

          {/* chart placeholder */}
          <Box
            p={5}
            borderRadius="2xl"
            bgGradient="linear(to-br, purple.50, orange.50)"
            border="1px solid"
            borderColor="purple.100"
            mb={4}
          >
            <Flex justify="space-between" mb={4}>
              <Text fontWeight="bold" color="purple.700">
                Weekly Progress
              </Text>
              <Text fontSize="sm" color="gray.500">
                Calories & Activity
              </Text>
            </Flex>

            <Flex align="end" gap={3} h="140px">
              {[42, 66, 55, 84, 72, 96, 78].map((h, idx) => (
                <Box
                  key={idx}
                  flex="1"
                  h={`${h}%`}
                  borderRadius="lg"
                  bgGradient={
                    idx % 2 === 0
                      ? "linear(to-t, purple.500, purple.300)"
                      : "linear(to-t, orange.500, orange.300)"
                  }
                  boxShadow="sm"
                />
              ))}
            </Flex>
          </Box>

          {/* bottom section */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box
              p={4}
              borderRadius="2xl"
              bg="white"
              border="1px solid"
              borderColor="gray.100"
              boxShadow="sm"
            >
              <Text fontSize="sm" color="gray.500" mb={2}>
                Recent Meal
              </Text>
              <Heading size="sm" color="purple.700" mb={1}>
                Chicken Rice Bowl
              </Heading>
              <Text fontSize="sm" color="gray.600">
                540 kcal • 38g protein
              </Text>
            </Box>

            <Box
              p={4}
              borderRadius="2xl"
              bg="white"
              border="1px solid"
              borderColor="gray.100"
              boxShadow="sm"
            >
              <Text fontSize="sm" color="gray.500" mb={2}>
                Recent Workout
              </Text>
              <Heading size="sm" color="purple.700" mb={1}>
                Lower Body Session
              </Heading>
              <Text fontSize="sm" color="gray.600">
                48 min • 410 kcal burned
              </Text>
            </Box>
          </SimpleGrid>
        </Box>

        {/* floating cards */}
        <MotionBox
          position="absolute"
          top={{ base: "-16px", md: "-26px" }}
          left={{ base: "12px", md: "-24px" }}
          px={4}
          py={3}
          borderRadius="2xl"
          bg="white"
          boxShadow="0 20px 50px rgba(0,0,0,0.12)"
          border="1px solid"
          borderColor="gray.100"
          initial={{ y: 0 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          zIndex={2}
        >
          <Flex align="center" gap={3}>
            <Box
              p={2.5}
              borderRadius="xl"
              bg="purple.50"
              color="purple.600"
            >
              <Icon as={FaChartLine} boxSize={5} />
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500">
                Weekly change
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="gray.800">
                +12% consistency
              </Text>
            </Box>
          </Flex>
        </MotionBox>

        <MotionBox
          position="absolute"
          bottom={{ base: "-16px", md: "-26px" }}
          right={{ base: "12px", md: "-24px" }}
          px={4}
          py={3}
          borderRadius="2xl"
          bg="white"
          boxShadow="0 20px 50px rgba(0,0,0,0.12)"
          border="1px solid"
          borderColor="gray.100"
          initial={{ y: 0 }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          zIndex={2}
        >
          <Flex align="center" gap={3}>
            <Box
              p={2.5}
              borderRadius="xl"
              bg="orange.50"
              color="orange.500"
            >
              <Icon as={FaFireAlt} boxSize={5} />
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500">
                Today&apos;s burn
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="gray.800">
                620 calories
              </Text>
            </Box>
          </Flex>
        </MotionBox>
      </MotionBox>
    </Box>
  </Flex>
</Box>

<Box py={24} bg="white">
  <VStack spacing={16} maxW="7xl" mx="auto" px={6}>
    <Flex
  direction={{ base: "column", lg: "row" }}
  gap={12}
  align="center"
>
  <Box
  flex={1}
  bg="white"
  p={3}
  borderRadius="3xl"
  boxShadow="2xl"
  border="1px solid"
  borderColor="gray.200"
>
  <Image
    src="/nutrition.png"
    w="100%"
    maxW="700px"
    transform="rotate(-2deg)"
    h="auto"
    borderRadius="xl"
    objectFit="contain"
  />
</Box>

  <Box flex={1}>
    <Text color="orange.400" fontWeight="bold">
      NUTRITION TRACKING
    </Text>

    <Heading color="purple.700" mb={4}>
      Log meals with real nutrition data.
    </Heading>

    <Text color="gray.600">
      Search foods, track calories,
      monitor macros, and understand
      exactly what fuels your body.
    </Text>
  </Box>
</Flex>

<Flex
  direction={{ base: "column-reverse", lg: "row" }}
  gap={12}
  align="center"
>
  <Box flex={1}>
    <Text color="orange.400" fontWeight="bold">
      WORKOUT TRACKING
    </Text>

    <Heading color="purple.700" mb={4}>
      Track every workout.
    </Heading>

    <Text color="gray.600">
      Log exercises, duration,
      calories burned and build
      consistency over time.
    </Text>
  </Box>

  <Box
  flex={1}
  bg="white"
  p={3}
  borderRadius="3xl"
  boxShadow="2xl"
  border="1px solid"
  borderColor="gray.200"
>
  <Image
    src="/workout.png"
    w="100%"
    maxW="700px"
    transform="rotate(2deg)"
    h="auto"
    borderRadius="xl"
    objectFit="contain"
  />
</Box>
</Flex>

<Flex
  direction={{ base: "column", lg: "row" }}
  gap={12}
  align="center"
>
<Box
  flex={1}
  bg="white"
  p={3}
  borderRadius="3xl"
  boxShadow="2xl"
  border="1px solid"
  borderColor="gray.200"
>
  <Image
    src="/progress.png"
    w="100%"
    maxW="700px"
    transform="rotate(-2deg)"
    h="auto"
    borderRadius="xl"
    objectFit="contain"
  />
</Box>

  <Box flex={1}>
    <Text color="orange.400" fontWeight="bold">
      PROGRESS ANALYTICS
    </Text>

    <Heading color="purple.700" mb={4}>
      Visualize your progress.
    </Heading>

    <Text color="gray.600">
      Beautiful charts help you
      understand calories consumed,
      calories burned, and long-term trends.
    </Text>
  </Box>
</Flex>
  </VStack>
</Box>

<Box bg="gray.50" py={24}>
  <Box maxW="6xl" mx="auto" px={6}>
    <Heading
      textAlign="center"
      color="purple.700"
      mb={12}
    >
      Everything You Need
    </Heading>

    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing={8}
    >
      {features.map((feature, idx) => (
        <Box
          key={idx}
          p={8}
          bg="white"
          borderRadius="xl"
          boxShadow="md"
        >
          <Icon
            as={feature.icon}
            boxSize={8}
            color="orange.400"
          />

          <Heading
            size="md"
            mt={4}
            color="purple.700"
          >
            {feature.title}
          </Heading>

          <Text mt={2} color="gray.600">
            {feature.description}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  </Box>
</Box>

<Box
  py={24}
  bgGradient="linear(to-r, purple.700, purple.600)"
  color="white"
  textAlign="center"
>
  <VStack spacing={6}>
    <Heading size="2xl">
      Start Building Healthier Habits Today
    </Heading>

    <Text
      maxW="700px"
      mx="auto"
      opacity={0.9}
    >
      Join Fitness Tracker and take control
      of your workouts, nutrition, and progress.
    </Text>

    <Button
      as={Link}
      to="/signup"
      size="lg"
      bg="orange.400"
      color="white"
      _hover={{
        bg: "orange.500"
      }}
    >
      Get Started Free
    </Button>
  </VStack>
</Box>
      

      <Footer />
    </Box>
  );
};

export default LandingPage;
