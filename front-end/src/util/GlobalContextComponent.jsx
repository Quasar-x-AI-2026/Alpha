import { useState, createContext } from "react";

const GlobalContext = createContext();

function GlobalContextComponent({ children }) {
  const [manageSpace, setManageSpace] = useState({});
  const [manageSpacePending, setManageSpacePending] = useState([]);
  const [rentSpace, setRentSpace] = useState({});
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        manageSpace,
        setManageSpace,

        manageSpacePending,
        setManageSpacePending,

        rentSpace,
        setRentSpace,

        adminLoggedIn,
        setAdminLoggedIn,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalContextComponent };
