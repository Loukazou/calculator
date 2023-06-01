import { Variants } from "framer-motion"
import colors from "tailwindcss/colors"
import { AppState } from "./reducer"

const operatorVariants: Variants = {
	active: {
		backgroundColor: colors.white,
		color: colors.orange[400],
		transition: {
			duration: 0.3,
		},
	},
}

const INITIAL_STATE: AppState = {
	modifier: 0,
	display: '0',
	result: null,
	firstValue: 0,
	decimal: false,
	prevOperator: null,
	currOperator: null,
} as const

export {
	operatorVariants,
	INITIAL_STATE
}
