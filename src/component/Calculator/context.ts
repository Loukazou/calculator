import { Dispatch, createContext } from "react";
import { AppState } from "./reducer";
import { Action } from "./reducer/action";

interface AppStateContextProps {
   state: AppState
   dispatch: Dispatch<Action>
}

export const AppStateContext = createContext({} as AppStateContextProps)
