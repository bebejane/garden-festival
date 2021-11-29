import { FESTIVAL_START_DATE, FESTIVAL_END_DATE, timeZones } from "/lib/utils/constant";
import { useReducer, useContext, createContext } from "react";

const AppStateContext = createContext({});

// initial state
const initialState = {
  date:FESTIVAL_START_DATE,
  zone:timeZones[0]
}
const AppAction = {
  SET_DATE:'SET_DATE',
  SET_TIMEZONE:'SET_TIMEZONE'
}

const AppStateReducer = (state, action)=>{  
  switch (action.type) {
    case AppAction.SET_DATE:
      return { ...state, date: action.value };
    case AppAction.SET_TIMEZONE:
      return { ...state, zone:action.value};
    default:
      return state;
  }
  
}

// Context provider
const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppStateReducer, initialState);
  const value = { state, dispatch };
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};
// useUI hook
const useAppState = () => {
  const context = useContext(AppStateContext)
  return [context.state, context.dispatch]
}

export { AppStateContext, AppStateProvider, useAppState , AppAction};