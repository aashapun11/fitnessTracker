// src/components/Sidebar.js
import { Box, VStack, IconButton, Tooltip, Image, Icon } from "@chakra-ui/react";
import {
  FiGrid,
  FiCalendar,
  
  FiClock,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { FaFire } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { workoutState } from "../Context/WorkoutProvider";
import LightMode from "./LightMode";
import useThemeValues from "../hooks/useThemeValues";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, setUser } = workoutState();
   const streak = user?.streak ?? 0;
  const streakColor = streak > 0 ? "orange.500" : "gray.400";
  const {iconColor, iconBg} = useThemeValues();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  return (
    <Box
      h="100vh"
      w="60px"
      bgGradient="linear(to-b, gray.100, white)"
      borderRight="1px solid #e2e8f0"
      position="fixed"
      top="0"
      left="0"
      zIndex="1000"
      py={4}
      px={2}
    
    >
      <VStack spacing={6}>
        {/* Logo */}
        <Image src="/logo.png" boxSize="40px" alt="Logo" />

        {/* Icons */}
        <Tooltip label="Dashboard" placement="right">
          <IconButton icon={<FiGrid />} color={iconColor} bg={iconBg} onClick={() => navigate("/dashboard")} />
        </Tooltip>
        <Tooltip label="Workout Form" placement="right">
          <IconButton icon={<FiCalendar />} color={iconColor} bg={iconBg} onClick={() => navigate("/workoutForm")} />
        </Tooltip>
        
        <Tooltip label="Progress" placement="right">
          <IconButton icon={<FiClock />} color={iconColor} bg={iconBg} onClick={() => navigate("/progressGraph")} />
        </Tooltip>
        <Tooltip label="Profile" placement="right">
          <IconButton icon={<FiUser />}  color={iconColor} bg={iconBg} onClick={() => navigate("/profile")} />
        </Tooltip>

       <Tooltip label={`Streak: ${streak}`} placement="right">
              <IconButton icon={<FaFire />} bg={iconBg} color={streakColor} />     
          </Tooltip>
          <Tooltip label="Toogle Theme" placement="right">
          <IconButton icon={<Icon />}  as={LightMode} />
        </Tooltip>

        <Tooltip label="Logout" placement="right">
          <IconButton icon={<FiLogOut /> } color={iconColor} bg={iconBg} onClick={logoutHandler} />
        </Tooltip>
      </VStack>
    </Box>
  );
};

export default Sidebar;
