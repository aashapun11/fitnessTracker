// Footer.js
import React from "react";
import { Box, Flex, Text, IconButton, VStack, HStack, Link, Divider } from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box bg="purple.50" borderTop="2px solid #eee" pt={10} pb={6} px={6} mt={10}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        maxW="7xl"
        mx="auto"
        gap={6}
      >
        {/* Logo & Quote */}
        <VStack align="start" spacing={2}>
          <Text fontSize="lg" fontWeight="bold" color="purple.700">
            Fitness Tracker
          </Text>
          <Text fontSize="sm" color="gray.600" maxW="300px">
            “Discipline is the bridge between goals and accomplishment.”
          </Text>
        </VStack>

        {/* Navigation */}
        <HStack spacing={8}>
          <Link as={RouterLink} to="/" color="gray.600" fontSize="sm" _hover={{ color: "orange.400" }}>
            Home
          </Link>
          <Link as={RouterLink} to="/login" color="gray.600" fontSize="sm" _hover={{ color: "orange.400" }}>
            Sign In
          </Link>
          <Link as={RouterLink} to="/" color="gray.600" fontSize="sm" _hover={{ color: "orange.400" }}>
            Features
          </Link>
        </HStack>

        {/* Social Icons */}
        <HStack spacing={4}>
          <IconButton
            as="a"
            href="#"
            aria-label="Instagram"
            icon={<FaInstagram />}
            size="sm"
            bg="white"
            borderRadius="full"
            color="purple.500"
            _hover={{ bg: "orange.100", color: "orange.400" }}
          />
          <IconButton
            as="a"
            href="#"
            aria-label="Twitter"
            icon={<FaTwitter />}
            size="sm"
            bg="white"
            borderRadius="full"
            color="purple.500"
            _hover={{ bg: "orange.100", color: "orange.400" }}
          />
          <IconButton
            as="a"
            href="#"
            aria-label="Facebook"
            icon={<FaFacebookF />}
            size="sm"
            bg="white"
            borderRadius="full"
            color="purple.500"
            _hover={{ bg: "orange.100", color: "orange.400" }}
          />
        </HStack>
      </Flex>

      <Divider my={6} borderColor="gray.300" />

      <Text textAlign="center" fontSize="xs" color="gray.500">
        &copy; {new Date().getFullYear()} Fitness Tracker. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
