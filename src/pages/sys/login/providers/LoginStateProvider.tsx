import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
  useMemo,
} from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export enum LoginStateEnum {
  LOGIN = 0,
  REGISTER = 1,
  RESET_PASSWORD = 2,
  MOBILE = 3,
  QR_CODE = 4,
}

interface LoginStateContextType {
  loginState: LoginStateEnum;
  setLoginState: (loginState: LoginStateEnum) => void;
  backToLogin: () => void;
}

const LoginStateContext = createContext<LoginStateContextType>({
  loginState: LoginStateEnum.LOGIN,
  setLoginState: () => {},
  backToLogin: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export function useLoginStateContext() {
  const context = useContext(LoginStateContext);
  if (!context) {
    throw new Error('useLoginState must be used within a LoginStateProvider');
  }
  return context;
}

export function LoginStateProvider({children}: PropsWithChildren) {
  const [loginState, setLoginState] = useState(LoginStateEnum.LOGIN);
  const value = useMemo(
    () => ({loginState, setLoginState, backToLogin: () => setLoginState(LoginStateEnum.LOGIN)}),
    [loginState, setLoginState]
  );
  return (
    <LoginStateContext.Provider value={value}>
      {children}
    </LoginStateContext.Provider>
  );
}