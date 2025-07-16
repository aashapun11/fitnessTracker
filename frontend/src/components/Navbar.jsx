import React from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  Spacer,
  Avatar,
  Image,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
} from "@chakra-ui/react";

import LightMode from "./LightMode";
import { NavLink, useNavigate } from "react-router-dom";
import { workoutState } from "../Context/WorkoutProvider";
import { FaFire } from "react-icons/fa";
import useThemeValues from "../hooks/useThemeValues";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = workoutState();
  const { cardBg, textColor } = useThemeValues();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  const streak = user?.streak ?? 0;
  const name = user?.name ?? "User";
  const streakColor = streak > 0 ? "orange.500" : "gray.400";

  return (
    <Box bg={cardBg} px={4} py={3} boxShadow="md" textColor={textColor}  position="sticky" top={0} zIndex={100}>
      <Flex align="center" justify="space-between">
        {/* Logo + Navigation */}
        <HStack spacing={6}>
          {/* Logo */}
          <Box as={NavLink} to="/dashboard">
            <Image
              src="/logo.png"
              alt="Fitness Logo"
              boxSize="40px"
              borderRadius="full"
              objectFit="cover"
            />
          </Box>

          {/* Navigation Links */}
          <NavLink to="/workoutForm">
            {({ isActive }) => (
              <Text
                fontWeight="medium"
                color={isActive ? "blue.500" : { textColor }}
                _hover={{ color: "blue.500" }}
              >
                Add Exercise
              </Text>
            )}
          </NavLink>

          <NavLink to="/smart-nutrition">
            {({ isActive }) => (
              <Text
                fontWeight="medium"
                color={isActive ? "blue.500" : { textColor }}
                _hover={{ color: "blue.500" }}
              >
                Add Food
              </Text>
            )}
          </NavLink>

          <NavLink to="/progressGraph">
            {({ isActive }) => (
              <Text
                fontWeight="medium"
                color={isActive ? "blue.500" : { textColor }}
                _hover={{ color: "blue.500" }}
              >
                Progress Graph
              </Text>
            )}
          </NavLink>

          <NavLink to="/workoutList">
            {({ isActive }) => (
              <Text
                fontWeight="medium"
                color={isActive ? "blue.500" : { textColor }}
                _hover={{ color: "blue.500" }}
              >
                My Workouts
              </Text>
            )}
          </NavLink>
        </HStack>
        <Spacer />

        <Flex gap={5} align="center">
          {/* Streak Fire Icon */}
          <Tooltip label="Your current workout streak!" hasArrow>
            <Flex align="center" gap={1}>
              <Icon as={FaFire} color={streakColor} boxSize={7} />
              <Text fontSize="xl" fontWeight="semibold" color={streakColor}>
                {streak}
              </Text>
            </Flex>
          </Tooltip>

          {/* Light/Dark Mode Toggle */}
          <LightMode />

          {/* User Avatar & Menu */}
          <Menu>
            <MenuButton>
              <Avatar size="sm" boxSize={"41px"}  name={name} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate("/profile")}>My Profile</MenuItem>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;
