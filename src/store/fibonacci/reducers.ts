import {
  FibonacciActionTypes,
  FibonacciState,
  constantsFibonacci,
  ActionFibonacciChangeValue,
} from './types';
import update from 'immutability-helper';

const initialState: FibonacciState = {
  currentValue: 1,
  previousValue: 1,
  index: 1,
};

const changeIndex = (
  currentValue: number,
  previousValue: number,
  currentIndex: number,
  index: number
): { currentValue: number; previousValue: number } => {
  const indexDiff = currentIndex - index;
  const sign = Math.sign(indexDiff);
  for (let i = 0; sign ? i < indexDiff : i > indexDiff; i = i + sign) {
    const previousValueTemp = previousValue;
    const currentValueTemp = currentValue;
    if (sign === 1) {
      previousValue = currentValue;
      currentValue = currentValue + previousValueTemp;
    } else {
      currentValue = previousValue;
      previousValue = currentValueTemp - previousValue;
    }
  }
  return { currentValue, previousValue };
};

export const fibonacciReducer = (
  state = initialState,
  action: FibonacciActionTypes
): FibonacciState => {
  switch (action.type) {
    case constantsFibonacci.INCREMENT && state.index > 0: {
      const { previousValue, currentValue } = state;
      return update(state, {
        currentValue: { $set: currentValue + previousValue },
        previousValue: { $set: previousValue },
      });
    }
    case constantsFibonacci.DECREMENT && state.index > 1: {
      const { currentValue, previousValue } = state;
      return update(state, {
        currentValue: { $set: previousValue },
        previousValue: { $set: currentValue - previousValue },
      });
    }
    case constantsFibonacci.CHANGE_VALUE &&
      (action as ActionFibonacciChangeValue).payload >= 0: {
      const { currentValue, previousValue } = changeIndex(
        state.currentValue,
        state.previousValue,
        state.index,
        (action as ActionFibonacciChangeValue).payload
      );
      return update(state, {
          currentValue: { $set: currentValue },
          previousValue: { $set: previousValue },
          index: { $set: (action as ActionFibonacciChangeValue).payload }
      });
    }
    default: {
      return state;
    }
  }
};
