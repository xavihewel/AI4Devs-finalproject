import React, { useEffect, useMemo, useState } from 'react';
import { UsersService } from '../api/users';
import type { UserDto, UserUpdateDto } from '../types/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<boolean>(false);
  const [user, setUser] = useState<UserDto | null>(null);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [sedeId, setSedeId] = useState<string>('');
  const [schedule, setSchedule] = useState<string>('');

  const canSave = useMemo(() => name.trim().length > 1 && email.includes('@') && sedeId.trim().length > 0, [name, email, sedeId]);

  useEffect(() => {
    setLoading(true);
    UsersService.getCurrentUser()
      .then((u) => {
        setUser(u);
        setName(u.name ?? '');
        setEmail(u.email ?? '');
        setSedeId(u.sedeId ?? '');
      })
      .catch((e) => setError(String(e?.message ?? e)))
      .finally(() => setLoading(false));
  }, []);

  const onSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    const payload: UserUpdateDto = { name, email, sedeId };
    try {
      const updated = await UsersService.updateCurrentUser(payload);
      setUser(updated);
      setSaved(true);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24, color: 'red' }} role="alert">
        {error}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <h2>Mi Perfil</h2>

      <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Sede" value={sedeId} onChange={(e) => setSedeId(e.target.value)} />
        <Input label="Horario (opcional)" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <Button onClick={onSave} disabled={!canSave || saving}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
        {saved && <span style={{ color: 'green', alignSelf: 'center' }}>Cambios guardados</span>}
      </div>
    </div>
  );
}

