import React from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  Spacer,
  Avatar,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import LightMode from "./LightMode"; // ✅ Import your custom toggle
import {NavLink, useNavigate} from "react-router-dom";
import { workoutState } from "../Context/WorkoutProvider";
import {FaFire} from "react-icons/fa"



function Navbar() {
  const Navigate = useNavigate();

  const {user, setUser} = workoutState();
  const streakColor = user.streak > 0 ? "orange.500" : "gray.500";

  const logoutHandler = () => {
    localStorage.removeItem("token"); // remove JWT
    localStorage.removeItem("userInfo");
    setUser(null);
    Navigate("/login");
  };
  
  return (
    <Box px={3} py={3} boxShadow="md">
      <Flex align="center">
        {/* Logo / Brand */}
    <Box as={NavLink} to="/workoutForm">
    <Image
      src="/logo.png" // ✅ your downloaded image in public folder
      alt="Fitness Logo"
      boxSize="36px"
      borderRadius="full"
      objectFit="cover"
      
    />
    </Box>
    
        <Spacer />

        {/* Right Side: LightMode toggle & Profile */}
      
        <Flex gap={4} align="center">

           <Box display="flex" alignItems="center" gap={1}>
    <Icon as={FaFire} color={streakColor} boxSize={7} />

  <Text fontSize="lg" fontWeight="semibold" color={streakColor}>
    {user.streak}
  </Text>
</Box>


          <LightMode /> {/* ✅ Your existing toggle */}
          <Menu>
            <MenuButton>
              <Avatar size="sm" boxSize={"41px"}  name= {user.name} src="" />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => Navigate("/profile")}>My Profile</MenuItem>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;
