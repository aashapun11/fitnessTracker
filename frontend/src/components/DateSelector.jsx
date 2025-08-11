import React, { useRef } from "react";
import { Box, Text, Button, VStack , HStack,Icon} from "@chakra-ui/react";
import {
  FiCalendar
} from "react-icons/fi";

function DateSelector({ selectedDate, setSelectedDate }) {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (inputRef.current) {
      // Try showPicker if supported
      if (inputRef.current.showPicker) {
        inputRef.current.showPicker();
      } else {
        // fallback: focus the input (might or might not open picker)
        inputRef.current.focus();
      }
    }
  };

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box cursor="pointer" userSelect="none" w="max-content" position="relative">
        
        <HStack spacing={2}>
        <Button
        onClick={handleClick}
        colorScheme="blue"
        variant="solid"
        size="md"
        borderRadius="md"
        
      >
        <Icon as={FiCalendar} mr={2} />
        Select Date 
      </Button>
      <Text fontWeight="semibold" fontSize="md" userSelect="none" m={4}>
     {formattedDate}
      </Text>
      </HStack>

      
      <input
        ref={inputRef}
        type="date"
        value={selectedDate.toISOString().split("T")[0]}
        onChange={(e) => {
          const [year, month, day] = e.target.value.split("-");
          setSelectedDate(new Date(year, month - 1, day));
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "auto",
          zIndex: -1,
        }}
      />
    </Box>
  );
}

export default DateSelector;
