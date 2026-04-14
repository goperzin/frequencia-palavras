import { render, screen } from '@testing-library/react';
import { CharCounter } from '../src/components/CharCounter/CharCounter';

describe('CharCounter', () => {
  it('renders "0 / 2048" when current=0 and max=2048', () => {
    render(<CharCounter current={0} max={2048} />);
    expect(screen.getByText('0 / 2048')).toBeInTheDocument();
  });

  it('renders "1024 / 2048" when current=1024', () => {
    render(<CharCounter current={1024} max={2048} />);
    expect(screen.getByText('1024 / 2048')).toBeInTheDocument();
  });

  it('applies warning class at 80% threshold (current=1639)', () => {
    render(<CharCounter current={1639} max={2048} />);
    const el = screen.getByText('1639 / 2048');
    expect(el.className).toMatch(/warning/);
  });

  it('applies danger class at 95% threshold (current=1946)', () => {
    render(<CharCounter current={1946} max={2048} />);
    const el = screen.getByText('1946 / 2048');
    expect(el.className).toMatch(/danger/);
  });

  it('does not apply warning or danger class below 80% threshold', () => {
    render(<CharCounter current={1000} max={2048} />);
    const el = screen.getByText('1000 / 2048');
    expect(el.className).not.toMatch(/warning/);
    expect(el.className).not.toMatch(/danger/);
  });

  it('has aria-live="polite"', () => {
    render(<CharCounter current={0} max={2048} />);
    expect(screen.getByText('0 / 2048')).toHaveAttribute('aria-live', 'polite');
  });
});
