import { motion, useAnimation } from "framer-motion"
import { PropsWithChildren, useRef } from "react"
import { FocusRing, mergeProps, useButton } from "react-aria"
import useSafeMotion from "../hooks/useSafeMotion"

type ButtonProps = PropsWithChildren<{ onClick: () => void }>

export default function Button({ onClick, children }: ButtonProps) {
	const controls = useAnimation()
	const safeMotion = useSafeMotion({animate: controls})
	const ref = useRef<HTMLButtonElement>(null)
	const { buttonProps } = useButton(
		{
			onPressStart: () => {
				controls.stop()
				controls.set({ background: "#757376" })
			},
			onPressEnd: () => {
				controls.start({
					background: "#353336",
					transition: { duration: 0.4 },
				})
			},
			onPress: onClick,
		},
		ref,
	)

	return (
		<FocusRing focusRingClass="ring ring-offset-2 ring-offset-black">
			<motion.button
				{...mergeProps(buttonProps, safeMotion)}
				style={{
					WebkitTapHighlightColor: "transparent",
				}}
				className="h-20 w-20 touch-none select-none rounded-full bg-[#353336] text-[40px] text-white focus:outline-none"
			>
				{children}
			</motion.button>
		</FocusRing>
	)
}
