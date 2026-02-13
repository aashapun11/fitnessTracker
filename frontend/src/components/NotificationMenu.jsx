import {
  Box,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  VStack,
  HStack,
  Text,
  Divider,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  useBreakpointValue,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import useThemeValues from "../hooks/useThemeValues";

export default function Notifications({
  notifications,
  unreadCount,
  handleBellClick,
  icons,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ✅ Detect mobile/desktop
  const isMobile = useBreakpointValue({ base: true, md: false });

  const {iconColor, textColor} = useThemeValues();

  return (
    <>
      {isMobile ? (
        // ✅ MOBILE: Bell opens a Drawer
        <IconButton
          icon={
            <Box position="relative">
              <BellIcon boxSize={9} />
              {unreadCount > 0 && (
                <Badge
                  colorScheme="red"
                  bg="red.500"
                  borderRadius="full"
                  position="absolute"
                  top="-1"
                  right="-1"
                  fontSize="0.8em"
                  px="2"
                >
                  {unreadCount}
                </Badge>
              )}
            </Box>
          }
          variant="ghost"
          onClick={onOpen}
          aria-label="Notifications"
        />
      ) : (
        // ✅ DESKTOP: Bell opens a dropdown Menu
        <Menu>
          <MenuButton
            as={IconButton}
            icon={
              <Box position="relative">
                <BellIcon boxSize={9} color={iconColor} />
                {unreadCount > 0 && (
                  <Badge
                    colorScheme="red"
                    bg="red.500"
                    borderRadius="full"
                    position="absolute"
                    top="-1"
                    right="-1"
                    fontSize="1.1em"
                    px="2"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Box>
            }
            variant="ghost"
            onClick={handleBellClick}
          />
          <MenuList maxH="350px" overflowY="auto" p={0} minW="300px">
            {notifications.length === 0 ? (
              <Box p={4} textAlign="center" color={textColor}>
                No notifications
              </Box>
            ) : (
              <VStack align="stretch" spacing={0} divider={<Divider />}>
                {notifications.map((n, idx) => (
                  <Box
                    key={n._id || idx}
                    bg={n.isRead ? "white" : "gray.50"}
                    p={3}
                    _hover={{ bg: "gray.100" }}
                  >
                    <HStack align="flex-start" spacing={3}>
                      <Text fontSize="xl">{icons[n.type]}</Text>
                      <Box flex="1">
                        <HStack justify="space-between" mb={1}>
                          <Text fontWeight="bold" textTransform="capitalize">
                            {n.type}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {new Date(n.createdAt).toLocaleString()}
                          </Text>
                        </HStack>
                        <Text textAlign="left" fontSize="sm" color="gray.700">
                          {n.message}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </MenuList>
        </Menu>
      )}

      {/* ✅ MOBILE Drawer */}
      {isMobile && (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerBody p={0}>
              {notifications.length === 0 ? (
                <Box p={4} textAlign="center" color={textColor}>
                  No notifications
                </Box>
              ) : (
                <VStack align="stretch" spacing={0} divider={<Divider />}>
                  {notifications.map((n, idx) => (
                    <Box
                      key={n._id || idx}
                      bg={n.isRead ? "white" : "gray.50"}
                      p={3}
                      _hover={{ bg: "gray.100" }}
                    >
                      <HStack align="flex-start" spacing={3}>
                        <Text fontSize="xl">{icons[n.type]}</Text>
                        <Box flex="1">
                          <HStack justify="space-between" mb={1}>
                            <Text fontWeight="bold" textTransform="capitalize">
                              {n.type}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {new Date(n.createdAt).toLocaleString()}
                            </Text>
                          </HStack>
                          <Text
                            textAlign="left"
                            fontSize="sm"
                            color="gray.700"
                          >
                            {n.message}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
