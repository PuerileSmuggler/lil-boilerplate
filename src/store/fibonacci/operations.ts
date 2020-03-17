import { store } from '..';
import * as actions from './actions';
import {
  ActionFibonacciIncrement,
  ActionFibonacciDecrement,
  ActionFibonacciChangeValue,
} from './types';

export class FibonacciOperations {
  async increment(): Promise<ActionFibonacciIncrement> {
    return store.dispatch(actions.increment());
  }

  async decrement(): Promise<ActionFibonacciDecrement> {
    return store.dispatch(actions.decrement());
  }
  async changeValue(index: number): Promise<ActionFibonacciChangeValue> {
    return store.dispatch(actions.changeValue(index));
  }
}
