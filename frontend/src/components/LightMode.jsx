import React from 'react'
import { useColorMode, IconButton, HStack } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa"; // ✨ Icons


function LightMode() {
    const { colorMode, toggleColorMode } = useColorMode(); // ✨ Hook

  return (
    <HStack w="full" justifyContent="flex-end">

    <IconButton
    icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
    onClick={toggleColorMode}
    aria-label="Toggle Dark Mode"
    size="sm"
    borderRadius="full"
    colorScheme="orange"
    boxSize="40px" // Same size as avatar
  />
    </HStack>
  )
}

export default LightMode