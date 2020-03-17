import { combineReducers, createStore } from 'redux';
import { fibonacciReducer } from './fibonacci/reducers';

const rootReducer = combineReducers({
    fibonacci: fibonacciReducer 
});

export const store = createStore(rootReducer);