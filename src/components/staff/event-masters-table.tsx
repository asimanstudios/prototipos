

'use client';

import { useState } from 'react';
import type { EventMaster } from '@/lib/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Trash2, Edit, User, ArrowUp, ArrowDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const formSchema = z.object({
  staff: z.string().min(1, "El nombre es requerido."),
  region: z.enum(['ARG', 'ESP']),
  miniroles: z.number().nullable(),
  eventosSV1: z.number().nullable(),
  misionesSV2: z.number().nullable(),
  ayudasSV1_SV2: z.number().nullable(),
  inactividad: z.enum(['Justificada', 'Injustificada']).nullable(),
  advSanciones: z.number().nullable(),
  tipoAdvSancion: z.string().nullable(),
  requisitos: z.enum(['Completo', 'Incompleto por poco', 'Incompleto']).nullable(),
  notas: z.string().nullable(),
  ultimatum: z.string().nullable(),
});

type FormData = z.infer<typeof formSchema>;

type EventMastersTableProps = {
  eventMasters: EventMaster[];
  onEventMastersChange: (eventMasters: EventMaster[]) => void;
  canEdit: boolean;
  canDelete: boolean;
};


const regionColors = {
  'ESP': 'bg-red-700 text-white',
  'ARG': 'bg-blue-400 text-white',
};

const inactividadColors: { [key: string]: string } = {
  'Justificada': 'bg-green-500/80 text-white',
  'Injustificada': 'bg-red-500/80 text-white',
};

const requisitosColors: { [key: string]: string } = {
  'Completo': 'bg-green-500/80 text-white',
  'Incompleto por poco': 'bg-yellow-400/80 text-black',
  'Incompleto': 'bg-red-500/80 text-white',
};

export function EventMastersTable({ eventMasters, onEventMastersChange, canEdit, canDelete }: EventMastersTableProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEM, setEditingEM] = useState<EventMaster | null>(null);
  const [viewingEM, setViewingEM] = useState<EventMaster | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      staff: '',
      region: 'ARG',
      miniroles: null,
      eventosSV1: null,
      misionesSV2: null,
      ayudasSV1_SV2: null,
      inactividad: null,
      advSanciones: null,
      tipoAdvSancion: null,
      requisitos: null,
      notas: null,
      ultimatum: null,
    },
  });

  const handleAdd = () => {
    form.reset({
      staff: '', region: 'ARG', miniroles: null, eventosSV1: null, misionesSV2: null, ayudasSV1_SV2: null,
      inactividad: null, advSanciones: null, tipoAdvSancion: '', requisitos: null, notas: '', ultimatum: ''
    });
    setEditingEM(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (em: EventMaster) => {
    setEditingEM(em);
    form.reset({
        ...em,
        miniroles: em.miniroles ?? null,
        eventosSV1: em.eventosSV1 ?? null,
        misionesSV2: em.misionesSV2 ?? null,
        ayudasSV1_SV2: em.ayudasSV1_SV2 ?? null,
        advSanciones: em.advSanciones ?? null,
        tipoAdvSancion: em.tipoAdvSancion ?? null,
        notas: em.notas ?? null,
        ultimatum: em.ultimatum ?? null,
    });
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    onEventMastersChange(eventMasters.filter(item => item.id !== id));
    toast({
      title: "Registro eliminado",
      description: "El registro del Event Master ha sido eliminado exitosamente.",
      variant: "destructive",
    });
  };
  
  const numericOrNull = (value: string | number | null | undefined) => {
    if(value === '' || value === null || value === undefined) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  const onSubmit = (formData: FormData) => {
    const processedData = {
        ...formData,
        miniroles: numericOrNull(formData.miniroles),
        eventosSV1: numericOrNull(formData.eventosSV1),
        misionesSV2: numericOrNull(formData.misionesSV2),
        ayudasSV1_SV2: numericOrNull(formData.ayudasSV1_SV2),
        advSanciones: numericOrNull(formData.advSanciones),
    }

    if (editingEM) {
      onEventMastersChange(eventMasters.map(item => item.id === editingEM.id ? { ...item, ...processedData, id: editingEM.id } : item));
      toast({ title: "Registro actualizado", description: "Los datos del Event Master han sido actualizados." });
    } else {
      onEventMastersChange([{ id: new Date().toISOString(), ...processedData }, ...eventMasters]);
      toast({ title: "Registro creado", description: "Un nuevo Event Master ha sido añadido." });
    }
    setIsDialogOpen(false);
    setEditingEM(null);
  };

  const handleViewEM = (em: EventMaster) => {
    setViewingEM(em);
  };

  const moveRow = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === eventMasters.length - 1)
    ) {
      return;
    }
    const newEMs = [...eventMasters];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newEMs[index], newEMs[newIndex]] = [newEMs[newIndex], newEMs[index]];
    onEventMastersChange(newEMs);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Registros</h3>
        {canEdit && (
          <Button onClick={handleAdd} size="sm" style={{ backgroundColor: '#172e63' }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Registro
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="px-1 py-1 w-[30px]"></TableHead>
              <TableHead className="px-2 py-2 min-w-[150px]">Staff</TableHead>
              <TableHead className="px-2 py-2 min-w-[100px]">Región</TableHead>
              <TableHead className="px-2 py-2 min-w-[100px]">Miniroles</TableHead>
              <TableHead className="px-2 py-2 min-w-[120px]">Eventos SV1</TableHead>
              <TableHead className="px-2 py-2 min-w-[120px]">Misiones SV2</TableHead>
              <TableHead className="px-2 py-2 min-w-[140px]">Ayudas SV1/SV2</TableHead>
              <TableHead className="px-2 py-2 min-w-[120px]">Inactividad</TableHead>
              <TableHead className="px-2 py-2 min-w-[180px]">Nro. ADV/Sanciones</TableHead>
              <TableHead className="px-2 py-2 min-w-[150px]">Tipo ADV/Sanción</TableHead>
              <TableHead className="px-2 py-2 min-w-[180px]">Requisitos</TableHead>
              <TableHead className="px-2 py-2 min-w-[200px]">Notas</TableHead>
              <TableHead className="px-2 py-2 min-w-[200px]">Ultimatum/Advertencias</TableHead>
              <TableHead className="text-right px-2 py-2">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventMasters.map((em, index) => (
              <TableRow key={em.id}>
                <TableCell className="px-0 py-0 align-middle">
                    <div className="flex flex-col items-center">
                        <Button variant="ghost" size="icon" onClick={() => moveRow(index, 'up')} disabled={index === 0} className="h-5 w-5"><ArrowUp className="h-3 w-3"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => moveRow(index, 'down')} disabled={index === eventMasters.length - 1} className="h-5 w-5"><ArrowDown className="h-3 w-3"/></Button>
                    </div>
                </TableCell>
                <TableCell className="font-medium cursor-pointer hover:underline px-2 py-1" onClick={() => handleViewEM(em)}>{em.staff}</TableCell>
                <TableCell className="px-2 py-1"><Badge className={cn("text-xs", regionColors[em.region])}>{em.region}</Badge></TableCell>
                <TableCell className="px-2 py-1">{em.miniroles}</TableCell>
                <TableCell className="px-2 py-1">{em.eventosSV1}</TableCell>
                <TableCell className="px-2 py-1">{em.misionesSV2}</TableCell>
                <TableCell className="px-2 py-1">{em.ayudasSV1_SV2}</TableCell>
                <TableCell className="px-2 py-1">
                  {em.inactividad && <Badge className={cn("text-xs", inactividadColors[em.inactividad])}>{em.inactividad}</Badge>}
                </TableCell>
                <TableCell className="px-2 py-1">{em.advSanciones}</TableCell>
                <TableCell className="truncate max-w-[150px] px-2 py-1">{em.tipoAdvSancion}</TableCell>
                <TableCell className="px-2 py-1">
                   {em.requisitos && <Badge className={cn("text-xs", requisitosColors[em.requisitos])}>{em.requisitos}</Badge>}
                </TableCell>
                <TableCell className="truncate max-w-[200px] px-2 py-1">{em.notas}</TableCell>
                <TableCell className="truncate max-w-[200px] px-2 py-1">{em.ultimatum}</TableCell>
                <TableCell className="text-right px-2 py-1">
                  <div className="flex items-center justify-end">
                    {(canEdit || canDelete) && (
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canEdit && <DropdownMenuItem onClick={() => handleEdit(em)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>}
                            {canDelete && <AlertDialogTrigger asChild><DropdownMenuItem><Trash2 className="mr-2 h-4 w-4 text-destructive" />Eliminar</DropdownMenuItem></AlertDialogTrigger>}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente el registro del Event Master.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(em.id)} className={buttonVariants({ variant: "destructive" })}>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{editingEM ? 'Editar Registro' : 'Añadir Nuevo Registro'}</DialogTitle>
            <DialogDescription>
              {editingEM ? 'Actualiza los datos del Event Master.' : 'Rellena los campos para añadir un nuevo Event Master.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField control={form.control} name="staff" render={({ field }) => (
                    <FormItem><FormLabel>Staff</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="region" render={({ field }) => (
                    <FormItem><FormLabel>Región</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="ARG">ARG</SelectItem><SelectItem value="ESP">ESP</SelectItem></SelectContent>
                      </Select><FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="miniroles" render={({ field }) => (
                    <FormItem><FormLabel>Miniroles</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="eventosSV1" render={({ field }) => (
                    <FormItem><FormLabel>Eventos SV1</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="misionesSV2" render={({ field }) => (
                    <FormItem><FormLabel>Misiones SV2</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="ayudasSV1_SV2" render={({ field }) => (
                    <FormItem><FormLabel>Ayudas SV1/SV2</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="inactividad" render={({ field }) => (
                      <FormItem><FormLabel>Inactividad</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value ?? ''}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar"/></SelectTrigger></FormControl>
                              <SelectContent>
                                  <SelectItem value="Justificada">Justificada</SelectItem>
                                  <SelectItem value="Injustificada">Injustificada</SelectItem>
                              </SelectContent>
                          </Select><FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="advSanciones" render={({ field }) => (
                    <FormItem><FormLabel>Nro. ADV/Sanciones</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="tipoAdvSancion" render={({ field }) => (
                    <FormItem><FormLabel>Tipo ADV/Sanción</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="requisitos" render={({ field }) => (
                      <FormItem><FormLabel>Requisitos</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value ?? ''}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                              <SelectContent>
                                  <SelectItem value="Completo">Completo</SelectItem>
                                  <SelectItem value="Incompleto por poco">Incompleto por poco</SelectItem>
                                  <SelectItem value="Incompleto">Incompleto</SelectItem>
                              </SelectContent>
                          </Select><FormMessage />
                      </FormItem>
                  )} />
              </div>
               <FormField control={form.control} name="notas" render={({ field }) => (
                  <FormItem>
                      <FormLabel>Notas</FormLabel>
                      <FormControl><Textarea {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
               <FormField control={form.control} name="ultimatum" render={({ field }) => (
                  <FormItem>
                      <FormLabel>Ultimatum/Advertencias</FormLabel>
                      <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">Guardar cambios</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {viewingEM && (
        <Dialog open={!!viewingEM} onOpenChange={(open) => !open && setViewingEM(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <User className="h-6 w-6"/>
                    {viewingEM.staff}
                </DialogTitle>
                <DialogDescription>
                    Detalles del registro del Event Master.
                </DialogDescription>
            </DialogHeader>
            <Card>
                <CardContent className="p-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="font-semibold">Región:</div><div><Badge className={cn("text-xs", regionColors[viewingEM.region])}>{viewingEM.region}</Badge></div>
                    <div className="font-semibold">Miniroles:</div><div>{viewingEM.miniroles ?? 'N/A'}</div>
                    <div className="font-semibold">Eventos SV1:</div><div>{viewingEM.eventosSV1 ?? 'N/A'}</div>
                    <div className="font-semibold">Misiones SV2:</div><div>{viewingEM.misionesSV2 ?? 'N/A'}</div>
                    <div className="font-semibold">Ayudas SV1/SV2:</div><div>{viewingEM.ayudasSV1_SV2 ?? 'N/A'}</div>
                    <div className="font-semibold">Inactividad:</div><div>{viewingEM.inactividad ? <Badge className={cn("text-xs", inactividadColors[viewingEM.inactividad])}>{viewingEM.inactividad}</Badge> : 'Ninguna'}</div>
                    <div className="font-semibold">Nro. ADV/Sanciones:</div><div>{viewingEM.advSanciones ?? 'N/A'}</div>
                    <div className="font-semibold col-span-2">Tipo ADV/Sanción:</div><div className="col-span-2">{viewingEM.tipoAdvSancion ?? 'N/A'}</div>
                    <div className="font-semibold">Requisitos:</div><div>{viewingEM.requisitos ? <Badge className={cn("text-xs", requisitosColors[viewingEM.requisitos])}>{viewingEM.requisitos}</Badge> : 'N/A'}</div>
                    <div className="font-semibold col-span-2">Notas:</div><div className="col-span-2">{viewingEM.notas ?? 'N/A'}</div>
                    <div className="font-semibold col-span-2">Ultimatum/Advertencias:</div><div className="col-span-2">{viewingEM.ultimatum ?? 'N/A'}</div>
                </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
