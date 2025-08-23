import React from 'react'
import { useColorModeValue } from '@chakra-ui/react'

function useThemeValues() {
  return {      
    cardBg : useColorModeValue("white", "gray.800"),
    inputBg : useColorModeValue("gray.100", "gray.700"),
    textColor : useColorModeValue("blue.700", "blue.200"),
    iconColor : useColorModeValue("blue.900", "blue.900"),
    iconBg : useColorModeValue("gray.200", "gray.300"),

  }
    
  
}

export default useThemeValues