import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    components: {
      Input: {
      variants: {
        outline: {
          field: {
            borderColor: "gray.400",
            borderWidth: "2px",
            _hover: {
              borderColor: "purple.400",
            },
            _focus: {
              borderColor: "purple.400",
              boxShadow: "none",
            },
          },
        },
      },
    },
      Select: {
      variants: {
        outline: {
          field: {
            borderColor: "gray.400",
            borderWidth: "2px",
            _hover: {
              borderColor: "purple.400",
            },
            _focus: {
              borderColor: "purple.400",
              boxShadow: "none",
            },
          },
        },
      },
    },
    
    Button: {
      variants: {
        primary: {
          bg: "orange.500",
          color: "white",
          _hover: { bg: "orange.600" },
          _active: { bg: "orange.700" },
          borderRadius: "2xl",

        },
        secondary: {
  border: "2px solid",
  borderColor: "orange.500",
  color: "orange.500",
  bg: "transparent",
  _hover: {
    bg: "orange.500",
    color: "white",
  },
  borderRadius: "xl",
}

      }
    },
  },
});

export default theme;
