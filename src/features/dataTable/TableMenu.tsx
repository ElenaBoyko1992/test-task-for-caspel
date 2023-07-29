import React, {ChangeEvent} from 'react';
import s from "features/dataTable/DataTable.module.css";
import {Button, Input, Select, Space} from "antd";

export const TableMenu = (props: TableMenuPropsType) => {

    const optionsForSearchSelect = [
        {
            value: 'name',
            label: 'Search by name'
        },
        {
            value: 'date',
            label: 'Search by date'
        },
        {
            value: 'numericalValue',
            label: 'Search by numericalValue'
        },
    ]
    const searchSelectHandler = (value: string) => {
        props.setSearchSelectValue(value)
    }
    const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
        props.setSearchValue(event.target.value)
    }
    const showAddModal = () => {
        props.setIsAddRowModalOpen(true);
    };

    return (
        <div className={s.tableMenu}>
            <Space.Compact>
                <Select className={s.selectSearch} defaultValue="name" options={optionsForSearchSelect}
                        onSelect={searchSelectHandler}/>
                <Input onChange={searchHandler} placeholder="input search text"/>
            </Space.Compact>
            <Button className={s.addButton} type="primary" onClick={showAddModal}>Add</Button>
        </div>
    )
}

//types
type TableMenuPropsType = {
    setSearchSelectValue: (value: string) => void
    setSearchValue: (value: string) => void
    setIsAddRowModalOpen: (value: boolean) => void
}
