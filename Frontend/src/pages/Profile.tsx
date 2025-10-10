import React, { useEffect, useState } from 'react';
import { UsersService } from '../api/users';
import type { UserDto, UserUpdateDto } from '../types/api';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, LoadingSpinner } from '../components/ui';

interface FormErrors {
  name?: string;
  email?: string;
  sedeId?: string;
}

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [user, setUser] = useState<UserDto | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [sedeId, setSedeId] = useState<string>('');
  const [schedule, setSchedule] = useState<string>('');

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};

    // Validar nombre
    if (!name || name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    if (!email || email.trim().length === 0) {
      errors.email = 'El email es obligatorio';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = 'Por favor ingresa un email válido';
      }
    }

    // Validar sede
    if (!sedeId || sedeId === '') {
      errors.sedeId = 'La sede es obligatoria';
    }

    return errors;
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errors = validateForm();
    setFormErrors(errors);
  };

  useEffect(() => {
    setLoading(true);
    UsersService.getCurrentUser()
      .then((u) => {
        setUser(u);
        setName(u.name ?? '');
        setEmail(u.email ?? '');
        setSedeId(u.sedeId ?? '');
      })
      .catch((e) => {
        console.error('Error loading user:', e);
        showMessage('error', 'Error al cargar el perfil');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como "touched"
    setTouched({
      name: true,
      email: true,
      sedeId: true,
    });

    // Validar formulario
    const errors = validateForm();
    setFormErrors(errors);

    // Si hay errores, no enviar
    if (Object.keys(errors).length > 0) {
      showMessage('error', 'Por favor corrige los errores en el formulario');
      return;
    }

    try {
      setSaving(true);
      const payload: UserUpdateDto = { name, email, sedeId };
      const updated = await UsersService.updateCurrentUser(payload);
      setUser(updated);
      showMessage('success', '¡Perfil actualizado exitosamente!');
    } catch (e: any) {
      console.error('[Profile] Error updating user:', e);
      const errorMsg = e?.response?.data?.message || e?.message || 'Error al actualizar el perfil';
      showMessage('error', errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Actualizar el valor
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'sedeId':
        setSedeId(value);
        break;
      case 'schedule':
        setSchedule(value);
        break;
    }
    
    // Si el campo ya fue tocado, revalidar inmediatamente
    if (touched[field]) {
      setTimeout(() => {
        const errors = validateForm();
        setFormErrors(errors);
      }, 0);
    }
  };

  const sedeOptions = [
    { value: '', label: 'Selecciona tu sede' },
    { value: 'SEDE-1', label: 'Sede Madrid Centro' },
    { value: 'SEDE-2', label: 'Sede Madrid Norte' },
    { value: 'SEDE-3', label: 'Sede Barcelona' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">No se pudo cargar el perfil</p>
      </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nota de campos obligatorios */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="text-red-600 font-bold">*</span> Indica un campo obligatorio
              </p>
            </div>

            <Input
              label={
                <span>
                  Nombre <span className="text-red-600">*</span>
                </span>
              }
              type="text"
              value={name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={() => handleFieldBlur('name')}
              error={touched.name ? formErrors.name : undefined}
              placeholder="Juan Pérez"
              required
            />

            <Input
              label={
                <span>
                  Email <span className="text-red-600">*</span>
                </span>
              }
              type="email"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
              error={touched.email ? formErrors.email : undefined}
              placeholder="juan.perez@empresa.com"
              helperText="Usamos tu email corporativo para las notificaciones"
              required
            />

            <Select
              label={
                <span>
                  Sede <span className="text-red-600">*</span>
                </span>
              }
              value={sedeId}
              onChange={(e) => handleInputChange('sedeId', e.target.value)}
              onBlur={() => handleFieldBlur('sedeId')}
              options={sedeOptions}
              error={touched.sedeId ? formErrors.sedeId : undefined}
              required
            />

            <Input
              label="Horario Preferido"
              type="text"
              value={schedule}
              onChange={(e) => handleInputChange('schedule', e.target.value)}
              placeholder="08:00 - 17:00"
              helperText="Opcional: Tu horario habitual de trabajo"
            />

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                loading={saving}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardContent>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Información de la Cuenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">ID de Usuario</p>
                <p className="font-mono text-gray-900">{user.id}</p>
              </div>
              {user.role && (
                <div>
                  <p className="text-gray-500">Rol</p>
                  <p className="font-medium text-gray-900">{user.role}</p>
                </div>
              )}
            </div>
      </div>
        </CardContent>
      </Card>
    </div>
  );
}

