import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  Select,
  VStack,
  Text,
  HStack,
  List,
  ListItem,
  Image,
  Spinner,
  Heading,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "./Navbar"
import useThemeValues from "../hooks/useThemeValues";

function AddFoodForm() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [unit, setUnit] = useState("cup");
  const [quntity, setQuntity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const mealType = searchParams.get("mealType");
  const { textColor, cardBg } = useThemeValues();

  const navigate = useNavigate();
  const toast = useToast();

  // Fetch suggestions on search
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!search.trim()) return setSuggestions([]);
      try {
        const { data } = await axios.get(
          `https://api.spoonacular.com/food/ingredients/autocomplete`,
          {
            params: {
              apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY,
              query: search,
              number: 10,
            },
          }
        );
        setSuggestions(data);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error fetching suggestions",
          status: "error",
          isClosable: true,
        });
      }
    };
    const delayDebounce = setTimeout(fetchSuggestions, 1000);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleSelectSuggestion = (name) => {
    setSearch(name);
    setSelectedFood(name);
    setSuggestions([]);
  };

  const handleSubmit = async () => {
    if (!selectedFood) return;
    try {
      setLoading(true);
      const { data } = await axios.post(
        `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${import.meta.env.VITE_SPOONACULAR_API_KEY}&includeNutrition=true`,
        new URLSearchParams({
          ingredientList: `${quntity} ${unit} ${selectedFood}`,
          servings: 1,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const parsed = data[0];
      const nutrients = {};
      parsed.nutrition.nutrients.forEach((n) => {
        if (["Calories", "Carbohydrates", "Protein", "Fat", "Sugar", "Fiber"].includes(n.name)) {
          nutrients[n.name.toLowerCase()] = n.amount;
        }
      });

      const newItem = {
        _id: Date.now(),
        food: selectedFood,
        calories: nutrients.calories || 0,
        carbs: nutrients.carbohydrates || 0,
        protein: nutrients.protein || 0,
        fat: nutrients.fat || 0,
        sugar: nutrients.sugar || 0,
        fiber: nutrients.fiber || 0,
        mealType,
        date: new Date().toISOString().split("T")[0], // e.g. "2025-07-15"

      };
      const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

       await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/nutrition/addNutrition`, 
        newItem,
        config
      );

      toast({ title: "Food added", status: "success", isClosable: true });

      navigate("/smart-nutrition");
    } catch (err) {
      console.error(err);
      toast({
        title: "Error adding food",
        status: "error",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (

    <Box 
     p={4} 
      color={textColor}
    >

          <Navbar/>

          <div style={{ textAlign: "center" }} >
            <Heading mt={4}>My Diet Tracker</Heading>
      <Text mt={2}>Track your diet & nutrition</Text>
          </div>

         

    <Box p={6} maxW="lg" mx="auto" mt={6} bg={cardBg} boxShadow="xl" borderRadius="lg">

      

      <VStack spacing={4} align="stretch">
        <Box>
          <Text mb={1}>Search Ingredient:</Text>
          <Input
            placeholder="e.g. rice, tomato soup..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedFood(null);
            }}
          />
          {suggestions.length > 0 && (
            <List mt={1} border="1px solid #ccc" borderRadius="md" maxH="200px" overflowY="auto">
              {suggestions.map((item) => (
                <ListItem
                  key={item.name}
                  px={3}
                  py={2}
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                  onClick={() => handleSelectSuggestion(item.name)}
                >
                  <HStack>
                    <Image
                      src={`https://spoonacular.com/cdn/ingredients_100x100/${item.image}`}
                      alt={item.name}
                      boxSize="30px"
                      borderRadius="full"
                    />
                    <Text>{item.name}</Text>
                  </HStack>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box>
<Text mb={1}>Unit:</Text>
<Select value={unit} onChange={(e) => setUnit(e.target.value)}>
  {/* Volume-based */}
  <option value="tablespoon">Tablespoon (tbsp)</option>
  <option value="cup">Cup</option>
  <option value="ml">Milliliter (ml)</option>
  <option value="l">Liter (l)</option>

  {/* Weight-based */}
  <option value="gram">Gram (g)</option>
  <option value="kilogram">Kilogram (kg)</option>

  {/* Whole items */}
  <option value="piece">Piece</option>
  <option value="slice">Slice</option>
  <option value="package">Package</option>
  <option value="can">Can</option>
  <option value="stick">Stick</option>
</Select>

        </Box>

        <Box>
          <Text mb={1}>Quntity:</Text>
          <Input
            type="number"
            min={1}
            value={quntity}
            onChange={(e) => setQuntity(Number(e.target.value))}
          />
        </Box>

        <Button 
    
              bgGradient="linear(to-r, purple.400, blue.400)"
              _hover={{ bgGradient: "linear(to-r, purple.500, blue.500)" }}
              color={textColor}
              w="100%"
              onClick={handleSubmit} isLoading={loading}>
          Add Food
        </Button>
      </VStack>
    </Box>
    </Box>

  );
}

export default AddFoodForm;
