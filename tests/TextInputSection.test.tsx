import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInputSection } from '../src/components/TextInputSection/TextInputSection';

const MAX_LENGTH = 2048;

describe('TextInputSection', () => {
  it('renders a textarea with the provided value', () => {
    render(
      <TextInputSection
        value="hello"
        onChange={() => {}}
        onSubmit={() => {}}
        maxLength={MAX_LENGTH}
      />
    );
    expect(screen.getByRole('textbox', { name: /texto para análise/i })).toHaveValue('hello');
  });

  it('calls onChange with the new value when typing', async () => {
    const handleChange = vi.fn();
    render(
      <TextInputSection
        value=""
        onChange={handleChange}
        onSubmit={() => {}}
        maxLength={MAX_LENGTH}
      />
    );
    await userEvent.type(screen.getByRole('textbox'), 'abc');
    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(handleChange).toHaveBeenLastCalledWith('c');
  });

  it('reflects value.length in the CharCounter', () => {
    render(
      <TextInputSection
        value="hello"
        onChange={() => {}}
        onSubmit={() => {}}
        maxLength={MAX_LENGTH}
      />
    );
    expect(screen.getByText('5 / 2048')).toBeInTheDocument();
  });

  it('renders CharCounter showing 0 when value is empty', () => {
    render(
      <TextInputSection
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        maxLength={MAX_LENGTH}
      />
    );
    expect(screen.getByText('0 / 2048')).toBeInTheDocument();
  });

  it('calls onSubmit when the Translate button is clicked', async () => {
    const handleSubmit = vi.fn();
    render(
      <TextInputSection
        value="some text"
        onChange={() => {}}
        onSubmit={handleSubmit}
        maxLength={MAX_LENGTH}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /analisar frequência de palavras/i }));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('textarea has the correct maxLength attribute', () => {
    render(
      <TextInputSection
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        maxLength={MAX_LENGTH}
      />
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', String(MAX_LENGTH));
  });
});
