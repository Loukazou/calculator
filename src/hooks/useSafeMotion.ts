import { MotionProps, useReducedMotion } from "framer-motion"

const useSafeMotion = (motion: MotionProps): MotionProps => {
	const reduced = useReducedMotion()

	return reduced ? {} : motion
}

export default useSafeMotion
