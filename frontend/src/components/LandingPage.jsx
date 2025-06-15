// src/pages/LandingPage.jsx
import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
  keyframes,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionBox = motion(Box);
const MotionImage = motion(Image);

const spinSlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const featureBadges = [
  { emoji: "💪", label: "Log Workouts" },
  { emoji: "📈", label: "Track Progress" },
  { emoji: "🔥", label: "Burn Calories" },
];

const LandingPage = () => {
  return (
    <Box
      minH="100vh"
      overflow="hidden"
      bgGradient="linear(to-br, purple.400, blue.100, white)"
      position="relative"
    >
      {/* Animated Background Circles */}
      <Box
        position="absolute"
        top="-100px"
        left="-100px"
        w="600px"
        h="600px"
        bgGradient="radial(purple.400 20%, transparent 70%)"
        borderRadius="full"
        filter="blur(120px)"
        animation={`${spinSlow} 13s linear infinite`}
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-100px"
        right="-100px"
        w="400px"
        h="400px"
        bgGradient="radial(blue.300 20%, transparent 70%)"
        borderRadius="full"
        filter="blur(80px)"
        animation={`${spinSlow} 19s linear infinite`}
        zIndex={0}
      />

      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        maxW="7xl"
        mx="auto"
        px={10}
        pt={[10, 20]}
        pb={[4, 8]}
        position="relative"
        zIndex={10}
        minH="100vh"
      >
        {/* Left Section */}
        <VStack align="start" spacing={6} maxW="2xl" flex={1}>
          <MotionHeading
            size="3xl"
            fontWeight="extrabold"
            lineHeight="1.2"
            color="purple.700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Track Your Fitness. Transform  Life.
          </MotionHeading>

          <MotionText
            fontSize="lg"
            color="gray.600"
            maxW="lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            All-in-one tracker to log workouts, monitor progress, and stay motivated.
          </MotionText>

          <MotionBox
            display="flex"
            gap={4}
            pt={2}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link to="/login">
              <Button
                size="lg"
                bgGradient="linear(to-r, purple.500, blue.500)"
                color="white"
                borderRadius="2xl"
                _hover={{ transform: "scale(1.05)", boxShadow: "xl" }}
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="lg"
                variant="outline"
                borderColor="purple.400"
                color="purple.500"
                borderRadius="2xl"
                _hover={{ bg: "purple.50", color: "blue.500", borderColor: "blue.400" }}
              >
                Sign Up
              </Button>
            </Link>
          </MotionBox>

          <Flex pt={6} gap={6} flexWrap="wrap">
            {featureBadges.map((item, idx) => (
              <MotionBox
                key={item.label}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.15, duration: 0.4 }}
                textAlign="center"
              >
                <Text fontSize="2xl">{item.emoji}</Text>
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  {item.label}
                </Text>
              </MotionBox>
            ))}
          </Flex>
        </VStack>

        {/* Right Section - Image */}
        <MotionBox
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          initial={{ opacity: 0, scale: 0.96, x: 60 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Image
            src="/exercise.png"
            alt="Fitness Illustration"
            maxH={["240px", "360px", "420px"]}
            borderRadius="3xl"
            boxShadow="2xl"
            border="1px solid"
            borderColor="purple.100"
            objectFit="contain"
          />
        </MotionBox>
      </Flex>
    </Box>
  );
};

export default LandingPage;
