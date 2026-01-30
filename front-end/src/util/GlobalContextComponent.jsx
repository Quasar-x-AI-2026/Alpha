import { useState, createContext } from "react";

const GlobalContext = createContext();

function GlobalContextComponent({ children }) {
  const [manageSpace, setManageSpace] = useState({});
  const [manageSpacePending, setManageSpacePending] = useState([]);
  const [rentSpace, setRentSpace] = useState({});

  return (
    <GlobalContext.Provider
      value={{
        manageSpace,
        setManageSpace,

        manageSpacePending,
        setManageSpacePending,

        rentSpace,
        setRentSpace,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalContextComponent };
