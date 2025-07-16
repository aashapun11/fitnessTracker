// src/components/Sidebar.js
import { Box, VStack, IconButton, Tooltip, Image, Icon } from "@chakra-ui/react";
import {
  FiCalendar, 
  FiClock,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa"; // meal/food


import { useNavigate } from "react-router-dom";
import { workoutState } from "../Context/WorkoutProvider";
import useThemeValues from "../hooks/useThemeValues";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, setUser } = workoutState();
   const streak = user?.streak ?? 0;
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
      
        <Tooltip label="Workout Form" placement="right">
          <IconButton icon={<FiCalendar />} color={iconColor} bg={iconBg} onClick={() => navigate("/workoutForm")} />
        </Tooltip>

          <Tooltip label="Food Tracker" placement="right">
          <IconButton icon={< FaUtensils  />} color={iconColor} bg={iconBg} onClick={() => navigate("/smart-nutrition")} />
        </Tooltip>
        
        <Tooltip label="Progress" placement="right">
          <IconButton icon={<FiClock />} color={iconColor} bg={iconBg} onClick={() => navigate("/progressGraph")} />
        </Tooltip>
        <Tooltip label="Profile" placement="right">
          <IconButton icon={<FiUser />}  color={iconColor} bg={iconBg} onClick={() => navigate("/profile")} />
        </Tooltip>

      

        <Tooltip label="Logout" placement="right">
          <IconButton icon={<FiLogOut /> } color={iconColor} bg={iconBg} onClick={logoutHandler} />
        </Tooltip>
      </VStack>
    </Box>
  );
};

export default Sidebar;
