import { useAppState } from '../../hooks/useAppState'
import { operatorVariants } from './constants'
import { keys, keyType, OperatorType } from './Keys'
import {
	NumberButton,
	SideOperatorButton,
	TopOperatorButton,
} from './Keys/Buttons'
import { getDisplayFontSize } from './utils'

export default function CalculatorUI() {
	const { state } = useAppState()
	const { display, currOperator } = state
	const allClear = display === '0'

	return (
		<div className="flex min-h-screen min-w-[330px] max-w-md flex-1 flex-col bg-neutral-900 lg:rounded-lg lg:shadow-2xl ">
			<div
				style={{ fontSize: getDisplayFontSize(display) }}
				className={`flex h-[28vh] items-end justify-end px-5 pb-2`}>
				<input
					type="text"
					aria-label="result"
					value={display}
					disabled
					readOnly
					className="w-full bg-neutral-900 text-right text-white"
				/>
			</div>
			<div className="grid grid-cols-4 gap-4 p-5 text-3xl">
				{keys.map((keyButton, index) => {
					if (
						keyButton.type === keyType.topOperator &&
						keyButton.function !== null
					) {
						if (keyButton.function === OperatorType.allClear) {
							if (allClear) {
								return (
									<TopOperatorButton
										key={index}
										label={keyButton.ariaLabel}
										func={keyButton.function}>
										<span className="absolute left-1/2 top-1/2 inline-block -translate-x-1/2 -translate-y-1/2">
											{keyButton.key}
										</span>
									</TopOperatorButton>
								)
							} else {
								return (
									<TopOperatorButton
										key={index}
										label="clear"
										func={OperatorType.clear}>
										<span className="absolute left-1/2 top-1/2 inline-block -translate-x-1/2 -translate-y-1/2">
											C
										</span>
									</TopOperatorButton>
								)
							}
						} else {
							return (
								<TopOperatorButton
									key={index}
									label={keyButton.ariaLabel}
									func={keyButton.function}>
									<span className="absolute left-2/4 top-2/4 inline-block -translate-x-2/4 -translate-y-[50%]">
										{keyButton.key}
									</span>
								</TopOperatorButton>
							)
						}
					}
					if (keyButton.type === keyType.sideOperator) {
						if (keyButton.function === OperatorType.equal) {
							return (
								<SideOperatorButton
									label={keyButton.ariaLabel}
									key={index}
									func={keyButton.function}>
									<span className="absolute left-2/4 top-2/4 inline-block -translate-x-[49%] -translate-y-[58%]">
										{keyButton.key}
									</span>
								</SideOperatorButton>
							)
						} else {
							return (
								<SideOperatorButton
									label={keyButton.ariaLabel}
									key={index}
									variants={operatorVariants}
									animate={
										currOperator !== OperatorType.equal &&
										keyButton.function === currOperator
											? 'active'
											: undefined
									}
									func={keyButton.function}>
									<span className="absolute left-2/4 top-2/4 inline-block -translate-x-[49%] -translate-y-[58%]">
										{keyButton.key}
									</span>
								</SideOperatorButton>
							)
						}
					}
					if (keyButton.type === keyType.number) {
						return (
							<NumberButton
								label={keyButton.ariaLabel}
								key={index}
								func={keyType.number}
								value={keyButton.key}>
								{keyButton.key}
							</NumberButton>
						)
					}
					if (keyButton.type === keyType.zero) {
						return (
							<NumberButton
								label={keyButton.ariaLabel}
								key={index}
								func={keyType.zero}
								value={keyButton.key}>
								{keyButton.key}
							</NumberButton>
						)
					}
					if (keyButton.type === keyType.decimal) {
						return (
							<NumberButton
								label={keyButton.ariaLabel}
								key={index}
								func={keyType.number}
								value={keyButton.key}>
								{keyButton.key}
							</NumberButton>
						)
					}
				})}
			</div>
		</div>
	)
}
