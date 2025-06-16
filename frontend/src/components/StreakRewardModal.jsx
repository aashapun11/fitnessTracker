import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text, Image } from "@chakra-ui/react";

function StreakRewardModal({ isOpen, onClose, streak }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.900" color="white" textAlign="center">
        <ModalHeader>🔥 Daily Workout Logged!</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text fontSize="lg" mb={3}>
            Completion Streak: <Text as="span" color="orange.300" fontWeight="bold">{streak}</Text> {streak === 1 ? "Day" : "Days"}
          </Text>
          <Text mb={4}>Consistency is your power. See you tomorrow!</Text>
          <Image src="/reward.webp" alt="Reward Coin" mx="auto" boxSize="60px" />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default StreakRewardModal;
