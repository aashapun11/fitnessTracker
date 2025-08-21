import React, { useState, useEffect } from "react";
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
  IconButton,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure
} from "@chakra-ui/react";

import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FaFire } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import LightMode from "./LightMode";
import useThemeValues from "../hooks/useThemeValues";
import { workoutState } from "../Context/WorkoutProvider";
import NotificationMenu from "./NotificationMenu";
import axios from "axios";
import { FiClock} from "react-icons/fi";
import { FaUtensils} from "react-icons/fa"; // meal/food

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = workoutState();
  const { cardBg, textColor } = useThemeValues();
  const { isOpen, onOpen, onClose } = useDisclosure();
   const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  const streak = user?.streak ?? 0;
  const name = user?.name ?? "User";
  const streakColor = streak > 0 ? "orange.500" : "gray.400";

  const icons = {
    welcome: "🎉",
    streak: "🔥",
    reminder: "⏰"
  };


  const NavLinks = () => (
    <>
      <NavLink to="/workoutForm">
        {({ isActive }) => (
          <Text
            fontWeight="medium"
            color={isActive ? "blue.500" : textColor}
            _hover={{ color: "blue.500" }}
          >
            Add Exercise 💪
          </Text>
        )}
      </NavLink>

      <NavLink to="/smart-nutrition">
        {({ isActive }) => (
          <Text
            fontWeight="medium"
            color={isActive ? "blue.500" : textColor}
            _hover={{ color: "blue.500" }}
          >
            Add Food <Icon as={FaUtensils} ml={1} />
          </Text>
        )}
      </NavLink>

      <NavLink to="/progressGraph">
        {({ isActive }) => (
          <Text
            fontWeight="medium"
            color={isActive ? "blue.500" : textColor}
            _hover={{ color: "blue.500" }}
          >
            Progress Graph <Icon as={FiClock} ml={1} />
          </Text>
        )}
      </NavLink>

      <NavLink to="/workoutList">
        {({ isActive }) => (
          <Text
            fontWeight="medium"
            color={isActive ? "blue.500" : textColor}
            _hover={{ color: "blue.500" }}
          >
            My Workouts 🔥
          </Text>
        )}
      </NavLink>
      
    </>
  );

  const handleBellClick = async () => {
    // Instantly set UI unread count to zero
    setUnreadCount(0);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/notifications/markAllAsRead`, {}, config);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  

  useEffect(()=>{
    const fetchNotifications = async () =>{
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
        const {data} = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/notifications/getNotifications`, config);
        setNotifications(data);

        setUnreadCount(data.filter(notification => !notification.isRead).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }

    fetchNotifications();
  },[])

  return (
    <Box bg={cardBg} px={4} py={3} boxShadow="md" textColor={textColor} position="sticky" top={0} zIndex={100}>
      <Flex align="center" gap={6}> 
        {/* Logo */}
        <Box as={NavLink} to="/dashboard" >
          <Image
            src="/logo.png"
            alt="Fitness Logo"
            boxSize="40px"
            borderRadius="full"
            objectFit="cover"
          />
        </Box>

        {/* Desktop Links */}
        <HStack spacing={6} display={{ base: "none", md: "flex" }}>
          <NavLinks />
        </HStack>

        <Spacer />

        <Flex gap={3} align="center">
          {/* Fire Icon */}
          <Tooltip label="Your current workout streak!" hasArrow>
            <Flex align="center" gap={1}>
              <Icon as={FaFire} color={streakColor} boxSize={7} />
              <Text fontSize="xl" fontWeight="semibold" color={streakColor}>
                {streak}
              </Text>
            </Flex>
          </Tooltip>

          {/* Light/Dark Toggle */}
          <LightMode />





          {/* //notifications */}

<NotificationMenu notifications={notifications} unreadCount={unreadCount} icons={icons} handleBellClick={handleBellClick} />
      
          {/* Avatar Menu */}
          <Menu>
            <MenuButton>
              <Avatar size="sm" boxSize="41px" name={name} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate("/profile")}>My Profile</MenuItem>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>

          {/* Mobile Menu Button */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<HamburgerIcon />}
            variant="ghost"
            onClick={onOpen}
            aria-label="Open Menu"
          />
        </Flex>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg={cardBg}>
          <DrawerHeader borderBottomWidth="1px" display="flex" justifyContent="space-between">
            Menu
            <IconButton
              icon={<CloseIcon />}
              onClick={onClose}
              aria-label="Close Menu"
              size="sm"
            />
          </DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={2} mt={4}>
              <NavLinks />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default Navbar;
