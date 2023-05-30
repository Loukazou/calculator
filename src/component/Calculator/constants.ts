import { Variants } from "framer-motion"
import colors from "tailwindcss/colors"

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

export {
	animateNumberTap,
	animateTopOperatorTap,
	animateSideOperatorTap,
	operatorVariants,
}
