// src/components/Sidebar.js
import { Box, VStack, IconButton, Tooltip, Image, Icon } from "@chakra-ui/react";
import { FaDumbbell, FaUtensils, FaChartLine, FaUser, FaSignOutAlt } from "react-icons/fa"; 

import { useNavigate } from "react-router-dom";
import { workoutState } from "../Context/WorkoutProvider";
import useThemeValues from "../hooks/useThemeValues";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, setUser } = workoutState();
   const streak = user?.streak ?? 0;
  const {cardBg, inputBg, textColor, iconColor, iconBg} = useThemeValues();

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
      bg={cardBg}
      borderRight="1px solid #e2e8f0"
      position="fixed"
      top="0"
      left="0"
      zIndex="1000"
      py={4}
      px={2}
    
    >
      <VStack spacing={12} >
        {/* Logo */}
        <Image src="/logo.png" boxSize="40px" alt="Logo" />

        {/* Icons */}
      
        <Tooltip label="Add Workout" placement="right">
          <IconButton icon={<FaDumbbell />} color={iconColor} bg={iconBg} onClick={() => navigate("/workoutForm")} />
        </Tooltip>

          <Tooltip label="Add Food" placement="right">
          <IconButton icon={< FaUtensils  />} color={iconColor} bg={iconBg} onClick={() => navigate("/smart-nutrition")} />
        </Tooltip>
        
        <Tooltip label="Track Progress" placement="right">
          <IconButton icon={<FaChartLine />} color={iconColor} bg={iconBg} onClick={() => navigate("/progressGraph")} />
        </Tooltip>
        
        <Tooltip label="Profile" placement="right">
          <IconButton icon={<FaUser />}  color={iconColor} bg={iconBg} onClick={() => navigate("/profile")} />
        </Tooltip>
        
        <Tooltip label="Logout" placement="right">
          <IconButton icon={<FaSignOutAlt /> } color={iconColor} bg={iconBg} onClick={logoutHandler} />
        </Tooltip>
      </VStack>
    </Box>
  );
};

export default Sidebar;
