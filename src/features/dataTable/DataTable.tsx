import React, {useEffect, useRef, useState} from 'react';
import {Button, DatePicker, Form, FormInstance, Input, InputNumber, InputRef, Modal, Space, Table} from 'antd';
import type {ColumnsType, ColumnType, TableProps} from 'antd/es/table';
import {useAppDispatch, useAppSelector} from "app/hooks";
import {
    DataTableStringType,
    deleteTableRow,
    editTableRow,
    setDataToTable
} from "features/dataTable/dataTable.slice";
import {v1} from "uuid";
import {DeleteOutlined, EditOutlined, SearchOutlined} from "@ant-design/icons";
import {log} from "util";
import {FilterConfirmProps} from "antd/es/table/interface";
import Highlighter from 'react-highlight-words';

// interface DataType {
//     key: React.Key;
//     name: string;
//     date: string;
//     numericalValue: number;
// }


const DataTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const formAddRowRef = React.useRef<FormInstance>(null);
    const formEditRowRef = React.useRef<FormInstance>(null);
    const [isAddRowModalOpen, setIsAddRowModalOpen] = useState(false);
    const [isEditRowModalOpen, setIsEditRowModalOpen] = useState(false);
    const [idToChangeTheRow, setIdToChangeTheRow] = useState('')
    // const [dataForEditRowFormDisplay, setDataForEditRowFormDisplay] = useState<any>({})


    const data = useAppSelector(state => state.table.dataTable);

    //search
    interface DataType {
        key: string;
        name: string;
        date: string;
        numericalValue: number;
    }

    type DataIndex = keyof DataType;
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
         confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div style={{padding: 8,  position: 'fixed', top: '40px', left: 0}} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{width: 90}}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({closeDropdown: false});
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{color: filtered ? '#1677ff' : undefined}}/>
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
               setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns: ColumnsType<any> = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name < b.name ? -1 : 1,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            sorter: (a, b) => new Date(a.date).getTime() < new Date(b.date).getTime() ? -1 : 1,
            ...getColumnSearchProps('date'),
        },
        {
            title: 'Numerical value',
            dataIndex: 'numericalValue',
            sorter: (a, b) => a.numericalValue - b.numericalValue,
            ...getColumnSearchProps('numericalValue'),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined onClick={() => showEditTableRowModal(record)} style={{fontSize: '18px'}}/>
                    <DeleteOutlined onClick={() => deleteTableRowHandler(record.key)} style={{fontSize: '18px'}}/>

                    {/*  <Modal title="Basic Modal" open={isEditRowModalOpen} onCancel={handleCloseEditRowModal} footer={null}>
                        <Form
                            name="Edit table row"
                            ref={formEditRowRef}
                            labelCol={{span: 8}}
                            wrapperCol={{span: 16}}
                            style={{maxWidth: 600}}
                            onFinish={onFinishEditRowForm}
                            autoComplete="off"
                            initialValues={{name: record.name}}
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
                    </Modal>*/}
                </Space>
            ),
        },
    ];
    //********************
    const showAddModal = () => {
        setIsAddRowModalOpen(true);
    };
    const showEditTableRowModal = (rowData: DataTableStringType) => {

        // setDataForEditRowFormDisplay(rowData)
        setIdToChangeTheRow(rowData.key)
        setIsEditRowModalOpen(true)
    };
    const handleCloseAddRowModal = () => {
        setIsAddRowModalOpen(false);
        formAddRowRef.current?.resetFields();
    };
    const handleCloseEditRowModal = () => {
        setIsEditRowModalOpen(false);
        formEditRowRef.current?.resetFields();
    };
    const onFinishAddRowForm = (values: AddFormValuesType) => {
        const fieldsValues = {
            ...values,
            'date': values['date'].format('YYYY-MM-DD'),
            key: v1()
        }
        console.log('time', values.date.$d.getTime())
        dispatch(setDataToTable({data: fieldsValues}))
        setIsAddRowModalOpen(false);
        formAddRowRef.current?.resetFields();
    };
    const onFinishEditRowForm = (values: AddFormValuesType) => {
        const fieldsValues = {
            ...values,
            'date': values['date'].format('YYYY-MM-DD'),
        }
        dispatch(editTableRow({key: idToChangeTheRow, data: fieldsValues}))
        setIsEditRowModalOpen(false);
        setIdToChangeTheRow('');
        formEditRowRef.current?.resetFields();
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
                    ref={formAddRowRef}
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
                    ref={formEditRowRef}
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    style={{maxWidth: 600}}
                    onFinish={onFinishEditRowForm}
                    autoComplete="off"
                    //  initialValues={{name: "name"}}
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
            <Table columns={columns} dataSource={data} onChange={onTableChange} style={{marginTop: '100px'}}/>
        </div>

    );

};

export default DataTable;

//types
type AddFormValuesType = {
    name: string;
    date: any;
    numericalValue: number;
}