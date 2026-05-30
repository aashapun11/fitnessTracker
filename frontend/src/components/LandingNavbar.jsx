import {
  Box,
  Flex,
  Button,
  Image,
  HStack,
  Text,
  Icon
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiUser} from "react-icons/fi";


const LandingNavbar = () => {
  return (
    <Box
      position="sticky"
      top="0"
      zIndex="1000"
      bg="rgba(255,255,255,0.9)"
      backdropFilter="blur(12px)"
      borderBottom="1px solid"
      borderColor="gray.100"
    >
      <Flex
        maxW="7xl"
        mx="auto"
        px={6}
        py={4}
        align="center"
        justify="space-between"
      >
        {/* Logo */}
        <Link to="/">
          <Flex align="center" gap={3}>
            <Image
              src="/logo.png"
              alt="Fitness Tracker"
              boxSize="40px"
            />

            <Text
              fontSize="xl"
              fontWeight="800"
              color="purple.700"
            >
              FitTrack
            </Text>
          </Flex>
        </Link>

        {/* Center Nav */}
       
        {/* Actions */}
        <HStack spacing={4}>
          <Button
            as={Link}
            to="/login"
            variant="ghost"
            color="purple.700"
            fontWeight="600"
          >
            Login <Icon as={FiUser} ml={1} />
          </Button>

         
        </HStack>
      </Flex>
    </Box>
  );
};

export default LandingNavbar;