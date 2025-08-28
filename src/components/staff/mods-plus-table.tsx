

'use client';
import { useState } from 'react';
import type { ModPlus } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, PlusCircle, Edit, Save, User, Award, Shield, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

type ModsPlusTableProps = {
  mods: ModPlus[];
  onModsChange: (mods: ModPlus[]) => void;
  canEdit: boolean;
  canDelete: boolean;
};

const resumenColors = {
  'Va mal': 'bg-red-500/80 text-white',
  'Va regular': 'bg-orange-400/80 text-white',
  'Nuevo': 'bg-yellow-400/80 text-black',
  'Va bien': 'bg-green-500/80 text-white',
  'Reducción': 'bg-yellow-400/80 text-black',
};

const servidorColors = {
    'ESP': 'bg-red-700 text-white',
    'ARG': 'bg-blue-400 text-white',
};

const rangoPlusColors = {
  'Senior': 'bg-senior text-senior-foreground',
  'Elite': 'bg-elite text-elite-foreground',
};

const rangoPlusBadgeColors: { [key: string]: string } = {
  'Senior': 'bg-green-500 text-white',
  'Elite': 'bg-blue-500 text-white',
}

export function ModsPlusTable({ mods, onModsChange, canEdit, canDelete }: ModsPlusTableProps) {
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [newRowData, setNewRowData] = useState<Partial<ModPlus>>({});
  const [viewingMod, setViewingMod] = useState<ModPlus | null>(null);

  const handleAddNew = () => {
    const newMod: ModPlus = {
      id: `new-${Date.now()}`,
      nombre: 'Nuevo Mod',
      rangoPlus: 'Miembro',
      entrenos: null,
      entrenosPropios: null,
      trys: null,
      rolesPJ: null,
      rolEspontaneo: null,
      misiones: null,
      supervisiones: null,
      inactividad: null,
      resumen: 'Nuevo',
      servidor: 'ARG',
      esSgtPlus: false,
      abandona: false,
      ...newRowData
    };
    onModsChange([...mods, newMod]);
    setNewRowData({});
  };

  const handleUpdate = (id: string, field: keyof ModPlus, value: any) => {
    onModsChange(mods.map(mod => mod.id === id ? { ...mod, [field]: value } : mod));
  };
  
  const handleNumericUpdate = (id: string, field: keyof ModPlus, value: string) => {
    const numericValue = value === '' ? null : parseInt(value, 10);
    if (value === '' || (!isNaN(numericValue) && numericValue >= 0)) {
      handleUpdate(id, field, numericValue);
    }
  };

  const handleDelete = (id: string) => {
    onModsChange(mods.filter(mod => mod.id !== id));
  };

  const startEditing = (id: string) => {
    if (canEdit) {
      setEditingRow(id);
    }
  };

  const cancelEditing = () => {
    setEditingRow(null);
  };
  
  const handleViewMod = (mod: ModPlus) => {
    if (editingRow !== mod.id) {
        setViewingMod(mod);
    }
  };

  const moveRow = (index: number, direction: 'up' | 'down') => {
    const newMods = [...mods];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newMods.length) return;

    [newMods[index], newMods[targetIndex]] = [newMods[targetIndex], newMods[index]];
    onModsChange(newMods);
  };


  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-border bg-card/80 text-xs">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {['Nombre', 'Rango', 'SGT+', 'Entrenos', 'Entrenos Propios', 'Trys', 'Roles de PJ', 'Rol Espontaneo', 'Misiones', 'Supervisiones', 'Inactividad', 'Resumen', 'Servidor', 'Acciones'].map(header => (
              <TableHead key={header} className="px-2 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-foreground/80 whitespace-nowrap" style={{ backgroundColor: '#172e63' }}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border">
          {mods.map((mod, index) => {
            const isEditing = editingRow === mod.id;
            const isSeniorOrElite = mod.rangoPlus === 'Senior' || mod.rangoPlus === 'Elite';
            const rowClass = mod.rangoPlus && rangoPlusColors[mod.rangoPlus] ? rangoPlusColors[mod.rangoPlus] : '';

            return (
              <TableRow key={mod.id} className={cn("hover:bg-primary/10", mod.abandona && "bg-destructive/20 opacity-70", rowClass)}>
                <TableCell 
                    className={cn("p-1 align-middle min-w-[200px]", { 'cursor-pointer hover:underline': !isEditing })}
                    onClick={() => !isEditing && handleViewMod(mod)}
                >
                    <div className="flex items-center gap-1">
                        <Input type="text" value={mod.nombre} onChange={e => handleUpdate(mod.id, 'nombre', e.target.value)} disabled={!isEditing} className={cn("bg-transparent border-0 text-left text-xs h-7 w-full", mod.abandona && "line-through text-muted-foreground")} />
                        {mod.esSgtPlus && <Badge style={{backgroundColor: '#fbbf24', color: '#172e63'}}>SGT+</Badge>}
                        {mod.rangoPlus && mod.rangoPlus !== 'Miembro' && <Badge className={cn("whitespace-nowrap", rangoPlusBadgeColors[mod.rangoPlus])}>{mod.rangoPlus}</Badge>}
                    </div>
                </TableCell>
                 <TableCell className="p-1 align-middle min-w-[120px]">
                   <Select value={mod.rangoPlus || 'Miembro'} onValueChange={(value) => handleUpdate(mod.id, 'rangoPlus', value)} disabled={!isEditing}>
                    <SelectTrigger className="border-0 font-bold bg-transparent text-xs h-7"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Miembro">Miembro</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Elite">Elite</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                 <TableCell className="p-1 align-middle">
                    <Checkbox checked={mod.esSgtPlus} onCheckedChange={(checked) => handleUpdate(mod.id, 'esSgtPlus', checked)} disabled={!isEditing} />
                 </TableCell>
                <TableCell className="p-1 align-middle"><Input type="number" value={mod.entrenos ?? ''} onChange={e => handleNumericUpdate(mod.id, 'entrenos', e.target.value)} disabled={!isEditing} className="bg-transparent border-0 text-left text-xs h-7 w-20" /></TableCell>
                <TableCell className="p-1 align-middle"><Input type="number" value={mod.entrenosPropios ?? ''} onChange={e => handleNumericUpdate(mod.id, 'entrenosPropios', e.target.value)} disabled={!isEditing} className="bg-transparent border-0 text-left text-xs h-7 w-20" /></TableCell>
                <TableCell className="p-1 align-middle"><Input type="number" value={mod.trys ?? ''} onChange={e => handleNumericUpdate(mod.id, 'trys', e.target.value)} disabled={!isEditing} className="bg-transparent border-0 text-left text-xs h-7 w-20" /></TableCell>
                <TableCell className="p-1 align-middle"><Input type="number" value={mod.rolesPJ ?? ''} onChange={e => handleNumericUpdate(mod.id, 'rolesPJ', e.target.value)} disabled={!isEditing} className="bg-transparent border-0 text-left text-xs h-7 w-20" style={{backgroundColor: 'hsl(var(--muted))'}}/></TableCell>
                <TableCell className="p-1 align-middle"><Input type="number" value={mod.rolEspontaneo ?? ''} onChange={e => handleNumericUpdate(mod.id, 'rolEspontaneo', e.target.value)} disabled={!isEditing} className="bg-transparent border-0 text-left text-xs h-7 w-20" style={{backgroundColor: 'hsl(var(--muted))'}}/></TableCell>
                <TableCell className="p-1 align-middle"><Input type="number" value={mod.misiones ?? ''} onChange={e => handleNumericUpdate(mod.id, 'misiones', e.target.value)} disabled={!isEditing} className="bg-transparent border-0 text-left text-xs h-7 w-20" style={{backgroundColor: 'hsl(var(--muted))'}}/></TableCell>
                <TableCell className="p-1 align-middle"><Input type="number" value={mod.supervisiones ?? ''} onChange={e => handleNumericUpdate(mod.id, 'supervisiones', e.target.value)} disabled={!isEditing || !isSeniorOrElite} className="bg-transparent border-0 text-left text-xs h-7 w-20" style={{backgroundColor: 'hsl(var(--muted))'}}/></TableCell>
                <TableCell className="p-1 align-middle min-w-[120px]">
                  <Select value={mod.inactividad ?? ''} onValueChange={(value) => handleUpdate(mod.id, 'inactividad', value)} disabled={!isEditing}>
                    <SelectTrigger className="bg-transparent border-0 text-xs h-7"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Justificada">Justificada</SelectItem><SelectItem value="No justificada">No justificada</SelectItem><SelectItem value="Reducción">Reducción</SelectItem></SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="p-1 align-middle min-w-[120px]">
                   <Select value={mod.resumen ?? ''} onValueChange={(value) => handleUpdate(mod.id, 'resumen', value)} disabled={!isEditing}>
                    <SelectTrigger className={cn("border-0 font-bold text-xs h-7", mod.resumen && resumenColors[mod.resumen])}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(resumenColors).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                 <TableCell className="p-1 align-middle min-w-[90px]">
                   <Select value={mod.servidor} onValueChange={(value) => handleUpdate(mod.id, 'servidor', value as 'ESP' | 'ARG')} disabled={!isEditing}>
                    <SelectTrigger className={cn("border-0 font-bold text-xs h-7", servidorColors[mod.servidor])}><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="ESP">ESP</SelectItem><SelectItem value="ARG">ARG</SelectItem></SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="p-1 align-middle text-center">
                  <div className="flex justify-center items-center gap-1">
                     <Button variant="ghost" size="icon" onClick={() => moveRow(index, 'up')} disabled={index === 0} className="h-7 w-7"><ArrowUp className="h-4 w-4"/></Button>
                     <Button variant="ghost" size="icon" onClick={() => moveRow(index, 'down')} disabled={index === mods.length - 1} className="h-7 w-7"><ArrowDown className="h-4 w-4"/></Button>
                    {isEditing ? (
                      <>
                        <Button variant="ghost" size="icon" onClick={cancelEditing} className="h-7 w-7 text-green-400 hover:text-green-500"><Save className="h-4 w-4"/></Button>
                      </>
                    ) : (
                      <>
                        {canEdit && <Button variant="ghost" size="icon" onClick={() => startEditing(mod.id)} className="h-7 w-7 hover:text-primary"><Edit className="h-4 w-4"/></Button>}
                        {canDelete && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/80 hover:text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente al moderador.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(mod.id)} className={buttonVariants({ variant: "destructive" })}>Eliminar</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
       {canEdit && (
         <div className="mt-2 flex justify-start">
           <Button onClick={handleAddNew} size="sm" style={{backgroundColor: '#172e63'}}>
             <PlusCircle className="mr-2 h-4 w-4" />
             Añadir Moderador
           </Button>
         </div>
       )}
       {viewingMod && (
        <Dialog open={!!viewingMod} onOpenChange={(open) => !open && setViewingMod(null)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-6 w-6"/>
                        {viewingMod.nombre}
                         {viewingMod.esSgtPlus && <Badge style={{backgroundColor: '#fbbf24', color: '#172e63'}}>SGT+</Badge>}
                         {viewingMod.rangoPlus && viewingMod.rangoPlus !== 'Miembro' && <Badge className={cn(rangoPlusBadgeColors[viewingMod.rangoPlus])}>{viewingMod.rangoPlus}</Badge>}
                    </DialogTitle>
                    <DialogDescription>
                        Detalles del registro del moderador.
                    </DialogDescription>
                </DialogHeader>
                <Card>
                    <CardContent className="p-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="font-semibold">Rango:</div><div>{viewingMod.rangoPlus}</div>
                        <div className="font-semibold">Servidor:</div><div><Badge className={cn(servidorColors[viewingMod.servidor])}>{viewingMod.servidor}</Badge></div>
                        <div className="font-semibold">Entrenos:</div><div>{viewingMod.entrenos ?? 'N/A'}</div>
                        <div className="font-semibold">Entrenos Propios:</div><div>{viewingMod.entrenosPropios ?? 'N/A'}</div>
                        <div className="font-semibold">Trys:</div><div>{viewingMod.trys ?? 'N/A'}</div>
                        <div className="font-semibold">Roles de PJ:</div><div>{viewingMod.rolesPJ ?? 'N/A'}</div>
                        <div className="font-semibold">Rol Espontaneo:</div><div>{viewingMod.rolEspontaneo ?? 'N/A'}</div>
                        <div className="font-semibold">Misiones:</div><div>{viewingMod.misiones ?? 'N/A'}</div>
                        <div className="font-semibold">Supervisiones:</div><div>{viewingMod.supervisiones ?? 'N/A'}</div>
                        <div className="font-semibold">Inactividad:</div><div>{viewingMod.inactividad ?? 'Ninguna'}</div>
                        <div className="font-semibold">Resumen:</div><div><Badge className={cn(viewingMod.resumen && resumenColors[viewingMod.resumen])}>{viewingMod.resumen}</Badge></div>
                        <div className="font-semibold">Abandona:</div><div>{viewingMod.abandona ? 'Sí' : 'No'}</div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
       )}
    </div>
  );
}

