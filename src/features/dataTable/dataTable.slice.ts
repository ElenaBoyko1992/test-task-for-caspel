import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const slice = createSlice({
    name: "dataTable",
    initialState: {
        dataTable: [] as DataTableStringType[],
    },
    reducers: {
        setDataToTable(state, action: PayloadAction<{ data: DataTableStringType }>) {
            state.dataTable.unshift(action.payload.data)
        },
        deleteTableRow(state, action: PayloadAction<{ key: string }>) {
            const index = state.dataTable.findIndex(row => row.key === action.payload.key)
            if (index > -1) {
                state.dataTable.splice(index, 1)
            }
        },
        editTableRow(state, action: PayloadAction<{ key: string, data: editTableRowArgType }>) {
            const index = state.dataTable.findIndex(row => row.key === action.payload.key)
            console.log('editTableRow', state.dataTable[index])
            state.dataTable[index] = {...state.dataTable[index], ...action.payload.data}
        },

    },
    extraReducers: (builder) => {

    },
});

export const dataTableReducer = slice.reducer;
export const dataTableReducerThunks = {};
export const {setDataToTable, deleteTableRow, editTableRow} = slice.actions;


//types
export type DataTableStringType = {
    key: string;
    name: string;
    date: string;
    numericalValue: number;
}

type editTableRowArgType = Omit<DataTableStringType, "key">;