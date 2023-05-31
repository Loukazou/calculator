import { useImmerReducer } from "use-immer";
import { INITIAL_STATE } from "./Calculator/constants";
import { AppStateContext } from "./Calculator/context";
import { AppState, reducer } from "./Calculator/reducer";
import { Action } from "./Calculator/reducer/action";

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
   const [state, dispatch] = useImmerReducer<AppState, Action>(reducer, INITIAL_STATE)

   return (
      <AppStateContext.Provider value={{ state, dispatch }}>
         {children}
      </AppStateContext.Provider>
   )
}
