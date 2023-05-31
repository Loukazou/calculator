import { ImmerReducer } from "use-immer"
import { OperatorTypeValues } from "../Keys"
import { INITIAL_STATE } from "../constants"
import { Action } from "./action"

export type AppState = {
   modifier: number
   firstValue: number
   prevOperator: OperatorTypeValues | null
   decimal: boolean
   display: string
   currOperator: OperatorTypeValues | null
}

export const reducer: ImmerReducer<AppState, Action> = (draft , action) => {
   switch (action.type) {
      case 'setModifier':
         draft.modifier = action.payload
         break
      case 'setFirstValue':
         draft.firstValue = action.payload
         break
      case 'setPrevOperator':
         draft.prevOperator = action.payload
         break
      case 'setDecimal':
         draft.decimal = action.payload
         break
      case 'setDisplay':
         draft.display = action.payload
         break
      case 'setCurrOperator':
         draft.currOperator = action.payload
         break
      case 'reset':
         draft = INITIAL_STATE
         break
      default:
         throw new Error('Invalid action type')
   }
}
