import React, {createContext, useCallback, useContext, useState} from 'react';

export const AppContext = createContext({
  user_Id: 1,
  handleUserIdChange: () => {},
});

export const AppProvider = ({children}) => {
  const [user_Id, setUserId] = useState(null);
  const handleUserIdChange = useCallback(id => {
    setUserId(id);
  }, []);

  return (
    <AppContext.Provider value={{user_Id, handleUserIdChange}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
