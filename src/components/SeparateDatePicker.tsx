import * as React from "react";
import { Row, Select } from "antd";
import { FormComponentProps } from "antd/es/form";
import moment from "moment";
import { GetFieldDecoratorOptions } from "antd/es/form/Form";

interface IComponentState {
  year: number | null;
  month: string | null;
  day: number | null;
}

interface IComponentProps {
  getFieldDecorator: <T extends Object = {}>(
    id: keyof T,
    options?: GetFieldDecoratorOptions | undefined
  ) => (node: React.ReactNode) => React.ReactNode;
  onChange?: (value: any) => void;
}

type AllProps = FormComponentProps & IComponentProps;

export class SeparateDatePicker extends React.Component<AllProps> {
  state: IComponentState = {
    year: null,
    month: null,
    day: null
  };

  render() {
    const { year, month } = this.state;
    const years = this.getYears();
    const months = this.getMonths();
    const days = this.getDays();

    const isDayActive = !!year && !!month;

    return (
      <Row type="flex" justify="center" gutter={16}>
        <Select
          style={{ width: "30%" }}
          placeholder="Year"
          onChange={(value: number) => this.changeYear(value)}
        >
          {years}
        </Select>

        <Select
          style={{ width: "40%" }}
          placeholder="Month"
          onChange={(value: string) => this.changeMonth(value)}
        >
          {months.map((item, index) => (
            <Select.Option value={item} key={index}>
              {item}
            </Select.Option>
          ))}
        </Select>

        <Select
          style={{ width: "30%" }}
          disabled={!isDayActive}
          placeholder="Day"
          onChange={(value: number) => this.changeDay(value)}
        >
          {days.length && days}
        </Select>
      </Row>
    );
  }

  changeYear = (value: number) => {
    const { month, day } = this.state;
    this.setState({ year: value });

    const { onChange } = this.props;
    if (onChange && month && day) {
      const months = this.getMonths();
      const indexOfSelectedMonths = months.indexOf(month);
      const date = new Date(value, indexOfSelectedMonths, day);
      onChange(date.toDateString());
    }
  };

  changeMonth = (value: string) => {
    this.setState({ month: value });
    const { day, year } = this.state;

    const { onChange } = this.props;
    if (onChange && day && year) {
      const months = this.getMonths();
      const indexOfSelectedMonths = months.indexOf(value);
      const date = new Date(year, indexOfSelectedMonths, day);
      onChange(date.toDateString());
    }
  };

  changeDay = (value: number) => {
    this.setState({ day: value });
    const { month, year } = this.state;

    const { onChange } = this.props;
    if (onChange && month && year) {
      const months = this.getMonths();
      const indexOfSelectedMonths = months.indexOf(month);
      const date = new Date(year, indexOfSelectedMonths, value);
      onChange(date.toDateString());
    }
  };

  getYears = () => {
    const currentYear = new Date().getFullYear();
    const years: JSX.Element[] = [];

    for (let i = currentYear; i > currentYear - 100; i--) {
      years.push(
        <Select.Option value={i} key={i}>
          {i}
        </Select.Option>
      );
    }
    return years;
  };

  getMonths = () => {
    return moment.months();
  };

  getDays = () => {
    const { year, month } = this.state;
    const months = this.getMonths();
    const indexOfSelectedMonths = month ? months.indexOf(month) + 1 : false;
    const quantityOfDays: JSX.Element[] = [];

    const dayInMonths =
      year && indexOfSelectedMonths
        ? new Date(year, indexOfSelectedMonths, 0).getDate()
        : 0;

    for (let i = 1; i <= dayInMonths; i++) {
      quantityOfDays.push(
        <Select.Option value={i} key={i}>
          {i}
        </Select.Option>
      );
    }
    return quantityOfDays;
  };
}
