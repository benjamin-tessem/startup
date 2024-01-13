import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

/**
 * @type {React.Context<{
 *  userName: string;
 * setUserName: (userName: string) => void;
 * authStatus: "unauthenticated" | "authenticated";
 * setAuthStatus: (authStatus: "unauthenticated" | "authenticated") => void;
 * login: (userName: string) => void;
 * logout: () => void;
 * refreshAuthStatus: () => void;
 * }>}
 */
export const AuthContext = createContext(null);





/**
 * AuthProvider is a component that provides the auth context to its children.
 * This is real life would not be really secure, since we just check the local storage,
 * In real life I would A - server side render the page and check the cookie, and B - use a JWT token
 * While I am on the topic, TA's please in the future let people use Typescript
 * @param {props} Children
 * @returns
 */
const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  /**
   * authStatus can be one of:
   * - unauthenticated
   * - authenticated
   */
  const [authStatus, setAuthStatus] = useState(
    userName ? "authenticated" : "unauthenticated"
  );

  const refreshAuthStatus = useCallback(() => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      setAuthStatus("authenticated");
      setUserName(userName);
    } else {
      setAuthStatus("unauthenticated");
      setUserName(null);
    }
  }, []);

  const login = useCallback(
    (userName) => {
      localStorage.setItem("userName", userName);
      refreshAuthStatus();
    },
    [refreshAuthStatus]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("userName");
    refreshAuthStatus();
    navigate("/");
  }, [navigate, refreshAuthStatus]);

  const authContextValue = useMemo(
    () => ({
      userName,
      setUserName,
      authStatus,
      setAuthStatus,
      login,
      logout,
      refreshAuthStatus,
    }),
    [
      userName,
      setUserName,
      authStatus,
      setAuthStatus,
      login,
      logout,
      refreshAuthStatus,
    ]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
