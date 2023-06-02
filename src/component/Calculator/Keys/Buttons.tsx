/* eslint-disable no-mixed-spaces-and-tabs */
import { useAnimationControls, Variants } from 'framer-motion'
import { memo, ReactNode } from 'react'
import colors from 'tailwindcss/colors'
import { keyType, OperatorType } from '.'
import { useAppState } from '../../../hooks/useAppState'
import cn from '../../../utils/cn'
import Button from '../../Button'
import {
	clearAll,
	clearDisplay,
	handleDecimal,
	handleEqual,
	handleNumber,
	handleOperator,
	handlePercentage,
	togglePositiveNegative,
} from '../reducer/action'

interface TopOperatorButtonProps {
	children: ReactNode
	label: string
	func:
		| OperatorType.allClear
		| OperatorType.clear
		| OperatorType.togglePlusMinus
		| OperatorType.percentage
}

export const TopOperatorButton = memo(function TopOperatorButton({
	children,
	label,
	func,
}: TopOperatorButtonProps) {
	const controls = useAnimationControls()
	const { dispatch } = useAppState()
	const onPress = () => {
		if (func === OperatorType.allClear) {
			return dispatch(clearAll())
		}
		if (func === OperatorType.clear) {
			return dispatch(clearDisplay())
		}
		if (func === OperatorType.togglePlusMinus) {
			// 3 -> -3 -> 3
			return dispatch(togglePositiveNegative())
		}
		if (func === OperatorType.percentage) {
			// 3 -> 0.03 -> 0.0003
			return dispatch(handlePercentage())
		}
	}

	return (
		<Button
			animate={controls}
			className={cn(
				'relative aspect-square w-full rounded-full bg-gray-300/80 text-gray-800'
			)}
			onPress={onPress}
			onPressEnd={() => {
				controls.start({
					background: '#d1d5dbcc',
					transition: { duration: 0.2 },
				})
			}}
			onPressStart={() => {
				controls.stop()
				controls.set({ background: colors.gray[300] })
			}}
			aria-label={label}>
			{children}
		</Button>
	)
})

interface SideOperatorButtonProps {
	children: ReactNode
	label: string
	func:
		| OperatorType.divide
		| OperatorType.multiply
		| OperatorType.subtract
		| OperatorType.addition
		| OperatorType.equal
	variants?: Variants
	animate?: string
}

export const SideOperatorButton = memo(function SideOperatorButton({
	children,
	label,
	variants,
	animate,
	func,
}: SideOperatorButtonProps) {
	const controls = useAnimationControls()
	const { dispatch } = useAppState()
	const isEqualKey = func === OperatorType.equal

	const onPressEnd = isEqualKey
		? () => {
				controls.start({
					background: colors.orange[500],
					transition: { duration: 0.2 },
				})
		  }
		: undefined
	const onPressStart = isEqualKey
		? () => {
				controls.stop()
				controls.set({ background: colors.orange[300] })
		  }
		: undefined
	const onPress = () => {
		if (func === OperatorType.equal) {
			dispatch(handleEqual())
		} else {
			dispatch(handleOperator(func))
		}
	}
	return (
		<Button
			animate={isEqualKey ? controls : animate}
			className={cn(
				'relative aspect-square w-full rounded-full bg-orange-500 text-5xl text-white'
			)}
			onPress={onPress}
			onPressEnd={onPressEnd}
			onPressStart={onPressStart}
			aria-label={label}
			variants={variants}>
			{children}
		</Button>
	)
})

interface NumberButtonProps {
	children: ReactNode
	label: string
	value: string
	type: keyType.number | keyType.decimal | keyType.zero
}

export const NumberButton = memo(function NumberButton({
	children,
	label,
	type,
	value,
}: NumberButtonProps) {
	const controls = useAnimationControls()
	const { dispatch } = useAppState()

	const onPress = () => {
		if (type === keyType.decimal) {
			dispatch(handleDecimal())
		} else {
			dispatch(handleNumber(value))
		}
	}
	return (
		<Button
			animate={controls}
			className={cn(
				'relative w-full rounded-full bg-neutral-700 text-white',
				type === keyType.zero ? 'col-span-2' : 'aspect-square'
			)}
			onPress={onPress}
			onPressEnd={() => {
				controls.start({
					background: colors.neutral[700],
					transition: { duration: 0.2 },
				})
			}}
			onPressStart={() => {
				controls.stop()
				controls.set({ background: colors.gray[500] })
			}}
			aria-label={label}>
			{children}
		</Button>
	)
})
