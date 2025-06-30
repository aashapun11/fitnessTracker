import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const VerifyEmailPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      toast({
        title: "Invalid link",
        status: "error",
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    const verifyEmail = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/verify-email?token=${token}`);
        toast({
          title: "Email verified successfully!",
          status: "success",
          isClosable: true,
        });
        navigate("/login");
      } catch (err) {
        toast({
          title: "Verification failed",
          description: err.response?.data?.message || "Something went wrong",
          status: "error",
          isClosable: true,
        });
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      {loading ? <p>Verifying your email...</p> : <p>Redirecting...</p>}
    </div>
  );
};

export default VerifyEmailPage;
