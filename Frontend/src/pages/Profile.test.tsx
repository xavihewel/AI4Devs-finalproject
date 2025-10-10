import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Profile from './Profile';

jest.mock('../api/users', () => ({
  UsersService: {
    getCurrentUser: jest.fn(),
    updateCurrentUser: jest.fn(),
  },
}));

const { UsersService } = jest.requireMock('../api/users');

describe('Profile page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('loads and displays user profile', async () => {
    const mockUser = {
      id: 'u1',
      name: 'Alice',
      email: 'alice@example.com',
      sedeId: 'SEDE-1',
      role: 'EMPLOYEE',
      createdAt: '',
      updatedAt: '',
    };
    
    UsersService.getCurrentUser.mockResolvedValueOnce(mockUser);
    
    await act(async () => {
      render(<Profile />);
    });
    
    // Wait for the user data to be loaded and displayed
    expect(await screen.findByDisplayValue('Alice')).toBeInTheDocument();
    expect(screen.getByDisplayValue('alice@example.com')).toBeInTheDocument();
    
    // For the select, we need to check the selected option
    const sedeSelect = screen.getByLabelText('Sede *');
    expect(sedeSelect).toHaveValue('SEDE-1');
  });

  it('edits and saves profile', async () => {
    UsersService.getCurrentUser.mockResolvedValueOnce({
      id: 'u1', name: 'Bob', email: 'bob@example.com', sedeId: 'SEDE-2', role: 'EMPLOYEE', createdAt: '', updatedAt: ''
    });
    UsersService.updateCurrentUser.mockImplementation(async (payload: any) => ({
      id: 'u1', name: payload.name, email: payload.email, sedeId: payload.sedeId, role: 'EMPLOYEE', createdAt: '', updatedAt: ''
    }));

    await act(async () => {
      render(<Profile />);
    });

    const nameInput = await screen.findByLabelText('Nombre *');
    const sedeInput = screen.getByLabelText('Sede *');
    const emailInput = screen.getByLabelText('Email *');
    const saveBtn = screen.getByRole('button', { name: /Guardar cambios/i });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Bobby');
    await userEvent.selectOptions(sedeInput, 'SEDE-3');
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'bobby@example.com');
    await userEvent.click(saveBtn);

    expect(UsersService.updateCurrentUser).toHaveBeenCalledWith({ name: 'Bobby', email: 'bobby@example.com', sedeId: 'SEDE-3' });
  });

  it('shows error when API fails', async () => {
    UsersService.getCurrentUser.mockRejectedValueOnce(new Error('fail'));
    await act(async () => {
      render(<Profile />);
    });
    expect(await screen.findByText('No se pudo cargar el perfil')).toBeInTheDocument();
  });
});


