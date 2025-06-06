import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { gsap } from "gsap";

const NotFound = () => {
  const iconRef = useRef(null);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    gsap.to(iconRef.current, {
      keyframes: [
        { x: -3, y: 0 },
        { x: 3, y: 1 },
        { x: -3, y: -1 },
        { x: 3, y: 1 },
        { x: -2, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: 0 },
      ],
      duration: 0.6,
      repeat: -1,
      ease: "power1.inOut",
    });

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          navigate("/");
          clearInterval(interval);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-accent text-primary p-10 rounded-2xl shadow-2xl w-full max-w-md text-center border border-primary"
      >
        <div className="flex justify-center mb-4">
          <div ref={iconRef} className="text-error text-7xl">
            <FaSearch />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold mb-2 tracking-wide text-secondary">
          404 - Page Not Found
        </h1>
        <p className="text-primary mb-6 leading-relaxed">
          Oops! The page you are looking for doesn’t exist or has been moved.
        </p>

        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-secondary text-accent font-medium px-5 py-2 rounded-lg shadow-md hover:bg-tertiary transition duration-300"
          >
            Go to Home
          </motion.button>
        </Link>

        <p className="text-sm text-tertiary mt-4">
          *Redirecting to Home in{" "}
          <span className="font-semibold">{countdown}</span> second
          {countdown !== 1 && "s"}...
        </p>
      </motion.div>
    </div>
  );
};

export default NotFound;
