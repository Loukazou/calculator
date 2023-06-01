import { AppStateProvider } from '../Provider'
import CalculatorUI from './CalculatorUI'

/* Refactor with use-immer reducer */
export default function Calculator(): JSX.Element {
	return (
		<>
			<AppStateProvider>
				<CalculatorUI />
			</AppStateProvider>
		</>
	)
}
