import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [dbUser, setDbUser] = useState();

  return (
    <UserContext.Provider value={{ dbUser, setDbUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = () => useContext(UserContext);