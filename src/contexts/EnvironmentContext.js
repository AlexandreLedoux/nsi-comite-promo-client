import React, { createContext } from 'react';

export const EnvironmentContext = createContext();

export const EnvironmentProvider = ({ children }) => {
  const ApiUrl = process.env.NODE_ENV === 'production' ? 'https://api.skate.aledoux.eu' : 'http://localhost:8000';

  return (
    <EnvironmentContext.Provider value={{ ApiUrl }}>
      {children}
    </EnvironmentContext.Provider>
  );
};
