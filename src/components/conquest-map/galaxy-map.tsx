

'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Route as RouteIcon, PlusCircle, Pencil, ZoomIn, ZoomOut, Info, Maximize, X, Save, BookOpen, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Planet, Route, FactionKey, RouteColor } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '../ui/slider';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

const factions = {
  REPUBLICANO: { color: '#FF0000', label: 'Planeta Republicano' },
  SEPARATISTA: { color: '#0000FF', label: 'Planeta Separatista' },
  ALIADO: { color: '#00FF00', label: 'Planeta Aliado' },
  NEUTRAL: { color: '#808080', label: 'Planeta Neutral' },
  CONTRABANDISTAS: { color: '#A52A2A', label: 'Contrabandistas' },
  MANDALORE: { color: '#FFA500', label: 'Mandalore' },
  DISPUTA: { color: '#FFFF00', label: 'Planeta en Disputa' },
};

const routeTypes = {
    '#9370DB': { label: 'Ruta Hydiana', dashed: false},
    '#00FFFF': { label: 'Espinal Comercial Coreliana', dashed: false},
    '#FF69B4': { label: 'Ruta Comercial de Rimma', dashed: false},
    '#FFFF00': { label: 'Corredor Coreliano', dashed: false},
    '#FF4500': { label: 'Ruta Comercial Perlemiana', dashed: false},
    'white': { label: 'Ruta Hiperespacial Menor', dashed: true},
}

function MapLegend() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="absolute top-4 left-4 z-10 bg-card/80 backdrop-blur-sm">
                    <Info className="h-5 w-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent side="right" align="start" className="w-auto p-4 bg-card/80 backdrop-blur-sm">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-sm mb-2 text-primary">Facciones</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            {Object.values(factions).map(({color, label}) => (
                                <div key={label} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: color}}></div>
                                    <span className="text-xs">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="font-bold text-sm mb-2 text-primary">Rutas</h4>
                         <div className="space-y-2">
                            {Object.entries(routeTypes).map(([color, {label, dashed}]) => (
                                <div key={label} className="flex items-center gap-2">
                                    <svg width="20" height="10" className="flex-shrink-0"><line x1="0" y1="5" x2="20" y2="5" stroke={color} strokeWidth="2" strokeDasharray={dashed ? '3,3' : 'none'}/></svg>
                                    <span className="text-xs">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

function MapView({ planets, routes, selectedPlanet, routeFrom, routeTo, onPlanetClick, onPlanetDoubleClick }: {
    planets: Record<string, Planet>,
    routes: Route[],
    selectedPlanet: string | null,
    routeFrom: string,
    routeTo: string,
    onPlanetClick: (name: string) => void,
    onPlanetDoubleClick: (name: string) => void
}) {
    const [zoom, setZoom] = useState(1);
    const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 900, height: 850 });
    const [isPanning, setIsPanning] = useState(false);
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const svgRef = useRef<SVGSVGElement>(null);

    const handleZoom = (newZoom: number) => {
        const clampedZoom = Math.max(0.5, Math.min(newZoom, 5));
        setZoom(clampedZoom);
    };

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        if (e.button !== 0) return;
        setIsPanning(true);
        setStartPoint({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isPanning || !svgRef.current) return;
        e.preventDefault();
        const { width, height } = svgRef.current.getBoundingClientRect();
        const dx = (e.clientX - startPoint.x) * ((viewBox.width / zoom) / width);
        const dy = (e.clientY - startPoint.y) * ((viewBox.height / zoom) / height);

        const newX = viewBox.x - dx;
        const newY = viewBox.y - dy;
        
        setViewBox(prev => ({...prev, x: newX, y: newY}));
        setStartPoint({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
        e.preventDefault();
        if (!svgRef.current) return;

        const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
        const newZoom = Math.max(0.5, Math.min(zoom * zoomFactor, 5));
        
        const svgRect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;
        
        const mousePoint = {
            x: viewBox.x + (mouseX / svgRect.width) * (viewBox.width / zoom),
            y: viewBox.y + (mouseY / svgRect.height) * (viewBox.height / zoom)
        };

        const newViewBoxWidth = viewBox.width / newZoom;
        const newViewBoxHeight = viewBox.height / newZoom;

        const newX = mousePoint.x - (mouseX / svgRect.width) * newViewBoxWidth;
        const newY = mousePoint.y - (mouseY / svgRect.height) * newViewBoxHeight;
        
        setViewBox({ width: viewBox.width, height: viewBox.height, x: newX, y: newY });
        setZoom(newZoom);
    };

    return (
        <div className="w-full h-full relative">
            <svg 
                ref={svgRef}
                width="100%" 
                height="100%" 
                viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width / zoom} ${viewBox.height / zoom}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                className={isPanning ? "cursor-grabbing" : "cursor-grab"}
            >
                <rect x={viewBox.x} y={viewBox.y} width={viewBox.width / zoom} height={viewBox.height / zoom} fill="none" />
                {routes.map((route, i) => {
                    const fromPlanet = planets[route.from];
                    const toPlanet = planets[route.to];
                    if (!fromPlanet || !toPlanet) return null;
                    return (
                    <line
                        key={i}
                        x1={fromPlanet.x}
                        y1={fromPlanet.y}
                        x2={toPlanet.x}
                        y2={toPlanet.y}
                        stroke={route.color}
                        strokeWidth="2"
                        strokeDasharray={route.dashed ? '5,5' : 'none'}
                    />
                    );
                })}
                {Object.entries(planets).map(([name, { x, y, faction }]) => (
                    <g key={name} transform={`translate(${x}, ${y})`} className="cursor-pointer group" onClick={() => onPlanetClick(name)} onDoubleClick={() => onPlanetDoubleClick(name)}>
                    <circle
                        r="10"
                        fill={factions[faction].color}
                        stroke={selectedPlanet === name || routeFrom === name || routeTo === name ? '#fbbf24' : '#fff'}
                        strokeWidth="2"
                        className="transition-all group-hover:r-[12]"
                    />
                    <text
                        x="15"
                        y="5"
                        fill="#fff"
                        fontSize="12"
                        className="pointer-events-none select-none transition-all group-hover:font-bold"
                    >
                        {name}
                    </text>
                    </g>
                ))}
            </svg>
            <MapLegend />
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-card/80 backdrop-blur-sm p-2 rounded-lg">
                <Button variant="outline" size="icon" onClick={() => handleZoom(zoom * (1/1.1))} disabled={zoom <= 0.5}><ZoomOut className="h-5 w-5"/></Button>
                <Slider
                    value={[zoom]}
                    onValueChange={(value) => handleZoom(value[0])}
                    min={0.5}
                    max={5}
                    step={0.1}
                    className="w-24"
                />
                <Button variant="outline" size="icon" onClick={() => handleZoom(zoom * 1.1)} disabled={zoom >= 5}><ZoomIn className="h-5 w-5"/></Button>
            </div>
        </div>
    )
}

export function GalaxyMap() {
  const { toast } = useToast();
  const [planets, setPlanets] = useState<Record<string, Planet>>({});
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [viewingPlanet, setViewingPlanet] = useState<{name: string, data: Planet} | null>(null);
  const [editingPlanet, setEditingPlanet] = useState<Planet & { name: string } | null>(null);

  const [routeFrom, setRouteFrom] = useState<string>('');
  const [routeTo, setRouteTo] = useState<string>('');
  const [routeType, setRouteType] = useState<RouteColor>('white');
  
  const [isMapMaximized, setIsMapMaximized] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setPlanets(data.planets || {});
      setRoutes(data.routes || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({ title: 'Error', description: 'No se pudieron cargar los datos del mapa.', variant: 'destructive' });
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const persistChanges = useCallback(async (newPlanets: Record<string, Planet>, newRoutes: Route[]) => {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planets: newPlanets, routes: newRoutes }),
      });
      if (!response.ok) throw new Error('Failed to save data');
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudieron guardar los cambios.', variant: 'destructive' });
      // Revert optimistic updates
      fetchData();
    }
  }, [toast, fetchData]);

  const handlePlanetClick = (planetName: string) => {
    if (selectedPlanet === planetName) {
      setSelectedPlanet(null);
      setRouteFrom('');
      setRouteTo('');
      return;
    }

    setSelectedPlanet(planetName);
    if (!routeFrom) {
      setRouteFrom(planetName);
    } else if (!routeTo && routeFrom !== planetName) {
      setRouteTo(planetName);
    } else {
      setRouteFrom(planetName);
      setRouteTo('');
    }
  };

  const handlePlanetDoubleClick = (planetName: string) => {
    setViewingPlanet({ name: planetName, data: planets[planetName] });
  };


  const changePlanetFaction = (faction: FactionKey) => {
    if (selectedPlanet) {
      const newPlanets = {
        ...planets,
        [selectedPlanet]: {
          ...planets[selectedPlanet],
          faction: faction,
        },
      };
      setPlanets(newPlanets);
      persistChanges(newPlanets, routes);
    }
  };

  const handleAddRoute = () => {
    if (routeFrom && routeTo && routeType) {
      const newRoute: Route = {
        from: routeFrom,
        to: routeTo,
        color: routeType,
        dashed: routeTypes[routeType].dashed,
      };
      const newRoutes = [...routes, newRoute];
      setRoutes(newRoutes);
      persistChanges(planets, newRoutes);
      toast({ title: 'Ruta Creada', description: `Se ha añadido una ruta entre ${routeFrom} y ${routeTo}.` });
      setRouteFrom('');
      setRouteTo('');
    } else {
      toast({ title: 'Error', description: 'Selecciona un planeta de origen, uno de destino y un tipo de ruta.', variant: 'destructive' });
    }
  };

  const handleDeleteRoute = (index: number) => {
    const routeToDelete = routes[index];
    const newRoutes = routes.filter((_, i) => i !== index);
    setRoutes(newRoutes);
    persistChanges(planets, newRoutes);
    toast({ title: 'Ruta Eliminada', description: `La ruta entre ${routeToDelete.from} y ${routeToDelete.to} ha sido eliminada.`, variant: 'destructive' });
  };

  const handleStartEditing = () => {
    if (!viewingPlanet) return;
    setEditingPlanet({ ...viewingPlanet.data, name: viewingPlanet.name });
    setViewingPlanet(null);
  };

  const handleSavePlanetDetails = () => {
    if (!editingPlanet) return;
    const { name, ...planetData } = editingPlanet;
    const newPlanets = { ...planets, [name]: planetData };
    setPlanets(newPlanets);
    persistChanges(newPlanets, routes);
    toast({ title: 'Planeta Actualizado', description: `Los detalles de ${name} se han guardado.` });
    setEditingPlanet(null);
  };

  const closeAllDialogs = () => {
      setViewingPlanet(null);
      setEditingPlanet(null);
  }
    
  return (
    <>
    <div className="flex w-full h-full gap-4">
      <div className="flex-1 h-full bg-black/50 rounded-lg p-2 relative overflow-hidden border border-[#fbbf24]">
          <MapView 
              planets={planets}
              routes={routes}
              selectedPlanet={selectedPlanet}
              routeFrom={routeFrom}
              routeTo={routeTo}
              onPlanetClick={handlePlanetClick}
              onPlanetDoubleClick={handlePlanetDoubleClick}
          />
        <Button variant="outline" size="icon" onClick={() => setIsMapMaximized(true)} className="absolute top-4 right-4 z-10 bg-card/80 backdrop-blur-sm">
            <Maximize className="h-5 w-5" />
        </Button>
      </div>
      <div className="w-[350px] h-full">
        <Card className="bg-card/80 backdrop-blur-sm h-full hover:border-[#fbbf24] transition-all duration-300 hover:shadow-[0_0_20px_#fbbf24]">
            <CardContent className="p-4 flex flex-col h-full">
              <Tabs defaultValue="planets" className="w-full flex flex-col h-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="planets"><Pencil className="mr-2 h-4 w-4" />Planetas</TabsTrigger>
                  <TabsTrigger value="routes"><RouteIcon className="mr-2 h-4 w-4" />Rutas</TabsTrigger>
                </TabsList>
                <TabsContent value="planets" className="flex-grow">
                  <h3 className="text-lg font-bold my-2 text-center" style={{ color: '#fbbf24' }}>Control de Facciones</h3>
                  <div className="space-y-2">
                      {Object.entries(factions).map(([key, { color, label }]) => (
                          <button 
                              key={key} 
                              onClick={() => changePlanetFaction(key as FactionKey)} 
                              disabled={!selectedPlanet}
                              className="w-full flex items-center p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/20"
                          >
                              <div className="w-4 h-4 rounded-full mr-3 border border-white/50" style={{ backgroundColor: color }}></div>
                              <span className="text-sm">{label}</span>
                          </button>
                      ))}
                  </div>
                  {selectedPlanet && (
                    <div className="mt-4 pt-4 border-t border-white/20 text-center">
                      <p className="text-sm text-muted-foreground">Planeta Seleccionado:</p>
                      <p className="font-bold text-lg" style={{ color: '#fbbf24' }}>{selectedPlanet}</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="routes" className="flex flex-col flex-grow">
                   <div className="flex-grow space-y-4">
                    <h3 className="text-lg font-bold text-center mb-2" style={{ color: '#fbbf24' }}>Gestión de Rutas</h3>
                    <div className='space-y-2'>
                      <label className="text-sm font-medium">Origen:</label>
                      <Input value={routeFrom} readOnly placeholder="Selecciona un planeta en el mapa" />
                    </div>
                    <div className='space-y-2'>
                      <label className="text-sm font-medium">Destino:</label>
                      <Input value={routeTo} readOnly placeholder="Selecciona un segundo planeta" />
                    </div>
                    <div className='space-y-2'>
                      <label className="text-sm font-medium">Tipo de Ruta:</label>
                      <Select onValueChange={(value) => setRouteType(value as RouteColor)} defaultValue={routeType}>
                          <SelectTrigger><SelectValue placeholder="Elige un tipo" /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(routeTypes).map(([color, {label}]) => (
                              <SelectItem key={color} value={color}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleAddRoute} className="w-full" style={{ backgroundColor: '#172e63' }}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Añadir Ruta
                    </Button>
                    <Separator className="my-2 bg-white/20"/>
                     <div className="flex-grow overflow-y-auto space-y-2 max-h-48">
                          {routes.map((route, index) => (
                            <div key={index} className="flex items-center justify-between p-1 bg-black/30 rounded-md">
                              <span className="text-xs truncate">{route.from} → {route.to}</span>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeleteRoute(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                      </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
        </Card>
      </div>
    </div>
    
    <Dialog open={isMapMaximized} onOpenChange={setIsMapMaximized}>
        <DialogContent className="w-[90vw] h-[90vh] max-w-none flex flex-col p-2 bg-black/80 border-[#fbbf24]">
             <DialogHeader className="flex-shrink-0">
                <DialogTitle className="text-white">Mapa de Conquista (Vista Ampliada)</DialogTitle>
                <DialogDescription className="sr-only">Vista ampliada del mapa de conquista galáctico.</DialogDescription>
                <Button onClick={() => setIsMapMaximized(false)} variant="ghost" size="icon" className="absolute top-2 right-2 z-20 text-white hover:text-white hover:bg-white/20">
                    <X className="h-6 w-6"/>
                </Button>
             </DialogHeader>
             <div className="flex-grow min-h-0">
                <MapView 
                    planets={planets}
                    routes={routes}
                    selectedPlanet={selectedPlanet}
                    routeFrom={routeFrom}
                    routeTo={routeTo}
                    onPlanetClick={handlePlanetClick}
                    onPlanetDoubleClick={handlePlanetDoubleClick}
                />
             </div>
        </DialogContent>
    </Dialog>

    <Dialog open={!!viewingPlanet || !!editingPlanet} onOpenChange={closeAllDialogs}>
        <DialogContent className={cn("sm:max-w-3xl", editingPlanet && "sm:max-w-2xl")}>
             {viewingPlanet && (
                <>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-3 text-3xl font-bold tracking-wider' style={{color: '#fbbf24'}}>
                        <div className='w-4 h-10 rounded-full' style={{backgroundColor: factions[viewingPlanet.data.faction].color}}></div>
                        {viewingPlanet.name}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {factions[viewingPlanet.data.faction].label}
                    </DialogDescription>
                </DialogHeader>
                <DialogBody className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4 font-mono text-gray-300">
                    <div className="space-y-2">
                        <h4 className="text-sm uppercase tracking-widest" style={{color: '#fbbf24'}}>Población Nativa</h4>
                        <p className="text-lg">{viewingPlanet.data.nativePopulation || 'Desconocida'}</p>
                    </div>
                    <Separator className="bg-[#fbbf24]/50" />
                    <div className="space-y-2">
                        <h4 className="text-sm uppercase tracking-widest" style={{color: '#fbbf24'}}>Lore del Planeta</h4>
                        <p className="whitespace-pre-wrap">{viewingPlanet.data.lore || 'Sin lore disponible.'}</p>
                    </div>
                    <Separator className="bg-[#fbbf24]/50" />
                    <div className="space-y-2">
                        <h4 className="text-sm uppercase tracking-widest" style={{color: '#fbbf24'}}>Informes Post-Misión</h4>
                        <p className="whitespace-pre-wrap">{viewingPlanet.data.postMissionReports || 'No hay informes de misión.'}</p>
                    </div>
                </DialogBody>
                <DialogFooter className="sm:justify-between">
                    <Button onClick={closeAllDialogs} variant="outline">Cerrar</Button>
                    <Button onClick={handleStartEditing} style={{backgroundColor: '#172e63'}}><Edit className="mr-2 h-4 w-4"/>Editar Planeta</Button>
                </DialogFooter>
                </>
             )}
             {editingPlanet && (
                <>
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2 text-2xl' style={{color: '#fbbf24'}}>
                    <BookOpen />
                    Editando {editingPlanet.name}
                  </DialogTitle>
                   <DialogDescription>
                    Actualiza los detalles del planeta. Los cambios se guardarán permanentemente.
                  </DialogDescription>
                </DialogHeader>
                <DialogBody className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">Nombre</label>
                    <Input id="name" value={editingPlanet.name} className="col-span-3" disabled />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="faction" className="text-right">Bando</label>
                      <Select
                          value={editingPlanet.faction}
                          onValueChange={(value) => setEditingPlanet({ ...editingPlanet, faction: value as FactionKey })}
                      >
                          <SelectTrigger className="col-span-3">
                              <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                              {Object.entries(factions).map(([key, { label }]) => (
                                  <SelectItem key={key} value={key}>{label}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="nativePopulation" className="text-right">Población Nativa</label>
                    <Input
                      id="nativePopulation"
                      value={editingPlanet.nativePopulation ?? ''}
                      onChange={(e) => setEditingPlanet({ ...editingPlanet, nativePopulation: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <label htmlFor="lore" className="text-right pt-2">Lore</label>
                    <Textarea
                      id="lore"
                      value={editingPlanet.lore ?? ''}
                      onChange={(e) => setEditingPlanet({ ...editingPlanet, lore: e.target.value })}
                      className="col-span-3 min-h-[100px]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <label htmlFor="postMissionReports" className="text-right pt-2">Informes Post-Misión</label>
                    <Textarea
                      id="postMissionReports"
                      value={editingPlanet.postMissionReports ?? ''}
                      onChange={(e) => setEditingPlanet({ ...editingPlanet, postMissionReports: e.target.value })}
                      className="col-span-3 min-h-[100px]"
                    />
                  </div>
                </DialogBody>
                <DialogFooter>
                  <Button onClick={() => setEditingPlanet(null)} variant="outline">Cancelar</Button>
                  <Button onClick={handleSavePlanetDetails} style={{backgroundColor: '#172e63'}}><Save className="mr-2 h-4 w-4"/>Guardar Cambios</Button>
                </DialogFooter>
                </>
             )}
        </DialogContent>
    </Dialog>
    </>
  );
}
