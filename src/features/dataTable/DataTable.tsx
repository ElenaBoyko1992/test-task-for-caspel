import React, {useState} from 'react';
import {Form, FormInstance, Modal, Space, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {useAppDispatch, useAppSelector} from "app/hooks";
import {
    DataTableStringType,
    deleteTableRow,
    EditFormValuesType,
    editTableRow,
    setDataToTable
} from "features/dataTable/dataTable.slice";
import {v1} from "uuid";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import s from './DataTable.module.css'
import dayjs from "dayjs";
import {TableMenu} from "features/dataTable/TableMenu";
import {CustomForm} from "features/dataTable/CustomForm";

const DataTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const data = useAppSelector(state => state.table.dataTable);

    const [isEditRowModalOpen, setIsEditRowModalOpen] = useState(false);
    const [keyToChangeTheRow, setKeyToChangeTheRow] = useState('');
    const [searchSelectValue, setSearchSelectValue] = useState('name')
    const [searchValue, setSearchValue] = useState('')
    const [isAddRowModalOpen, setIsAddRowModalOpen] = useState(false);

    const formAddRowRef = React.useRef<FormInstance>(null);
    const formEditRowRef = React.useRef<FormInstance>(null);

    const [editForm] = Form.useForm()

    const columns: ColumnsType<any> = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name < b.name ? -1 : 1,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            sorter: (a, b) => new Date(a.date).getTime() < new Date(b.date).getTime() ? -1 : 1,
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
                    <EditOutlined onClick={() => showEditTableRowModal(record)} style={{fontSize: '18px'}}/>
                    <DeleteOutlined onClick={() => deleteTableRowHandler(record.key)} style={{fontSize: '18px'}}/>
                </Space>
            ),
        },
    ];
    const filteredValuesForTable = data.filter(row => {
        return row[searchSelectValue as keyof DataTableStringType].toString().toLowerCase().includes(searchValue.toLowerCase())
    })

    const showEditTableRowModal = (rowData: DataTableStringType) => {
        editForm.setFieldValue('name', rowData.name)
        editForm.setFieldValue('numericalValue', rowData.numericalValue)
        editForm.setFieldValue('date', dayjs(rowData.date, 'YYYY/MM/DD'))
        setKeyToChangeTheRow(rowData.key)
        setIsEditRowModalOpen(true)
    };
    const deleteTableRowHandler = (key: string) => {
        dispatch(deleteTableRow({key}))
    }
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
        dispatch(setDataToTable({data: fieldsValues}))
        setIsAddRowModalOpen(false);
        formAddRowRef.current?.resetFields();
    };
    const onFinishEditRowForm = (values: EditFormValuesType) => {
        const fieldsValues = {
            ...values,
            date: values['date']?.format('YYYY-MM-DD'),
        }
        dispatch(editTableRow({key: keyToChangeTheRow, data: fieldsValues}))
        setIsEditRowModalOpen(false);
        setKeyToChangeTheRow('');
        formEditRowRef.current?.resetFields();
    };

    return (
        <div className={s.tableContainer}>
            <TableMenu setIsAddRowModalOpen={setIsAddRowModalOpen} setSearchSelectValue={setSearchSelectValue}
                       setSearchValue={setSearchValue}/>

            <Modal title="Add row" open={isAddRowModalOpen} onCancel={handleCloseAddRowModal} footer={null}>
                <CustomForm name={"Add table row"} nameRequired={true} dateRequired={true} numericalValueRequired={true}
                            ref={formAddRowRef} onFinishHandler={onFinishAddRowForm}/>
            </Modal>

            <Modal title="Basic Modal" open={isEditRowModalOpen} onCancel={handleCloseEditRowModal} footer={null}>
                <CustomForm form={editForm} name={'Edit table row'} nameRequired={false} dateRequired={false}
                            numericalValueRequired={false} ref={formEditRowRef} onFinishHandler={onFinishEditRowForm}/>
            </Modal>

            <Table className={s.table} columns={columns} dataSource={filteredValuesForTable} pagination={false}/>
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

