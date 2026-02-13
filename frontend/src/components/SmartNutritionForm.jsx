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
  Tooltip,
   Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import useThemeValues  from "../hooks/useThemeValues";
import { FiMinus } from "react-icons/fi"; // Make sure this import is present
import { workoutState } from "../Context/WorkoutProvider";
function SmartNutritionForm() {
  const [date, setDate] = useState(new Date());
  const [waterGlasses, setWaterGlasses] = useState();
  const [items, setItems] = useState([]);
  const { cardBg, inputBg, textColor, theadColor, theadBg, numberColor} = useThemeValues();
  const { user, setUser } = workoutState();
const { isOpen, onOpen, onClose } = useDisclosure();
const [pendingWaterClick, setPendingWaterClick] = useState(false);
const navigate = useNavigate();
const toast = useToast();


function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeUser() {
  const registration = await navigator.serviceWorker.register("/sw.js");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
  });

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};
const {data} = await axios.post(
  `${import.meta.env.VITE_SERVER_URL}/api/notifications/subscribe`,
  subscription,
  config
);
  const updatedUser = { ...user, pushSubscribed: data.pushSubscribed };
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
}

const handleWaterClick = (action) => {
  // Check if user already subscribed
  if (!user?.pushSubscribed) {
    setPendingWaterClick(action); // store the action to perform later
    onOpen(); // open modal
  } else {
    // Just perform the action if already subscribed
    if (action === "increase") setWaterGlasses((prev) => Math.min(prev + 1, 20));
    if (action === "decrease") setWaterGlasses((prev) => Math.max(prev - 1, 0));
  }
};

const increaseWater = () => handleWaterClick("increase");
const decreaseWater = () => handleWaterClick("decrease");



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
      toast({
        title: "Error",
        description: "Failed to fetch meals",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
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
        toast({
          title: "Error",
          description: "Failed to fetch water",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
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
        toast({
          title: "Error",
          description: "Failed to save water",
          status: "error",
          duration: 5000,
          isClosable: true
        })
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
  variant={"secondary"}
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
          <Td isNumeric color={numberColor}>{Math.round(item.calories)}</Td>
          <Td isNumeric color={numberColor}>{Math.round(item.carbs)}</Td>
          <Td isNumeric color={numberColor}>{Math.round(item.protein)}</Td>
          <Td isNumeric color={numberColor}>{Math.round(item.fat)}</Td>
          <Td isNumeric color={numberColor}>{Math.round(item.sugar)}</Td>
          <Td isNumeric color={numberColor}>{Math.round(item.fiber)}</Td>
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
  variant="secondary"
    onClick={() => navigate(`/add-food?mealType=${mealType}&date=${date.toISOString().slice(0, 10)}`)}

>
  Add Food
</Button>

        </Td>
        <Td isNumeric fontWeight="bold" color={numberColor}>{Math.round(total.calories)}</Td>
        <Td isNumeric fontWeight="bold" color={numberColor}>{Math.round(total.carbs)}</Td>
        <Td isNumeric fontWeight="bold" color={numberColor}>{Math.round(total.protein)}</Td>
        <Td isNumeric fontWeight="bold" color={numberColor}>{Math.round(total.fat)}</Td>
        <Td isNumeric fontWeight="bold" color={numberColor}>{Math.round(total.sugar)}</Td>
        <Td isNumeric fontWeight="bold" color={numberColor}>{Math.round(total.fiber)}</Td>
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
    alert("Could not delete item. Try again later.");
  }
};



  return (
    <Box p={4} minH="100vh" color={textColor}>
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
          <Text fontWeight="bold" fontSize="2xl" color={textColor}>
            Your Food Diary For:
          </Text>


         <HStack spacing={3} flexWrap="wrap">
  <Button
    size="sm"
    onClick={onPrevDay}
    color={"orange.500"}
    variant="ghost"
    leftIcon={<ChevronLeftIcon />}
  >
    Prev
  </Button>

  {/* Full Date on Desktop */}
  <Text
    fontWeight="semibold"
    fontSize="md"
    display={{ base: "none", md: "block" }}
  >
    {new Date(date).toLocaleDateString("en-US", {
      weekday: "long", // Wednesday
      year: "numeric", // 2025
      month: "long",   // August
      day: "numeric",  // 6
    })}
  </Text>

  {/* Short Date on Mobile */}
  <Text
    fontWeight="semibold"
    fontSize="md"
    display={{ base: "block", md: "none" }}
  >
    {new Date(date).toLocaleDateString("en-US", {
      weekday: "short", // Wed
      month: "short",   // Aug
      day: "numeric",   // 6
      year: "numeric",  // 2025
    })}
  </Text>

  <Button
    size="sm"
    onClick={onNextDay}
    color={"orange.500"}
    variant="ghost"
    rightIcon={<ChevronRightIcon />}
    isDisabled={selectedDateStart.getTime() >= today.getTime()}
  >
    Next
  </Button>
</HStack>
</Flex>

        {/* Unified Table View */}
        <Box overflowX="auto">
  <Table size="sm" minW="800px">
    <Thead bg={theadBg}>
      <Tr>
        <Th color={theadColor}>Meal</Th>
        <Th color={theadColor}>Food</Th>
        <Th isNumeric color={theadColor}>Calories</Th>
        <Th isNumeric color={theadColor}>Carbs (g)</Th>
        <Th isNumeric color={theadColor}>Protein (g)</Th>
        <Th isNumeric color={theadColor}>Fat (g)</Th>
        <Th isNumeric color={theadColor}>Sugar (g)</Th>
        <Th isNumeric color={theadColor}>Fiber (g)</Th>
        <Th color={theadColor}></Th>
      </Tr>
    </Thead>
    <Tbody>
      {/* Render meal rows */}
      {mealTypes.flatMap((mealType) => renderMealTableRows(mealType))}
      {/* Totals row */}
      <Tr bg={inputBg}>
        <Td fontWeight="bold" colSpan={2}>Total</Td>
        <Td isNumeric fontWeight="bold">{Math.round(overallTotals.calories)}</Td>
        <Td isNumeric fontWeight="bold">{Math.round(overallTotals.carbs)}</Td>
        <Td isNumeric fontWeight="bold">{Math.round(overallTotals.protein)}</Td>
        <Td isNumeric fontWeight="bold">{Math.round(overallTotals.fat)}</Td>
        <Td isNumeric fontWeight="bold">{Math.round(overallTotals.sugar)}</Td>
        <Td isNumeric fontWeight="bold">{Math.round(overallTotals.fiber)}</Td>
      </Tr>
    </Tbody>
  </Table>
</Box>


      <Box mt={10} p={4} bg={cardBg} boxShadow="md" borderRadius="md" border="1px solid" borderColor="gray.200">
  <Text fontWeight="bold" fontSize="lg" mb={3}>
    Water Intake
  </Text>

  <Flex align="center" gap={4}>
    <Button onClick={decreaseWater} variant="outline" size="sm" borderColor="orange.500" color="orange.500"
    _hover={{ bg: "orange.500", color: "white"}}>-</Button>

    <Text fontSize="md">{waterGlasses} Glass{waterGlasses !== 1 && 'es'}</Text>

    <Button onClick={increaseWater} size="sm" bg="orange.500" color="white" _hover={{ bg: "orange.600" }}>+</Button>
  </Flex>

  <Box mt={3}>
    <Text fontSize="sm" color="gray.500">Goal: 8 Glasses (Approx. 2 Liters)</Text>
    <Box mt={1}>
      <Box bg="gray.200" h="6px" w="100%" borderRadius="md">
        <Box
          h="6px"
          bg="purple.500"
          width={`${(waterGlasses / 8) * 100}%`}
          borderRadius="md"
          maxW={"100%"} />
      </Box>
    </Box>
  </Box>
</Box>
{/* Asking for user permission to send notifications */}
<Modal isOpen={isOpen} onClose={onClose} isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Enable Water Reminders?</ModalHeader>
    <ModalBody>
      To help you stay hydrated, we can send browser notifications for water intake.
    </ModalBody>
    <ModalFooter>
      <Button variant="ghost" mr={3} onClick={() => {
        // Cancel
        onClose();
      }}>
        No, Thanks
      </Button>
      <Button colorScheme="orange" onClick={async () => {
        try {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            await subscribeUser(); // your push subscription logic
          }
        } catch(err) {
          toast({
            title: "Error",
            description: err.message,
            status: "error",
            duration: 5000,
            isClosable: true
          })
        } finally {
          // Perform the water action after subscription attempt
          if (pendingWaterClick === "increase") setWaterGlasses((prev) => Math.min(prev + 1, 20));
          if (pendingWaterClick === "decrease") setWaterGlasses((prev) => Math.max(prev - 1, 0));
          onClose();
        }
      }}>
        Yes, Enable
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

</Box>
</Box>


  );
}

export default SmartNutritionForm;
 