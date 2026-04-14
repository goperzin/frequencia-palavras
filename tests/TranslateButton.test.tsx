import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TranslateButton } from '../src/components/TranslateButton/TranslateButton';

describe('TranslateButton', () => {
  it('renders a button with text "Translate"', () => {
    render(<TranslateButton onClick={() => {}} />);
    expect(screen.getByRole('button', { name: /analisar frequência de palavras/i })).toBeInTheDocument();
    expect(screen.getByText('Translate')).toBeInTheDocument();
  });

  it('calls onClick exactly once when clicked', async () => {
    const handleClick = vi.fn();
    render(<TranslateButton onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when not clicked', () => {
    const handleClick = vi.fn();
    render(<TranslateButton onClick={handleClick} />);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
