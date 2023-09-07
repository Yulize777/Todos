import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

test('renders App component', () => {
  render(<App />);
  const titleElement = screen.getByText('Todos');
  expect(titleElement).toBeInTheDocument();
});

test('adds a task when the button is clicked', () => {
  render(<App />);

  const inputElement = screen.getByPlaceholderText('Enter a task');
  fireEvent.change(inputElement, { target: { value: 'New Task' } });

  const addButton = screen.getByText('Add a task');
  fireEvent.click(addButton);

  const taskElement = screen.getByText('New Task');
  expect(taskElement).toBeInTheDocument();
  expect(inputElement).toHaveValue('');
});

test('clears completed tasks when "Clear completed" button is clicked', () => {
  render(<App />);
  const clearButton = screen.getByText('Clear completed');

  fireEvent.click(clearButton);

  const completedTaskElement = screen.queryByText('Completed Task');
  expect(completedTaskElement).not.toBeInTheDocument();
});



test('changes status when buttons are clicked', () => {
  render(<App />);

  const allButton = screen.getByText('All');
  const completedButton = screen.getByText('Completed');

  expect(allButton).toHaveStyle('background-color: #DCDCDC');
  expect(completedButton).not.toHaveStyle('background-color: #DCDCDC');

  fireEvent.click(completedButton);

  expect(allButton).not.toHaveStyle('background-color: #DCDCDC');
  expect(completedButton).toHaveStyle('background-color: #DCDCDC');
});

