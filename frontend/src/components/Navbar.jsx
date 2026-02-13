import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  Button,
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
import { FiUser, FiLogOut} from "react-icons/fi";
import { FaUtensils, FaDumbbell, FaChartLine} from "react-icons/fa"; // meal/food

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
  const streakColor = streak > 0 ? "purple.500" : "gray.400";

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
            color={isActive ? "orange.500" : textColor}
            _hover={{ color: "orange.500" }}
          >
            Add Exercise <Icon as={FaDumbbell} ml={1} />
          </Text>
        )}
      </NavLink>

      <NavLink to="/smart-nutrition">
        {({ isActive }) => (
          <Text
            fontWeight="medium"
            color={isActive ? "orange.500" : textColor}
            _hover={{ color: "orange.500" }}
          >
            Add Food <Icon as={FaUtensils} ml={1} />
          </Text>
        )}
      </NavLink>

      <NavLink to="/progressGraph">
        {({ isActive }) => (
          <Text
            fontWeight="medium"
            color={isActive ? "orange.500" : textColor}
            _hover={{ color: "orange.500" }}
          >
            Progress Graph <Icon as={FaChartLine} ml={1} />
          </Text>
        )}
      </NavLink>

      <NavLink to="/workoutList">
        {({ isActive }) => (
          <Text
            fontWeight="medium"
            color={isActive ? "orange.500" : textColor}
            _hover={{ color: "orange.500" }}
          >
            My Workouts <Icon as={FaFire} ml={1} />
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
              <Avatar size="sm" src={user.avatar || defaultAvatar} boxSize="41px" name={user.name} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate("/profile")}>My Profile <Icon as={FiUser} ml={1} /> </MenuItem>
             <MenuItem 
      onClick={logoutHandler} 
      display={{ base: "none", md: "flex" }}>
      Logout <Icon as={FiLogOut} ml={1} />
    </MenuItem>            </MenuList>
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
              <Text
      fontWeight="medium"
      color={textColor}
      _hover={{ color: "orange.500", cursor: "pointer" }}
      display={{ base: "flex", md: "none" }}
      onClick={() => {
        onClose();
        logoutHandler();
      }}
    >
      Logout <Icon as={FiLogOut} ml={2} mt={1}/>
    </Text>
           
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default Navbar;
