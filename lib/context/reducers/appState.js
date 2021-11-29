export function appState(state, action) {
  
  switch (action.type) {
    case "SHOW_CONTACT":
      return { ...state, showContact: true };
    case "HIDE_CONTACT":
      return { ...state, showContact: false};
    default:
      return state;
  }
}