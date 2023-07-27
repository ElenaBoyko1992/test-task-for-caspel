import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import dataTable from "features/dataTable/DataTable";
import {dataTableReducer} from "features/dataTable/dataTable.slice";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        table: dataTableReducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
