import React from 'react';
import { render, screen } from '@testing-library/react';
import TestComponent from './TestComponent';

describe('TestComponent', () => {
  it('should render basic component', () => {
    const { container } = render(<TestComponent />);
    console.log('TestComponent - Container HTML:', container.innerHTML);
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    const { container } = render(<TestComponent message="Custom Message" />);
    console.log('TestComponent custom - Container HTML:', container.innerHTML);
    expect(screen.getByText('Custom Message')).toBeInTheDocument();
  });
});
