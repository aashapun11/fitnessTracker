import React from 'react'
import { useColorMode, IconButton, HStack } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa"; // ✨ Icons


function LightMode() {
    const { colorMode, toggleColorMode } = useColorMode(); // ✨ Hook

    // useColorMode controls the global color mode state,
    //  toggleColorMode updates it, and
    //  useColorModeValue derives theme values based on the current color mode.

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