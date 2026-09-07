import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "../features/auth/hooks/useAuth";

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Only connect if the user is logged in
    if (user && user.id) {
      const newSocket = io("http://localhost:5000");

      newSocket.on("connect", () => {
        // Register the user's ID with their socket connection
        newSocket.emit("register", user.id);
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};