import { useColorModeValue } from '@chakra-ui/react'

function useThemeValues() {
  return {      
    bg : useColorModeValue("gray.100", "gray.900"),
    cardBg : useColorModeValue("white", "gray.800"),
    inputTextColor : useColorModeValue("purple.600", "white"),
    inputBg : useColorModeValue("gray.50", "gray.700"),
    textColor : useColorModeValue("purple.600", "purple.400"),
    iconColor : useColorModeValue("purple.600", "purple.400"),
    iconBg : useColorModeValue("purple.100", "purple.50"),
    listitemBg : useColorModeValue("white", "gray.200"),
    theadBg : useColorModeValue("gray.200", "gray.700"),
    theadColor : useColorModeValue("purple.700", "white"),
    numberColor : useColorModeValue("gray.700", "gray.200"),

    tooltipBg : useColorModeValue("white", "black"),
    tooltipColor : useColorModeValue("gray.700", "gray.200")

  }
    
  
}

export default useThemeValues