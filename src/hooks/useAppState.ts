import { useContext } from "react"
import { AppStateContext } from "../component/Calculator/context"

export const useAppState = () => {
   return useContext(AppStateContext)
}
