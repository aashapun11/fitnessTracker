import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Flex,
  IconButton,
  Tooltip 
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import useThemeValues  from "../hooks/useThemeValues";
import { FiMinus } from "react-icons/fi"; // Make sure this import is present


function SmartNutritionForm() {
  const [date, setDate] = useState(new Date());
  const [waterGlasses, setWaterGlasses] = useState();
  const [items, setItems] = useState([]);
  const { cardBg, inputBg, textColor } = useThemeValues();



  const navigate = useNavigate();

const increaseWater = () => {
    setWaterGlasses((prev) => Math.min(prev + 1, 20));
  };

  const decreaseWater = () => {
    setWaterGlasses((prev) => Math.max(prev - 1, 0));
  };



  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDateStart = new Date(date);
  selectedDateStart.setHours(0, 0, 0, 0);

  const onPrevDay = () =>
    setDate((prev) => new Date(new Date(prev).getTime() - 86400000));

  const onNextDay = () =>
    setDate((prev) => new Date(new Date(prev).getTime() + 86400000));

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];




useEffect(() => {
  const fetchMeals = async () => {
    const selectedDateStr = date.toISOString().slice(0, 10); // "2025-07-15"

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { date: selectedDateStr },
      };
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/nutrition/getNutrition`,
        config
      );

      setItems(res.data); // Update your state

    } catch (err) {
      console.error("Failed to fetch meals:", err);
    }
  };


  const fetchWater = async () => {
        if (waterGlasses === null) return; // avoid initial 0 overwrite

      const selectedDateStr = date.toISOString().slice(0, 10);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { date: selectedDateStr },
      };
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/water/getWater`,
          config
        );
        setWaterGlasses(res.data?.waterGlasses || 0);
      } catch (err) {
        console.error("Failed to fetch water:", err);
      }
    };

  fetchMeals();
      fetchWater();

}, [date]); // re-fetch if the user changes date


useEffect(() => {
    if (waterGlasses === null) return; // avoid initial 0 overwrite

    const selectedDateStr = date.toISOString().slice(0, 10);
  

    const saveWater = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
      try {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/water/updateWater`, {
          waterGlasses: waterGlasses,
          date: selectedDateStr
        },
      config
      );
      } catch (err) {
        console.error("Failed to update water intake:", err);
      }
    };

    saveWater();
  }, [waterGlasses]);


 const renderMealTableRows = (mealType) => {
  const filteredItems = items.filter((item) => item.mealType === mealType);

  const total = {
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    sugar: 0,
    fiber: 0,
  };

  filteredItems.forEach((item) => {
    total.calories += item.calories || 0;
    total.carbs += item.carbs || 0;
    total.protein += item.protein || 0;
    total.fat += item.fat || 0;
    total.sugar += item.sugar || 0;
    total.fiber += item.fiber || 0;
  });

  const rows = [];

  if (filteredItems.length === 0) {
    // No food row
    rows.push(
      <Tr key={`${mealType}-empty`}>
        <Td fontWeight="bold" rowSpan={2}>
          {mealType}
        </Td>
        <Td colSpan={8} textAlign="center" color="gray.500" fontStyle="italic">
          
        </Td>
      </Tr>
    );

    // Add Food row
    rows.push(
      <Tr key={`${mealType}-add-empty`}>
        <Td colSpan={8}>
          <Button
  size="sm"
  colorScheme="blue"
  variant="outline"
  onClick={() => navigate(`/add-food?mealType=${mealType}&date=${date.toISOString().slice(0, 10)}`)}
>
  Add Food
</Button>

        </Td>
      </Tr>
    );
  } else {
    // Food rows
    filteredItems.forEach((item, index) => {
      rows.push(
        <Tr key={item._id}>
          {index === 0 && (
            <Td fontWeight="bold" rowSpan={filteredItems.length + 1}>
              {mealType}
            </Td>
          )}
          <Td>{item.food}</Td>
          <Td isNumeric>{Math.round(item.calories)}</Td>
          <Td isNumeric>{Math.round(item.carbs)}</Td>
          <Td isNumeric>{Math.round(item.protein)}</Td>
          <Td isNumeric>{Math.round(item.fat)}</Td>
          <Td isNumeric>{Math.round(item.sugar)}</Td>
          <Td isNumeric>{Math.round(item.fiber)}</Td>
          <Td>
  <Tooltip label="Delete" hasArrow bg="red.500" color="white">
    <IconButton
      icon={<FiMinus />}
      size={"12px"}
      colorScheme="red"
      aria-label="Delete food item"
      onClick={() => handleDelete(item._id)}
      borderRadius="full"
      _hover={{ bg: "red.100", color: "red.600" }}
    />
  </Tooltip>
</Td>
        </Tr>
      );
    });

    // Add Food + Totals row
    rows.push(
      <Tr key={`${mealType}-add`}>
        <Td colSpan={1}>
          <Button
  size="sm"
  colorScheme="blue"
  variant="outline"
    onClick={() => navigate(`/add-food?mealType=${mealType}&date=${date.toISOString().slice(0, 10)}`)}

>
  Add Food
</Button>

        </Td>
        <Td isNumeric fontWeight="bold">{Math.round(total.calories)}</Td>
        <Td isNumeric fontWeight="bold">{Math.round(total.carbs)}</Td>
        <Td isNumeric fontWeight="bold">{Math.round(total.protein)}</Td>
        <Td isNumeric fontWeight="bold">{Math.round(total.fat)}</Td>
        <Td isNumeric fontWeight="bold">{Math.round(total.sugar)}</Td>
        <Td isNumeric fontWeight="bold">{Math.round(total.fiber)}</Td>
      </Tr>
    );
  }

  // Divider row between meal types
  rows.push(
    <Tr key={`${mealType}-divider`}>
      <Td colSpan={9} p={0}>
        <Box height="2px" bg="gray.400" />
      </Td>
    </Tr>
  );

  return rows;
};

const overallTotals = items.reduce(
  (totals, item) => {
    totals.calories += item.calories || 0;
    totals.carbs += item.carbs || 0;
    totals.protein += item.protein || 0;
    totals.fat += item.fat || 0;
    totals.sugar += item.sugar || 0;
    totals.fiber += item.fiber || 0;
    return totals;
  },
  {
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    sugar: 0,
    fiber: 0,
  }
);

const handleDelete = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this food item?");
  if (!confirmed) return;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/nutrition/deleteNutrition/${id}`, config);

    // Update state locally without refetching
    setItems((prev) => prev.filter((item) => item._id !== id));
  } catch (err) {
    console.error("Failed to delete item:", err);
    alert("Could not delete item. Try again later.");
  }
};



  return (
    <Box p={4} minH="100vh" color={textColor}
>
      <Navbar />
      <Box
        maxW="900px"
        mx="auto"
        bg= {cardBg}
        boxShadow="2xl"
        borderRadius="2xl"
        px={6}
        py={5}
        mt={6}
        border="1px solid"
        borderColor="gray.200"
      >
        {/* Date Header */}
        <Flex justify="center" align="center" mb={6} wrap="wrap" gap={2} bg={inputBg} p={2} borderRadius={"md"}>
          <Text fontWeight="bold" fontSize="2xl" color="blue.600">
            Your Food Diary For:
          </Text>


          <HStack spacing={3}>
            <Button
              size="sm"
              onClick={onPrevDay}

              colorScheme="blue"
              variant="ghost"
              leftIcon={<ChevronLeftIcon />}
            >
              Prev
            </Button>

            <Text fontWeight="semibold" fontSize="md">
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>

            <Button
              size="sm"
              onClick={onNextDay}
              colorScheme="blue"
              variant="ghost"
              rightIcon={<ChevronRightIcon />}
              isDisabled={selectedDateStart.getTime() >= today.getTime()}
            >
              Next
            </Button>
          </HStack>
        </Flex>

        {/* Unified Table View */}
        <Table variant="simple" size="sm">
          <Thead bg={inputBg} p={2}>
            <Tr>
              <Th>Meal</Th>
              <Th>Food</Th>
              <Th isNumeric>Calories</Th>
              <Th isNumeric>Carbs (g)</Th>
              <Th isNumeric>Protein (g)</Th>
              <Th isNumeric>Fat (g)</Th>
              <Th isNumeric>Sugar (g)</Th>
              <Th isNumeric>Fiber (g)</Th>
            </Tr>
          </Thead>
          <Tbody>
  {mealTypes.flatMap((mealType) => renderMealTableRows(mealType))}

  {/* Grand Total Row */}
  <Tr bg={inputBg}>
    <Td fontWeight="bold" colSpan={2}>
      Total
    </Td>
    <Td isNumeric fontWeight="bold">
      {Math.round(overallTotals.calories)}
    </Td>
    <Td isNumeric fontWeight="bold">
      {Math.round(overallTotals.carbs)}
    </Td>
    <Td isNumeric fontWeight="bold">
      {Math.round(overallTotals.protein)}
    </Td>
    <Td isNumeric fontWeight="bold">
      {Math.round(overallTotals.fat)}
    </Td>
    <Td isNumeric fontWeight="bold">
      {Math.round(overallTotals.sugar)}
    </Td>
    <Td isNumeric fontWeight="bold">
      {Math.round(overallTotals.fiber)}
    </Td>
  </Tr>
</Tbody>

        </Table>


      <Box mt={10} p={4} bg={cardBg} boxShadow="md" borderRadius="md" border="1px solid" borderColor="gray.200">
  <Text fontWeight="bold" fontSize="lg" mb={3}>
    Water Intake
  </Text>

  <Flex align="center" gap={4}>
    <Button onClick={decreaseWater} colorScheme="blue" variant="outline" size="sm">-</Button>

    <Text fontSize="md">{waterGlasses} Glass{waterGlasses !== 1 && 'es'}</Text>

    <Button onClick={increaseWater} colorScheme="blue" size="sm">+</Button>
  </Flex>

  <Box mt={3}>
    <Text fontSize="sm" color="gray.500">Goal: 8 Glasses (Approx. 2 Liters)</Text>
    <Box mt={1}>
      <Box bg="gray.200" h="6px" w="100%" borderRadius="md">
        <Box
          h="6px"
          bg="blue.500"
          width={`${(waterGlasses / 8) * 100}%`}
          borderRadius="md"
          maxW={"100%"}

          
        />
      </Box>
    </Box>
  </Box>
</Box>
</Box>


    </Box>
  );
}

export default SmartNutritionForm;
 