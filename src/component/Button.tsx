import type { HTMLMotionProps } from 'framer-motion'
import { motion } from 'framer-motion'
import type { ForwardedRef } from 'react'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { AriaButtonProps, FocusRing, mergeProps, useButton } from 'react-aria'
import cn from '../utils/cn'

const ButtonComponent = (
	props: ButtonProps,
	ref: ForwardedRef<HTMLButtonElement>
) => {
	const { children, className, onPressStart, onPressEnd, onPress, ...rest } =
		props

	const innerRef = useRef<HTMLButtonElement>(null)

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	useImperativeHandle(ref, () => innerRef.current!)

	const { buttonProps } = useButton(
		{ ...rest, children, onPressStart, onPressEnd, onPress },
		innerRef
	)

	return (
		<FocusRing focusRingClass="ring ring-offset-2 ring-offset-black ring-slate-100">
			<motion.button
				ref={innerRef}
				style={{
					WebkitTapHighlightColor: 'transparent',
				}}
				className={cn(
					'touch-none select-none focus:outline-none ',
					className
				)}
				{...mergeProps(rest, buttonProps)}>
				{children}
			</motion.button>
		</FocusRing>
	)
}

export interface ButtonProps
	extends AriaButtonProps,
		Omit<HTMLMotionProps<'button'>, keyof AriaButtonProps> {
	className?: string
}
const Button = forwardRef(ButtonComponent)

export default Button
