import React, {MouseEventHandler, useState} from 'react';
import {Button, Checkbox, DatePicker, DatePickerProps, Form, Input, InputNumber, Modal, Space, Table} from 'antd';
import type {ColumnsType, TableProps} from 'antd/es/table';
import {useAppDispatch, useAppSelector} from "app/hooks";
import {DataTableStringType, deleteTableRow, setDataToTable} from "features/dataTable/dataTable.slice";
import {v1} from "uuid";
import {DatePickerType} from "antd/es/date-picker";

// interface DataType {
//     key: React.Key;
//     name: string;
//     date: string;
//     numericalValue: number;
// }


const DataTable: React.FC = () => {
    const dispatch = useAppDispatch();

    //modal code
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    //
    // const handleOk = () => {
    //     setIsModalOpen(false);
    // };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    //=============***
    //form code

    const onFinish = (values: AddFormValuesType) => {
        const fieldsValues = {
            ...values,
            'date': values['date'].format('YYYY-MM-DD'),
            key: v1()
        }
        setIsModalOpen(false);
        console.log(fieldsValues)

        dispatch(setDataToTable({data: fieldsValues}))
        // return fieldsValues
        // console.log('Success:', values, `${values.date.$d}`);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    //=============***

    const deleteTableRowHandler=(key: string)=>{
        console.log(key)
        dispatch(deleteTableRow({key}))
    }

    const columns: ColumnsType<any> = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name < b.name ? -1 : 1,

        },
        {
            title: 'Date',
            dataIndex: 'date',
            sorter: (a, b) => a.date < b.date ? -1 : 1, //сделать позже подсчет через таймстамп!

        },
        {
            title: 'Numerical value',
            dataIndex: 'numericalValue',
            sorter: (a, b) => a.numericalValue - b.numericalValue,

        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button >Edit</Button>
                    <Button onClick={()=>deleteTableRowHandler(record.key)}>Delete</Button>
                </Space>
            ),
        },
    ];

    const data = useAppSelector(state => state.table.dataTable);
    //   const dataForTable = useAppSelector(state => state.table.dataTable);
    console.log("data", data)
    const onTableChange: TableProps<DataTableStringType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <div>
            <Button type="primary" onClick={showModal}>Add</Button>
            <Modal title="Basic Modal" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Form
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    style={{maxWidth: 600}}
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{required: true, message: 'Please input your name!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[{required: true, message: 'Please input date!'}]}
                    >
                        <DatePicker/>
                    </Form.Item>

                    <Form.Item
                        label="Numerical value"
                        name="numericalValue"
                        rules={[{required: true, message: 'Please input numerical value!'}]}
                    >
                        <InputNumber/>
                    </Form.Item>

                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Table columns={columns} dataSource={data} onChange={onTableChange}/>
        </div>

    )

};

export default DataTable;

//types
type AddFormValuesType = {
    name: string;
    date: any;
    numericalValue: number;
}