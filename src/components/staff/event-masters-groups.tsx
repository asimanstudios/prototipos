'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useUserRole } from '@/context/UserRoleContext';
import type { EventMasterGroup, EventMaster } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EventMastersTable } from './event-masters-table';
import { PlusCircle, Trash2, Edit, Save, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function EventMastersGroups() {
  const { role } = useUserRole();
  const { toast } = useToast();
  const [groups, setGroups] = useState<EventMasterGroup[]>([]);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const sanitizedGroups = (data.eventMasterGroups || []).map((g: EventMasterGroup) => ({
          ...g,
          oficiales: [...(g.oficiales || [])].sort((a,b) => a.staff.localeCompare(b.staff)),
          aPrueba: [...(g.aPrueba || [])].sort((a,b) => a.staff.localeCompare(b.staff)),
      }));
      setGroups(sanitizedGroups);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      toast({ title: 'Error', description: 'No se pudieron cargar los grupos de Event Masters.', variant: 'destructive' });
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const persistChanges = useCallback(async (newGroups: EventMasterGroup[]) => {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventMasterGroups: newGroups }),
      });
      if (!response.ok) throw new Error('Failed to save data');
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudieron guardar los cambios.', variant: 'destructive' });
      fetchData();
    }
  }, [toast, fetchData]);

  const canCreate = useMemo(() => ['Director', 'Ejecutivo'].includes(role), [role]);
  const canEdit = useMemo(() => ['Director', 'Ejecutivo', 'Elite'].includes(role), [role]);
  const canDelete = useMemo(() => ['Director', 'Ejecutivo'].includes(role), [role]);

  const handleAddGroup = () => {
    const newGroupId = `em-group-${Date.now()}`;
    const newGroup: EventMasterGroup = {
      id: newGroupId,
      mes: `Nuevo Mes`,
      fechaRealizacion: '',
      elitesACargo: '',
      totalEMs: 0,
      oficiales: [],
      aPrueba: [],
    };
    const newGroups = [newGroup, ...groups];
    setGroups(newGroups);
    setEditingGroupId(newGroupId);
    persistChanges(newGroups);
    toast({ title: "Grupo Creado", description: "Un nuevo grupo ha sido añadido. Ahora puedes editar sus detalles." });
  };
  
  const handleDeleteGroup = (groupId: string) => {
    const newGroups = groups.filter(g => g.id !== groupId);
    setGroups(newGroups);
    persistChanges(newGroups);
    toast({ title: "Grupo Eliminado", description: "El grupo ha sido eliminado exitosamente.", variant: "destructive" });
  };

  const handleGroupChange = (groupId: string, field: keyof EventMasterGroup, value: any) => {
    const newGroups = groups.map(g => g.id === groupId ? { ...g, [field]: value } : g);
    setGroups(newGroups);
  };
  
  const handleEMsChange = (groupId: string, type: 'oficiales' | 'aPrueba', ems: EventMaster[]) => {
    const updatedGroups = groups.map(g => {
        if (g.id === groupId) {
            const updatedGroup = { ...g, [type]: ems };
            const totalEMs = (updatedGroup.oficiales?.length || 0) + (updatedGroup.aPrueba?.length || 0);
            return { ...updatedGroup, totalEMs };
        }
        return g;
    });
    setGroups(updatedGroups);
    persistChanges(updatedGroups);
  };
  
  const startEditing = (id: string) => {
    if (canEdit) setEditingGroupId(id);
  };
  
  const saveEditing = () => {
    setEditingGroupId(null);
    persistChanges(groups);
    toast({ title: "Grupo Actualizado", description: "Los detalles del grupo se han guardado." });
  };

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groups;
    return groups.filter(group => 
      group.mes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.fechaRealizacion.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groups, searchTerm]);

  return (
    <div className="space-y-4">
       <div className="flex justify-center mb-4">
        <div className="relative w-full max-w-md">
          <Input 
            type="text"
            placeholder="Buscar por mes o fecha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <Accordion type="multiple" className="w-full space-y-4">
        {filteredGroups.map(group => {
            const isEditing = editingGroupId === group.id;
            return (
              <Card key={group.id} className="bg-card/60 backdrop-blur-sm border border-white/10 hover:border-[#fbbf24] transition-all duration-300 hover:shadow-[0_0_20px_#fbbf24]">
                <AccordionItem value={group.id} className="border-b-0">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-center">
                        {isEditing ? (
                            <Input value={group.mes} onChange={(e) => handleGroupChange(group.id, 'mes', e.target.value)} className="text-2xl font-bold border-2 border-primary" />
                        ) : (
                            <h2 className="text-2xl font-bold" style={{color: '#fbbf24'}}>{group.mes}</h2>
                        )}
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                            <Button onClick={saveEditing} size="sm" className="bg-green-600 hover:bg-green-700"><Save className="mr-2 h-4 w-4"/> Guardar</Button>
                        ) : (
                          <>
                           {canEdit && <Button onClick={() => startEditing(group.id)} size="sm" variant="outline"><Edit className="mr-2 h-4 w-4"/> Editar Grupo</Button>}
                           {canDelete && 
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive"><Trash2 className="mr-2 h-4 w-4"/>Eliminar Grupo</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar este grupo?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer. Se borrarán todos los registros de EMs de este grupo.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteGroup(group.id)} className={buttonVariants({ variant: "destructive" })}>Eliminar</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                           }
                          </>
                        )}
                        <AccordionTrigger className="p-2 rounded-md hover:bg-primary/20" />
                      </div>
                    </div>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="p-4 pt-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 rounded-lg bg-black/30 border border-white/10">
                            <div>
                                <label className="text-xs font-bold text-muted-foreground">Fecha de Realización</label>
                                <Input value={group.fechaRealizacion} onChange={(e) => handleGroupChange(group.id, 'fechaRealizacion', e.target.value)} disabled={!isEditing} className="text-sm bg-transparent border-0 border-b rounded-none px-1"/>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-muted-foreground">Élites a cargo</label>
                                <Input value={group.elitesACargo} onChange={(e) => handleGroupChange(group.id, 'elitesACargo', e.target.value)} disabled={!isEditing} className="text-sm bg-transparent border-0 border-b rounded-none px-1"/>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-muted-foreground">Total de EMs</label>
                                <p className="text-sm pt-2">{group.totalEMs} ({group.oficiales.length} Oficiales, {group.aPrueba.length} A Prueba)</p>
                            </div>
                        </div>
                        <Tabs defaultValue="oficiales" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="oficiales">Oficiales</TabsTrigger>
                                <TabsTrigger value="aPrueba">A Prueba</TabsTrigger>
                            </TabsList>
                            <TabsContent value="oficiales">
                                <EventMastersTable
                                    eventMasters={group.oficiales}
                                    onEventMastersChange={(ems) => handleEMsChange(group.id, 'oficiales', ems)}
                                    canEdit={canEdit}
                                    canDelete={canDelete}
                                />
                            </TabsContent>
                            <TabsContent value="aPrueba">
                                <EventMastersTable
                                    eventMasters={group.aPrueba}
                                    onEventMastersChange={(ems) => handleEMsChange(group.id, 'aPrueba', ems)}
                                    canEdit={canEdit}
                                    canDelete={canDelete}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            );
        })}
      </Accordion>
      {canCreate && (
        <div className="mt-6 flex justify-center">
          <Button onClick={handleAddGroup} size="lg" style={{backgroundColor: '#172e63'}}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Añadir Nuevo Grupo de Registro
          </Button>
        </div>
      )}
    </div>
  );
}
