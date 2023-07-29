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
        editTableRow(state, action: PayloadAction<{ key: string, data: EditFormValuesType }>) {
            const index = state.dataTable.findIndex(row => row.key === action.payload.key)
            const newNameValue = action.payload.data.name ? action.payload.data.name : state.dataTable[index].name
            const newDateValue = action.payload.data.date ? action.payload.data.date : state.dataTable[index].date
            const newNumericalValue = action.payload.data.numericalValue ? action.payload.data.numericalValue : state.dataTable[index].numericalValue
            state.dataTable[index] = {
                key: state.dataTable[index].key,
                name: newNameValue,
                date: newDateValue,
                numericalValue: newNumericalValue
            }
        },

    },
});

export const dataTableReducer = slice.reducer;
export const {setDataToTable, deleteTableRow, editTableRow} = slice.actions;


//types
export type DataTableStringType = {
    key: string;
    name: string;
    date: string;
    numericalValue: number;
}

export type EditFormValuesType = {
    name: string | undefined;
    date: any | undefined;
    numericalValue: number | undefined;
}