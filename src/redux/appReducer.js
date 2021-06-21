
const initialState = {
 
 enteredChars: 0
}

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INC_ENTERED_CHARS':
      return {...state, enteredChars: state.enteredChars + 1 }
      case 'RES_ENTERED_CHARS':
      return {...state, enteredChars: 0 }
    default: return state
  }
}
