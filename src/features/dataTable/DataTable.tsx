import React, {useState} from 'react';
import {Button, DatePicker, Form, FormInstance, Input, InputNumber, Modal, Space, Table} from 'antd';
import type {ColumnsType, TableProps} from 'antd/es/table';
import {useAppDispatch, useAppSelector} from "app/hooks";
import {DataTableStringType, deleteTableRow, editTableRow, setDataToTable} from "features/dataTable/dataTable.slice";
import {v1} from "uuid";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

// interface DataType {
//     key: React.Key;
//     name: string;
//     date: string;
//     numericalValue: number;
// }


const DataTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const formRef = React.useRef<FormInstance>(null);

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
                    <EditOutlined onClick={() => showEditTableRowModal(record.key)} style={{fontSize: '18px'}}/>
                    <DeleteOutlined onClick={() => deleteTableRowHandler(record.key)} style={{fontSize: '18px'}}/>
                </Space>
            ),
        },
    ];
    const data = useAppSelector(state => state.table.dataTable);

    const [isAddRowModalOpen, setIsAddRowModalOpen] = useState(false);
    const [isEditRowModalOpen, setIsEditRowModalOpen] = useState(false);
    const [idToChangeTheRow, setIdToChangeTheRow] = useState('')

    const showAddModal = () => {
        setIsAddRowModalOpen(true);
    };
    const showEditTableRowModal = (key: string) => {
        setIsEditRowModalOpen(true)
        setIdToChangeTheRow(key)
    };
    const handleCloseAddRowModal = () => {
        setIsAddRowModalOpen(false);
        formRef.current?.resetFields();
    };
    const handleCloseEditRowModal = () => {
        setIsEditRowModalOpen(false);
    };
    const onFinishAddRowForm = (values: AddFormValuesType) => {
        const fieldsValues = {
            ...values,
            'date': values['date'].format('YYYY-MM-DD'),
            key: v1()
        }
        dispatch(setDataToTable({data: fieldsValues}))
        setIsAddRowModalOpen(false);
        formRef.current?.resetFields();
    };
    const onFinishEditRowForm = (values: AddFormValuesType) => {
        const fieldsValues = {
            ...values,
            'date': values['date'].format('YYYY-MM-DD'),
            // key: v1()
        }
        dispatch(editTableRow({key: idToChangeTheRow, data: fieldsValues}))
        setIsEditRowModalOpen(false);
        setIdToChangeTheRow('')
    };
    const deleteTableRowHandler = (key: string) => {
        dispatch(deleteTableRow({key}))
    }

    //???
    const onTableChange: TableProps<DataTableStringType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <div>
            <Button type="primary" onClick={showAddModal}>Add</Button>
            <Modal title="Add row" open={isAddRowModalOpen} onCancel={handleCloseAddRowModal} footer={null}>
                <Form
                    name="Add table row"
                    ref={formRef}
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    style={{maxWidth: 600}}
                    onFinish={onFinishAddRowForm}
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
            <Modal title="Basic Modal" open={isEditRowModalOpen} onCancel={handleCloseEditRowModal} footer={null}>
                <Form
                    name="Edit table row"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    style={{maxWidth: 600}}
                    onFinish={onFinishEditRowForm}
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