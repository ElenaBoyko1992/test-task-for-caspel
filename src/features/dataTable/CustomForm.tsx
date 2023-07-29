import React, {forwardRef} from 'react';
import {Button, DatePicker, Form, Input, InputNumber} from "antd";

export const CustomForm = forwardRef((props: CustomFormPropsType, ref: any) => {
    return (
        <Form
            form={props.form ? props.form : null}
            name={props.name}
            ref={ref}
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
            style={{maxWidth: 600}}
            onFinish={props.onFinishHandler}
            autoComplete="off"
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[{required: props.nameRequired, message: 'Please input your name!'}]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                label="Date"
                name="date"
                rules={[{required: props.dateRequired, message: 'Please input date!'}]}
            >
                <DatePicker/>
            </Form.Item>

            <Form.Item
                label="Numerical value"
                name="numericalValue"
                rules={[{required: props.numericalValueRequired, message: 'Please input numerical value!'}]}
            >
                <InputNumber/>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
})

//types
type CustomFormPropsType = {
    form?: any
    name: string;
    onFinishHandler: (values: any) => void;
    nameRequired: boolean;
    dateRequired: boolean;
    numericalValueRequired: boolean;
}
