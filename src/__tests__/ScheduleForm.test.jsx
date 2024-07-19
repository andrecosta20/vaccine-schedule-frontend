import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ScheduleForm from '../ScheduleForm';
import axios from 'axios';

jest.mock('axios');

describe('ScheduleForm', () => {
  test('renders form fields correctly', () => {
    render(<ScheduleForm openModal={jest.fn()} addSchedule={jest.fn()} />);

    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de Nascimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hora/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Agendar/i })).toBeInTheDocument();
  });

  test('shows error messages for empty fields', async () => {
    render(<ScheduleForm openModal={jest.fn()} addSchedule={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /Agendar/i }));

    expect(await screen.findByText(/Nome é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/Data de nascimento é obrigatória/i)).toBeInTheDocument();
    expect(await screen.findByText(/Data é obrigatória/i)).toBeInTheDocument();
    expect(await screen.findByText(/Hora é obrigatória/i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    axios.post.mockResolvedValue({ status: 201 });

    render(<ScheduleForm openModal={jest.fn()} addSchedule={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Data/i), { target: { value: '2024-07-19' } });
    fireEvent.change(screen.getByLabelText(/Hora/i), { target: { value: '12:00' } });

    fireEvent.click(screen.getByRole('button', { name: /Agendar/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/schedule', {
        name: 'John Doe',
        birthDate: '2000-01-01',
        date: '2024-07-19',
        time: '12:00',
      });
    });
  });

  test('shows error message for invalid date', async () => {
    render(<ScheduleForm openModal={jest.fn()} addSchedule={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento/i), { target: { value: 'invalid-date' } });
    fireEvent.change(screen.getByLabelText(/Data/i), { target: { value: 'invalid-date' } });
    fireEvent.change(screen.getByLabelText(/Hora/i), { target: { value: '12:00' } });

    fireEvent.click(screen.getByRole('button', { name: /Agendar/i }));

    expect(await screen.findByText(/Data de nascimento é obrigatória/i)).toBeInTheDocument();
    expect(await screen.findByText(/Data é obrigatória/i)).toBeInTheDocument();
  });

  test('shows server error message', async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.reject({ response: { data: 'Erro do servidor' } })
    );

    render(<ScheduleForm openModal={jest.fn()} addSchedule={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Data/i), { target: { value: '2024-07-19' } });
    fireEvent.change(screen.getByLabelText(/Hora/i), { target: { value: '12:00' } });

    fireEvent.click(screen.getByRole('button', { name: /Agendar/i }));

    expect(await screen.findByText(/Erro: Erro do servidor/i)).toBeInTheDocument();
  });

  test('submit button is disabled when form is incomplete', () => {
    render(<ScheduleForm openModal={jest.fn()} addSchedule={jest.fn()} />);

    expect(screen.getByRole('button', { name: /Agendar/i })).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento/i), { target: { value: '2000-01-01' } });

    expect(screen.getByRole('button', { name: /Agendar/i })).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Data/i), { target: { value: '2024-07-19' } });
    fireEvent.change(screen.getByLabelText(/Hora/i), { target: { value: '12:00' } });

    expect(screen.getByRole('button', { name: /Agendar/i })).not.toBeDisabled();
  });

  test('resets form after successful submission', async () => {
    axios.post.mockResolvedValue({ status: 201 });

    render(<ScheduleForm openModal={jest.fn()} addSchedule={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Data/i), { target: { value: '2024-07-19' } });
    fireEvent.change(screen.getByLabelText(/Hora/i), { target: { value: '12:00' } });

    fireEvent.click(screen.getByRole('button', { name: /Agendar/i }));

    expect(await screen.findByText(/Agendamento criado com sucesso!/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome/i)).toHaveValue('');
    expect(screen.getByLabelText(/Data de Nascimento/i)).toHaveValue('');
    expect(screen.getByLabelText(/Data/i)).toHaveValue('');
    expect(screen.getByLabelText(/Hora/i)).toHaveValue('');
  });
});
