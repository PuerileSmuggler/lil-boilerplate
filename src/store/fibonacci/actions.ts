import { ActionFibonacciIncrement, constantsFibonacci, ActionFibonacciDecrement, ActionFibonacciChangeValue } from "./types"

export const increment = (): ActionFibonacciIncrement => {
    return {
        type: constantsFibonacci.INCREMENT
    }
}

export const decrement = (): ActionFibonacciDecrement => {
    return {
        type: constantsFibonacci.DECREMENT
    }
}

export const changeValue = (index: number): ActionFibonacciChangeValue => {
    return {
        type: constantsFibonacci.CHANGE_VALUE,
        payload: index
    }
}