import React from 'react';
import {Table} from 'antd';
import type {ColumnsType, TableProps} from 'antd/es/table';

interface DataType {
    key: React.Key;
    name: string;
    date: string;
    numericalValue: number;
}


const DataTable: React.FC = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name < b.name ? -1 : 1,
            defaultSortOrder: 'descend',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            sorter: (a, b) => a.date < b.date ? -1 : 1, //сделать позже подсчет через таймстамп!
            defaultSortOrder: 'descend',
        },
        {
            title: 'Numerical value',
            dataIndex: 'numericalValue',
            sorter: (a, b) => a.numericalValue - b.numericalValue,
            defaultSortOrder: 'descend',
        },
    ];

    const data = [
        {
            key: '1',
            name: 'John Brown',
            date: '26.07.2023',
            numericalValue: 32,
        },
        {
            key: '2',
            name: 'Jim Green',
            date: '20.02.2023',
            numericalValue: 16,
        },
        {
            key: '3',
            name: 'Joe Black',
            date: '15.07.2023',
            numericalValue: 33,
        },
        {
            key: '4',
            name: 'Jim Red',
            date: '02.05.2022',
            numericalValue: 5,
        },
    ];

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <Table columns={columns} dataSource={data} onChange={onChange}/>
    )

};

export default DataTable;