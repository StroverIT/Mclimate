import {render, screen} from "@testing-library/react";
import GenericInput from "./GenericInput";
import {InputTypes} from "../InputUtils/InputUtils";
import userEvent from "@testing-library/user-event";

describe('Generic Input Render Test', () => {
  test('Text input renders successfully', () => {
    render(<GenericInput/>);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  })

  test('Input with prop elementType = TEXT_INPUT - renders successfully', () => {
    render(<GenericInput elementType={InputTypes.TEXT_INPUT}/>);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  })

  test('Text input type test', async () => {
    render(<GenericInput/>);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, ' Test 123!');
    expect(input).toHaveValue(' Test 123!')
  })

  test('Input with prop elementType = TEXT_INPUT - type test', async () => {
    render(<GenericInput elementType={InputTypes.TEXT_INPUT}/>);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, ' Test 123 test!');
    expect(input).toHaveValue(' Test 123 test!')
  })

  test('Select renders successfully', () => {
    render(<GenericInput elementType={InputTypes.SELECT} elementConfig={{}}/>);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'react-select-2-input');
  })
})