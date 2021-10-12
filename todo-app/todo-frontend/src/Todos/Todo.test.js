import { render, screen } from '@testing-library/react';
import Todo from './Todo';

test('todo is done', () => {
    const click1 = () => {};
    const click2 = () => {};
    const todo = {
        text: 'My text',
        done: true
    };
    render(<Todo deleteTodo={click1} completeTodo={click2} todo={todo} />);
    const linkElement = screen.getByText("This todo is done");
    expect(linkElement).toBeInTheDocument();
    
    expect(screen.getByText("My text")).toBeInTheDocument();
});

test('todo is not done', () => {
    const click1 = () => {};
    const click2 = () => {};
    const todo = {
        text: 'My text',
        done: false
    };
    render(<Todo deleteTodo={click1} completeTodo={click2} todo={todo} />);
    const linkElement = screen.getByText("This todo is not done");
    expect(linkElement).toBeInTheDocument();
    
    expect(screen.getByText("My text")).toBeInTheDocument();
});

