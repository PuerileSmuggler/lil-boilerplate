export const constantsFibonacci = {
  INCREMENT: 'FIBONACCI/INCREMENT',
  DECREMENT: 'FIBONACCI/DECREMENT',
  CHANGE_VALUE: 'FIBONACCI/CHANGE_VALUE',
};

export interface FibonacciState {
    currentValue: number;
    previousValue: number;
    index: number;
}

export interface ActionFibonacciIncrement {
  type: typeof constantsFibonacci.INCREMENT;
}

export interface ActionFibonacciDecrement {
  type: typeof constantsFibonacci.DECREMENT;
}

export interface ActionFibonacciChangeValue {
  type: typeof constantsFibonacci.CHANGE_VALUE;
  payload: number;
}

export type FibonacciActionTypes =
  | ActionFibonacciChangeValue
  | ActionFibonacciDecrement
  | ActionFibonacciIncrement;