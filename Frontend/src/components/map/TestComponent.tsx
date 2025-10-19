import React from 'react';

interface TestComponentProps {
  message?: string;
}

export const TestComponent: React.FC<TestComponentProps> = ({ message = 'Hello World' }) => {
  return <div data-testid="test-component">{message}</div>;
};

export default TestComponent;
