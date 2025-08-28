
'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useUserRole } from '@/context/UserRoleContext';
import type { ModPlusGroup, ModPlus, UserRole, Suggestion } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ModsPlusTable } from './mods-plus-table';
import { PlusCircle, Trash2, Edit, Save, Lightbulb, ThumbsUp, ThumbsDown, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

function SuggestionsSection({ 
    promotions,
    warnings,
    onSuggestionsChange,
    mods, 
    role 
}: { 
    promotions: Suggestion[],
    warnings: Suggestion[],
    onSuggestionsChange: (promotions: Suggestion[], warnings: Suggestion[]) => void,
    mods: ModPlus[], 
    role: UserRole
}) {
    const [newSuggestion, setNewSuggestion] = useState<{type: 'promotion' | 'warning', modId: string, reason: string}>({type: 'promotion', modId: '', reason: ''});

    const canSuggest = useMemo(() => ['Senior', 'Ejecutivo', 'Director'].includes(role), [role]);
    const suggestibleMods = mods.filter(m => m.resumen !== 'Nuevo');

    const handleAddSuggestion = () => {
        const mod = mods.find(m => m.id === newSuggestion.modId);
        if (!mod || !newSuggestion.reason) return;

        const suggestion: Suggestion = { modId: mod.id, modName: mod.nombre, reason: newSuggestion.reason };
        let newPromotions = [...promotions];
        let newWarnings = [...warnings];

        if (newSuggestion.type === 'promotion') {
            newPromotions.push(suggestion);
        } else {
            newWarnings.push(suggestion);
        }
        onSuggestionsChange(newPromotions, newWarnings);
        setNewSuggestion({type: 'promotion', modId: '', reason: ''});
    };

    const handleRemoveSuggestion = (type: 'promotion' | 'warning', index: number) => {
        if (!canSuggest) return;
        let newPromotions = [...promotions];
        let newWarnings = [...warnings];
        if (type === 'promotion') {
            newPromotions = promotions.filter((_, i) => i !== index);
        } else {
            newWarnings = warnings.filter((_, i) => i !== index);
        }
        onSuggestionsChange(newPromotions, newWarnings);
    };

    return (
        <div className="mt-6 p-4 rounded-lg bg-black/30 border border-white/10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{color: '#fbbf24'}}><Lightbulb /> Panel de Sugerencias</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2 text-green-400"><ThumbsUp /> Sugerencias de Ascenso</h4>
                    <div className="space-y-2">
                        {promotions.map((p, i) => (
                            <div key={i} className="flex items-start justify-between bg-black/20 p-2 rounded-md">
                                <div>
                                    <p className="font-semibold">{p.modName}</p>
                                    <p className="text-xs text-muted-foreground">{p.reason}</p>
                                </div>
                                {canSuggest && <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleRemoveSuggestion('promotion', i)}><Trash2 className="h-4 w-4"/></Button>}
                            </div>
                        ))}
                         {promotions.length === 0 && <p className="text-xs text-muted-foreground">No hay sugerencias de ascenso.</p>}
                    </div>
                </div>
                 <div>
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2 text-red-400"><ThumbsDown /> Sugerencias de Advertencia</h4>
                    <div className="space-y-2">
                         {warnings.map((w, i) => (
                            <div key={i} className="flex items-start justify-between bg-black/20 p-2 rounded-md">
                                <div>
                                    <p className="font-semibold">{w.modName}</p>
                                    <p className="text-xs text-muted-foreground">{w.reason}</p>
                                </div>
                                {canSuggest && <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => handleRemoveSuggestion('warning', i)}><Trash2 className="h-4 w-4"/></Button>}
                            </div>
                        ))}
                        {warnings.length === 0 && <p className="text-xs text-muted-foreground">No hay sugerencias de advertencia.</p>}
                    </div>
                </div>
            </div>
            {canSuggest && (
                 <div className="mt-4 pt-4 border-t border-white/20 space-y-4">
                    <h4 className="font-bold">Añadir Sugerencia</h4>
                     <div className="flex gap-4 items-end">
                        <div className="w-1/4">
                            <label className="text-xs font-medium">Tipo</label>
                            <Select value={newSuggestion.type} onValueChange={(v) => setNewSuggestion({...newSuggestion, type: v as any, modId: ''})}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="promotion">Ascenso</SelectItem>
                                    <SelectItem value="warning">Advertencia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="w-1/4">
                            <label className="text-xs font-medium">Moderador</label>
                            <Select value={newSuggestion.modId} onValueChange={(v) => setNewSuggestion({...newSuggestion, modId: v})}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar"/></SelectTrigger>
                                <SelectContent>
                                    {suggestibleMods.map(m => (
                                        <SelectItem key={m.id} value={m.id} disabled={m.resumen === 'Nuevo'}>{m.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-grow">
                             <label className="text-xs font-medium">Razón</label>
                            <Textarea placeholder="Motivo de la sugerencia..." value={newSuggestion.reason} onChange={(e) => setNewSuggestion({...newSuggestion, reason: e.target.value})} className="h-10"/>
                        </div>
                        <Button onClick={handleAddSuggestion} style={{backgroundColor: '#172e63'}}><PlusCircle className="mr-2 h-4 w-4"/> Añadir</Button>
                     </div>
                </div>
            )}
        </div>
    );
}

export function ModsPlusGroups() {
  const { role } = useUserRole();
  const { toast } = useToast();
  const [groups, setGroups] = useState<ModPlusGroup[]>([]);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [suggestionsVisible, setSuggestionsVisible] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const sanitizedGroups = (data.modsPlusGroups || []).map((g: ModPlusGroup) => {
          const rankOrder: { [key: string]: number } = { 'Senior': 1, 'Elite': 2, 'Miembro': 3 };
          const sortedMods = [...(g.mods || [])].sort((a, b) => {
              const rankA = a.rangoPlus ? rankOrder[a.rangoPlus] : 4;
              const rankB = b.rangoPlus ? rankOrder[b.rangoPlus] : 4;
              if (rankA !== rankB) return rankA - rankB;
              return a.nombre.localeCompare(b.nombre);
          });
          return {
              ...g,
              mods: sortedMods,
              promotions: g.promotions || [],
              warnings: g.warnings || [],
          };
      });
      setGroups(sanitizedGroups);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      toast({ title: 'Error', description: 'No se pudieron cargar los grupos de mods plus.', variant: 'destructive' });
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const persistChanges = useCallback(async (newGroups: ModPlusGroup[]) => {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modsPlusGroups: newGroups }),
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
  const canViewSuggestions = useMemo(() => ['Senior', 'Ejecutivo', 'Director'].includes(role), [role]);

  const handleAddGroup = () => {
    const newGroupId = `group-plus-${Date.now()}`;
    const newGroup: ModPlusGroup = {
      id: newGroupId,
      nombre: `Nuevo Grupo`,
      revisadoPor: '',
      modsElites: '',
      senior: '',
      directores: '',
      periodo: '',
      hora: '',
      mods: [],
      promotions: [],
      warnings: [],
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

  const handleGroupChange = (groupId: string, field: keyof ModPlusGroup, value: any) => {
    const newGroups = groups.map(g => g.id === groupId ? { ...g, [field]: value } : g);
    setGroups(newGroups);
  };
  
  const handleModsChange = (groupId: string, mods: ModPlusGroup['mods']) => {
    const newGroups = groups.map(g => g.id === groupId ? { ...g, mods: mods } : g);
    setGroups(newGroups);
    persistChanges(newGroups);
  };

  const handleSuggestionsChange = (groupId: string, promotions: Suggestion[], warnings: Suggestion[]) => {
      const newGroups = groups.map(g => g.id === groupId ? { ...g, promotions, warnings } : g);
      setGroups(newGroups);
      persistChanges(newGroups);
  };

  const startEditing = (id: string) => {
    if (canEdit) setEditingGroupId(id);
  };
  
  const saveEditing = () => {
    setEditingGroupId(null);
    persistChanges(groups);
    toast({ title: "Grupo Actualizado", description: "Los detalles del grupo se han guardado." });
  };
  
  const toggleSuggestions = (groupId: string) => {
    setSuggestionsVisible(prev => ({...prev, [groupId]: !prev[groupId]}));
  }

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groups;
    return groups.filter(group => 
      group.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.periodo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groups, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-4">
        <div className="relative w-full max-w-md">
          <Input 
            type="text"
            placeholder="Buscar por nombre o período..."
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
                            <Input value={group.nombre} onChange={(e) => handleGroupChange(group.id, 'nombre', e.target.value)} className="text-2xl font-bold border-2 border-primary" />
                        ) : (
                            <h2 className="text-2xl font-bold" style={{color: '#fbbf24'}}>{group.nombre}</h2>
                        )}
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <Button onClick={() => saveEditing()} size="sm" className="bg-green-600 hover:bg-green-700"><Save className="mr-2 h-4 w-4"/> Guardar</Button>
                          </>
                        ) : (
                          <>
                           {canEdit && <Button onClick={() => startEditing(group.id)} size="sm" variant="outline"><Edit className="mr-2 h-4 w-4"/> Editar Grupo</Button>}
                           {canDelete && 
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive"><Trash2 className="mr-2 h-4 w-4"/>Eliminar Grupo</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar este grupo?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer. Se borrarán todos los registros de moderadores de este grupo.</AlertDialogDescription></AlertDialogHeader>
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 p-4 rounded-lg bg-black/30 border border-white/10">
                            {Object.entries({revisadoPor: "Revisado por", modsElites: "Mod Elites", senior: "Senior", directores: "Directores", periodo: "Periodo", hora: "Hora"}).map(([key, label]) => (
                                <div key={key}>
                                    <label className="text-xs font-bold text-muted-foreground">{label}</label>
                                    <Input 
                                        value={(group as any)[key]} 
                                        onChange={(e) => handleGroupChange(group.id, key as keyof ModPlusGroup, e.target.value)} 
                                        disabled={!isEditing} 
                                        className="text-sm bg-transparent border-0 border-b rounded-none px-1"
                                    />
                                </div>
                            ))}
                        </div>
                      <ModsPlusTable
                        mods={group.mods}
                        onModsChange={(mods) => handleModsChange(group.id, mods)}
                        canEdit={canEdit}
                        canDelete={canDelete}
                      />
                       {canViewSuggestions && (
                         <div className="mt-4 flex justify-end">
                            <Button onClick={() => toggleSuggestions(group.id)} variant="outline">
                                <Lightbulb className="mr-2 h-4 w-4" />
                                Sugerencias de Ascensos y Advertencias
                            </Button>
                         </div>
                       )}
                      {suggestionsVisible[group.id] && canViewSuggestions && (
                        <SuggestionsSection 
                            promotions={group.promotions}
                            warnings={group.warnings}
                            onSuggestionsChange={(promotions, warnings) => handleSuggestionsChange(group.id, promotions, warnings)}
                            mods={group.mods} 
                            role={role} 
                        />
                      )}
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
