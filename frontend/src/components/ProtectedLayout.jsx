import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  return (
      <Box p={4}>
        <Outlet /> {/* This renders the child routes */}
      </Box>
  );
};

export default ProtectedLayout;
