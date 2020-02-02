import * as React from "react";
import { Col, Form, Row, Button } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { SeparateDatePicker } from "components/SeparateDatePicker";
import moment from "moment";

class FormWrapperComponent extends React.Component<FormComponentProps> {
  public render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row type="flex" justify="center" className="date-picker-layout">
        <Col xs={24} sm={20} md={16} lg={12}>
          <h3>Separate Date Picker</h3>
          <Form onSubmit={this.onSubmit}>
            <Form.Item label="Your birthday">
              {getFieldDecorator("birthday", {
                rules: [
                  { required: true, message: "Fields are required" },
                  {
                    validator: (rule, value, callback) =>
                      this.ageValidate(rule, value, callback, 18)
                  }
                ]
              })(
                <SeparateDatePicker
                  form={form}
                  getFieldDecorator={getFieldDecorator}
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Continue
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    );
  }

  ageValidate = (_rule: any, _value: any, callback: any, minAge: number) => {
    const { form } = this.props;
    const { getFieldValue } = form;
    const date = getFieldValue("birthday");

    const userDate = moment(new Date(date));
    const currentDate = moment(new Date());
    const duration = moment.duration(currentDate.diff(userDate));
    const age = Math.floor(duration.asYears());

    if (age < minAge) {
      callback(`You must be ${minAge} or over`);
    }
    callback();
  };

  onSubmit = (e: any) => {
    const { form } = this.props;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(`Received values of form: ${values}`);
      }
    });
  };
}

export const FormWrapper = Form.create()(FormWrapperComponent);
