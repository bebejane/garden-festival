import { FESTIVAL_START_DATE, FESTIVAL_END_DATE } from "/lib/utils/constant";
import { useReducer, useContext, createContext } from "react";

const UIContext = createContext({});

// initial state
const initialState = {
  date:FESTIVAL_START_DATE,
  timeZone:'GMT'
}
const UIAction = {
  SET_DATE:'SET_DATE',
  SET_TIMEZONE:'SET_TIMEZONE'
}

const UIReducer = (state, action)=>{  
  switch (action.type) {
    case UIAction.SET_DATE:
      return { ...state, date: action.value };
    case UIAction.SET_TIMEZONE:
      return { ...state, timeZone:action.value};
    default:
      return state;
  }
  
}

// Context provider
const UIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UIReducer, initialState);
  const value = { state, dispatch };
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
// useUI hook
const useUI = () => {
  const context = useContext(UIContext)
  return [context.state, context.dispatch]
}

export { UIContext, UIProvider, useUI , UIAction};