import { Variants } from "framer-motion"
import colors from "tailwindcss/colors"
import { AppState } from "./reducer"

const animateNumberTap = {
	backgroundColor: colors.gray[500],
	transition: { duration: 0.001 },
}
const animateTopOperatorTap = {
	backgroundColor: colors.gray[300],
	transition: { duration: 0.001 },
}
const animateSideOperatorTap = {
	backgroundColor: colors.orange[200],
	transition: { duration: 0.001 },
}

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
	firstValue: 0,
	decimal: false,
	prevOperator: null,
	currOperator: null,
}

export {
	animateNumberTap,
	animateTopOperatorTap,
	animateSideOperatorTap,
	operatorVariants,
	INITIAL_STATE
}
