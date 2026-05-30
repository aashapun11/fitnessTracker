import React from 'react'
import {Box, Flex, Spacer, Image, Text} from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'
import useThemeValues from '../../hooks/useThemeValues'
import LightMode from "../LightMode";

function LoginSignupNavbar() {
    const { cardBg, textColor } = useThemeValues();
  return (
        <Box
  bg={cardBg}
  px={6}
  py={3}
  boxShadow="lg"
  color={textColor}
>
  <Flex
    maxW="1200px"
    mx="auto"
    align="center"
    justify="space-between"
  >
    {/* Logo */}
    <Box as={NavLink} to="/">
      <Image
        src="/logo.png"
        alt="Fitness Logo"
        boxSize="60px"
        borderRadius="full"
        objectFit="cover"
      />
    </Box>

    {/* Navigation */}
    <Flex align="center" gap={12}>
      <NavLink to="/login">
        {({ isActive }) => (
          <Text
            fontWeight="bold"
            fontSize={"xl"}
            color={isActive ? "orange.500" : textColor}
            _hover={{ color: "orange.500" }}
          >
            Log In
          </Text>
        )}
      </NavLink>

      <NavLink to="/signup">
        {({ isActive }) => (
          <Text
            fontWeight="bold"
            fontSize={"xl"}
            color={isActive ? "orange.500" : textColor}
            _hover={{ color: "orange.500" }}
          >
            Sign Up
          </Text>
        )}
      </NavLink>

      <LightMode />
    </Flex>
  </Flex>
</Box>

  )
}

export default LoginSignupNavbar
