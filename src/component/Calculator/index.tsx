import { motion } from "framer-motion"
import { MouseEvent, useEffect, useRef, useState } from "react"
import { animateNumberTap, animateSideOperatorTap, animateTopOperatorTap, operatorVariants } from "./constants"
import keys, { OperatorType, keyType } from "./keys"
import {
   getDisplayFontSize,
} from "./utils"

const initialData = {
	modifier: null,
	firstValue: 0,
	prevOperator: null,
	decimal: false,
	display: "0",
	currOperator: null,
} as const

export function Calculator(): JSX.Element {
	/* get Container element */
	const calculatorRef = useRef<HTMLDivElement | null>(null)

	/* Data store for saving input value before operator */
	const modifier = useRef<number | null>(initialData.modifier)

	/* Data store for saving calculated value */
	const firstValue = useRef(0)

	/* Data store for selected operator after calculation */
	const prevOperator = useRef<OperatorType | null>(
		initialData.prevOperator,
	)

	/* Flag for decimal toggle */
	const decimal = useRef<boolean>(initialData.decimal)

	/* User display of number input and calculated result */
	const [display, setDisplay] = useState<string>(
		initialData.display,
	)

	/* Current selected operator before calculation */
	const [currOperator, setCurrOperator] =
		useState<OperatorType | null>(initialData.currOperator)

	useEffect(() => {
      const calculator = calculatorRef.current
		if (calculator) {
			calculator.addEventListener(
				"keydown",
				handleKeyPress,
			)
		}
		return () => {
			if (calculator) {
				calculator.removeEventListener(
					"keydown",
					handleKeyPress,
				)
			}
		}
	}, [display])

	const handleKeyPress = (e: KeyboardEvent) => {
		let key = e.key
		if (calculatorRef.current) {
			// Operator keys
			if (key === "+") key = "addition"
			if (key === "-") key = "subtraction"
			if (key === "*") key = "multiplication"
			if (key === "/") key = "division"

			// Special keys
			if (key === ".") key = "decimal"
			if (key === "Backspace") key = "all clear"
			if (key === "Escape") key = "all clear"
			if (key === "Enter") key = "equal"
			if (key === "=") key = "equal"
			const button =
				calculatorRef.current.querySelector<HTMLElement>(
					`[aria-label="${key}"]`,
				)
			if (!button) return
			e.preventDefault()
			button.click()
		}
	}

	/**
	 * Handler for Number Key press
	 */
	function numberHandler(e: MouseEvent<HTMLElement>) {
		/* Only supports 11 digit as input number */
		if (11 <= display.length) return
		/* Set the initial number when display is 0 and no selected operator */
		if (display === "0" && currOperator === null) {
			const currDisplayValue = e.currentTarget.innerHTML
			setDisplay(currDisplayValue)
			return
		}
		/* append the current number with the number key if there are currently no selected operator*/
		if (currOperator === null) {
			const currDisplayValue = display + e.currentTarget.innerHTML
			modifier.current = parseFloat(currDisplayValue)
			setDisplay(currDisplayValue)
			return
		}
		/* If there are currently selected operator,
				1.	save the displayed value
				2.	save the current operator
				3. 	set the current operator data as null
				4.	get the number from the key pressed and set as a value for the next append or next calculation
				5.	display the pressed number
		*/
		if (currOperator !== null) {
			firstValue.current = parseFloat(display)
			prevOperator.current = currOperator
			setCurrOperator(null)
			const currDisplayValue = e.currentTarget.innerHTML
			modifier.current = parseFloat(currDisplayValue)
			setDisplay(currDisplayValue)
			return
		}
	}

	/* Reset all data back into initial */
	const clearAll = () => {
		firstValue.current = initialData.firstValue
		decimal.current = initialData.decimal
		prevOperator.current = initialData.prevOperator
		modifier.current = initialData.modifier
		setDisplay(initialData.display)
		setCurrOperator(initialData.currOperator)
	}
	/**
	 *	Take two values and operate based on the operation type
			@returns calculated value
	 */
	const calculate = (
		firstValue: number,
		secondValue: number,
		operation: OperatorType,
	) => {
		if (operation === OperatorType.addition)
			return firstValue + secondValue
		if (operation === OperatorType.multiply)
			return firstValue * secondValue
		if (operation === OperatorType.subtract)
			return firstValue - secondValue
		if (operation === OperatorType.divide)
			return firstValue / secondValue
		return 0
	}

	/* Handler for both top and side operator key presses */
	const operatorHandler = (fn: OperatorType) => {
		/* get the currently displayed value as a number */
		const currentValue = parseFloat(display) * 1
		/* AC operator block case */
		if (fn === OperatorType.allClear) {
			clearAll()
			return
		}

		/*	handles case of cumulative operator calculation,
				if the currently pressed operator is the same as the previous operator AND the current operator is not set to Equal operator.
				else save the displayed value as the result and set the current operator to the invoked operator
		*/
		if (
			fn === prevOperator.current &&
			currOperator !== OperatorType.equal
		) {
			let result: number
			/* if there is a previous operator and a modifier (saved input value) */
			if (prevOperator.current && modifier.current) {
				result = calculate(
					firstValue.current,
					modifier.current,
					prevOperator.current,
				)
			} else {
				/* use the currently displayed value as the second value */
				result = calculate(
					firstValue.current,
					currentValue,
					prevOperator.current,
				)
			}
			/* replace the firsValue data store with the calculated result and set the current operator as the previous operator*/
			firstValue.current = result
			setDisplay(result.toString())
			setCurrOperator(prevOperator.current)
		} else {
			firstValue.current = currentValue
			setCurrOperator(fn)
		}
		decimal.current = false
		return
	}

	const decimalHandler = () => {
		if (currOperator) {
			clearAll()
			decimal.current = true
			setDisplay(0 + ".")
		} else {
			if (!decimal.current) {
				decimal.current = true
				setDisplay(display + ".")
			}
		}
	}

	function handleEqualKey() {
		/* Equal operator block case */
		/* Sets the current operator to the previous operator is the previous operator is null */
		if (prevOperator.current == null)
			prevOperator.current = currOperator
		/* set the stored value as the input value, if the input value is null */
		if (modifier.current == null)
			modifier.current = firstValue.current
		/* if previous operator exists, calculate result from the first value, and the input value, store the result as the first value data */
		if (
			prevOperator.current &&
			prevOperator.current !== OperatorType.equal
		) {
			const result = calculate(
				firstValue.current,
				modifier.current,
				prevOperator.current,
			)
			firstValue.current = result
			setDisplay(result.toString())
		}
		/* edge case if input value contains a decimal but not previous operator, reset the flag */
		decimal.current = false
		/* equal operator is set be the current operator */
		setCurrOperator(OperatorType.equal)
		return
	}
	return (
		<div
			ref={calculatorRef}
			tabIndex={0}
			className="flex min-h-screen min-w-[330px] flex-1 flex-col bg-neutral-900 focus-within:shadow-[0_0_0_0.6rem_#d1d5db] lg:max-w-md lg:rounded-lg lg:shadow-2xl "
		>
			<div
				style={{ fontSize: getDisplayFontSize(display) }}
				className={`flex h-[28vh] items-end justify-end px-5 pb-2`}
			>
				<input
					type="text"
					aria-label="result"
					value={display}
					disabled
					readOnly
					className="w-full bg-neutral-900 text-right text-white"
				/>
			</div>
			<div className="grid grid-cols-4 gap-4 p-5 text-3xl focus-visible:outline-2 focus-visible:outline-orange-300">
				{keys.map((keyButton, index) => {
					if (
						keyButton.type === keyType.topOperator &&
						keyButton.function !== null
					) {
						if (keyButton.function === OperatorType.allClear) {
							return (
								<motion.button
									whileTap={animateTopOperatorTap}
									onClick={() =>
										operatorHandler(keyButton.function)
									}
									key={index}
									tabIndex={-1}
									aria-label={keyButton.ariaLabel}
									className="relative aspect-square w-full select-none rounded-full bg-gray-300/80 text-gray-800 focus-visible:outline-2 focus-visible:outline-orange-300"
								>
									<span className="absolute left-2/4 top-2/4 inline-block -translate-x-2/4 -translate-y-[50%]">
										{display !== "0" ||
										firstValue.current !== 0 ||
										decimal.current !== false ||
										prevOperator.current !== null
											? "C"
											: keyButton.key}
									</span>
								</motion.button>
							)
						} else {
							return (
								<motion.button
									tabIndex={-1}
									whileTap={animateTopOperatorTap}
									onClick={() =>
										operatorHandler(keyButton.function)
									}
									key={index}
									aria-label={keyButton.ariaLabel}
									className="relative aspect-square w-full select-none rounded-full bg-gray-300/80 text-gray-800 focus-visible:outline-2 focus-visible:outline-orange-300"
								>
									<span className="absolute left-2/4 top-2/4 inline-block -translate-x-2/4 -translate-y-[50%]">
										{keyButton.key}
									</span>
								</motion.button>
							)
						}
					}
					if (
						keyButton.type === keyType.sideOperator &&
						keyButton.function !== null
					) {
						if (keyButton.function === OperatorType.equal) {
							return (
								<motion.button
									tabIndex={-1}
									key={index}
									aria-label={keyButton.ariaLabel}
									whileTap={animateSideOperatorTap}
									onClick={() => handleEqualKey()}
									className="relative aspect-square w-full select-none rounded-full bg-orange-400 text-5xl focus-visible:outline-2 focus-visible:outline-orange-200"
								>
									<span className="absolute left-2/4 top-2/4 inline-block -translate-x-[49%] -translate-y-[58%]">
										{keyButton.key}
									</span>
								</motion.button>
							)
						} else {
							return (
								<motion.button
									tabIndex={-1}
									key={index}
									aria-label={keyButton.ariaLabel}
									whileTap={animateSideOperatorTap}
									onClick={() =>
										operatorHandler(keyButton.function)
									}
									variants={operatorVariants}
									animate={
										currOperator !== OperatorType.equal &&
										keyButton.function === currOperator
											? "active"
											: undefined
									}
									className="relative aspect-square w-full select-none rounded-full bg-orange-400 text-5xl focus-visible:outline-2 focus-visible:outline-orange-300"
								>
									<span className="absolute left-2/4 top-2/4 inline-block -translate-x-[49%] -translate-y-[58%]">
										{keyButton.key}
									</span>
								</motion.button>
							)
						}
					}
					if (keyButton.type === keyType.number) {
						return (
							<motion.button
								tabIndex={-1}
								aria-label={keyButton.ariaLabel}
								key={index}
								whileTap={animateNumberTap}
								onClick={numberHandler}
								className="aspect-square w-full select-none rounded-full bg-neutral-700 focus-visible:outline-2 focus-visible:outline-orange-300"
							>
								{keyButton.key}
							</motion.button>
						)
					}
					if (keyButton.type === keyType.zero) {
						return (
							<motion.button
								tabIndex={-1}
								aria-label={keyButton.ariaLabel}
								key={index}
								whileTap={animateNumberTap}
								onClick={numberHandler}
								className="col-span-2 h-full w-full select-none rounded-full bg-neutral-700 focus-visible:outline-2 focus-visible:outline-orange-300"
							>
								{keyButton.key}
							</motion.button>
						)
					}
					if (keyButton.type === keyType.decimal) {
						return (
							<motion.button
								tabIndex={-1}
								aria-label={keyButton.ariaLabel}
								key={index}
								whileTap={animateNumberTap}
								onClick={decimalHandler}
								className="aspect-square w-full select-none rounded-full bg-neutral-700 focus-visible:outline-2 focus-visible:outline-orange-300"
							>
								{keyButton.key}
							</motion.button>
						)
					}
				})}
			</div>
		</div>
	)
}
