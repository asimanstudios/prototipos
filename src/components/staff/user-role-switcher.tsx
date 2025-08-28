'use client';
import { useUserRole } from '@/context/UserRoleContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { UserRole } from '@/lib/types';
import { ShieldCheck } from 'lucide-react';

export function UserRoleSwitcher() {
  const { role, setRole } = useUserRole();

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
      <ShieldCheck className="w-5 h-5 text-primary"/>
      <Label htmlFor="user-role-select" className="text-sm font-medium whitespace-nowrap">
        Simular Rol:
      </Label>
      <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
        <SelectTrigger id="user-role-select" className="w-[180px] bg-card">
          <SelectValue placeholder="Seleccionar rol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Director">Director</SelectItem>
          <SelectItem value="Ejecutivo">Ejecutivo</SelectItem>
          <SelectItem value="Senior">Senior</SelectItem>
          <SelectItem value="Elite">Elite</SelectItem>
          <SelectItem value="Miembro">Miembro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
