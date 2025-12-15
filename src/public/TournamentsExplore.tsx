import { useState, useEffect, useMemo } from "react";
import { TournamentCardAlt } from "../components/TournamentCard/TournamentCardAlt";
import { Button } from "../components/ui/Button";
import { Checkbox } from "../components/ui/Checkbox";
import { Label } from "../components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { Slider } from "../components/ui/Slider";
import { Input } from "../components/ui/Input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/Sheet";
import { Filter, Loader2, SlidersHorizontal, X } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { getAllTournaments } from "../services/api.service";
import { useApi } from "../hooks/useApi";
import type { TournamentDetails } from "../models";

export function TournamentsExplore() {
    const [tournaments, setTournaments] = useState<TournamentDetails[]>([]);
    const [selectedDisciplinas, setSelectedDisciplinas] = useState<string[]>([]);
    const [selectedUbicacion, setSelectedUbicacion] = useState<string>("all");
    
    // Estados para el filtro real (lo que se usa para filtrar)
    const [filterMinPrice, setFilterMinPrice] = useState<number>(0);
    const [filterMaxPrice, setFilterMaxPrice] = useState<number>(0);
    
    // Estados para los inputs (lo que el usuario ve mientras escribe)
    const [minPriceInput, setMinPriceInput] = useState<string>("0");
    const [maxPriceInput, setMaxPriceInput] = useState<string>("0");
    
    const [sortBy, setSortBy] = useState<string>("fecha-desc");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const { data: response, loading } = useApi(getAllTournaments, { autoFetch: true });

    useEffect(() => {
        if (!response) return;
        setTournaments(response);
        const max = Math.max(...response.map(t => t.registrationCost), 0);
        setFilterMinPrice(0);
        setFilterMaxPrice(max);
        setMinPriceInput("0");
        setMaxPriceInput(max.toString());
    }, [response]);


    const toggleDisciplina = (disciplina: string) => {
        setSelectedDisciplinas(prev =>
            prev.includes(disciplina)
                ? prev.filter(d => d !== disciplina)
                : [...prev, disciplina]
        );
    };

    const clearFilters = () => {
        setSelectedDisciplinas([]);
        setSelectedUbicacion("all");
        const max = Math.max(...tournaments.map(t => t.registrationCost), 0);
        setFilterMinPrice(0);
        setFilterMaxPrice(max);
        setMinPriceInput("0");
        setMaxPriceInput(max.toString());
    };

    // Funciones para aplicar los valores de los inputs al filtro
    const applyMinPrice = () => {
        const value = parseInt(minPriceInput);
        if (isNaN(value) || value < 0) {
            setMinPriceInput(filterMinPrice.toString());
            return;
        }
        const validMin = Math.min(value, filterMaxPrice);
        setFilterMinPrice(validMin);
        setMinPriceInput(validMin.toString());
    };

    const applyMaxPrice = () => {
        const maxAllowed = Math.max(...tournaments.map(t => t.registrationCost), 0);
        const value = parseInt(maxPriceInput);
        if (isNaN(value) || value < 0) {
            setMaxPriceInput(filterMaxPrice.toString());
            return;
        }
        const validMax = Math.max(Math.min(value, maxAllowed), filterMinPrice);
        setFilterMaxPrice(validMax);
        setMaxPriceInput(validMax.toString());
    };

    // Obtener disciplinas únicas de los torneos
    const disciplinas = Array.from(new Set(tournaments.map(t => t.discipline.name).filter(Boolean))) as string[];

    // Ubicaciones hardcodeadas (puedes ajustar según tus necesidades)
    const ubicaciones = [
        { value: "all", label: "Todas las ubicaciones" },
        { value: "montevideo", label: "Montevideo" },
        { value: "canelones", label: "Canelones" },
        { value: "maldonado", label: "Maldonado" },
        { value: "rocha", label: "Rocha" },
    ];

    const getFilteredTournaments = () => {
        let filtered = [...tournaments];

        // Filter by disciplinas
        if (selectedDisciplinas.length > 0) {
            filtered = filtered.filter(t =>
                selectedDisciplinas.some(d => t.discipline.name?.toLowerCase().includes(d.toLowerCase()))
            );
        }

        // Filter by ubicacion - por ahora no filtra ya que no hay campo en la API
        // Puedes agregar esta funcionalidad cuando el backend lo soporte

        // Filter by price
        filtered = filtered.filter(t => {
            const price = t.registrationCost;
            return price >= filterMinPrice && price <= filterMaxPrice;
        });

        // Sort
        switch (sortBy) {
            case "fecha-asc":
                filtered.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
                break;
            case "fecha-desc":
                filtered.sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
                break;
            case "precio-asc":
                filtered.sort((a, b) => a.registrationCost - b.registrationCost);
                break;
            case "precio-desc":
                filtered.sort((a, b) => b.registrationCost - a.registrationCost);
                break;
        }

        return filtered;
    };

    const filteredTournaments = getFilteredTournaments();
    const activeFiltersCount = selectedDisciplinas.length + (selectedUbicacion !== "all" ? 1 : 0);

    const FiltersSidebar = useMemo(() => (
        <div className="space-y-6">
            {/* Disciplinas */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-white">Disciplina</h3>
                    {selectedDisciplinas.length > 0 && (
                        <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-600/50">
                            {selectedDisciplinas.length}
                        </Badge>
                    )}
                </div>
                <div className="space-y-3">
                    {disciplinas.map((disciplina) => (
                        <div key={disciplina} className="flex items-center space-x-3 group">
                            <Checkbox
                                id={`disciplina-${disciplina}`}
                                checked={selectedDisciplinas.includes(disciplina)}
                                onCheckedChange={() => toggleDisciplina(disciplina)}
                                className="border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                            />
                            <Label
                                htmlFor={`disciplina-${disciplina}`}
                                className="text-gray-300 cursor-pointer hover:text-white transition-colors flex-1"
                            >
                                {disciplina}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
                <h3 className="text-white">Ubicación</h3>
                <Select value={selectedUbicacion} onValueChange={setSelectedUbicacion}>
                    <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white hover:border-purple-600/50 transition-colors">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a2a2a] border-gray-700">
                        {ubicaciones.map((ubi) => (
                            <SelectItem
                                key={ubi.value}
                                value={ubi.value}
                                className="text-white focus:bg-purple-600/20 focus:text-white"
                            >
                                {ubi.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Precio */}
            <div className="space-y-4">
                <h3 className="text-white">Rango de Precio</h3>
                <div className="space-y-4 px-1">
                    <Slider
                        value={[filterMinPrice, filterMaxPrice]}
                        max={Math.max(...tournaments.map(t => t.registrationCost), 0)}
                        step={100}
                        onValueChange={(value) => {
                            setFilterMinPrice(value[0]);
                            setFilterMaxPrice(value[1]);
                            setMinPriceInput(value[0].toString());
                            setMaxPriceInput(value[1].toString());
                        }}
                        className="[&_[role=slider]]:bg-purple-600 [&_[role=slider]]:border-purple-600 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                    />

                    <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                            <p className="text-gray-500 text-xs mb-1.5">Mínimo</p>
                            <Input
                                type="text"
                                inputMode="numeric"
                                value={minPriceInput}
                                onChange={(e) => {
                                    // Solo permitir números
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    setMinPriceInput(value);
                                }}
                                onBlur={applyMinPrice}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        applyMinPrice();
                                        e.currentTarget.blur();
                                    }
                                }}
                                className="bg-[#1a1a1a] border-gray-700 text-white"
                                placeholder="0"
                            />
                        </div>
                        <div className="text-gray-600 mt-5">-</div>
                        <div className="flex-1">
                            <p className="text-gray-500 text-xs mb-1.5">Máximo</p>
                            <Input
                                type="text"
                                inputMode="numeric"
                                value={maxPriceInput}
                                onChange={(e) => {
                                    // Solo permitir números
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    setMaxPriceInput(value);
                                }}
                                onBlur={applyMaxPrice}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        applyMaxPrice();
                                        e.currentTarget.blur();
                                    }
                                }}
                                className="bg-[#1a1a1a] border-gray-700 text-white"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-2">
                <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-purple-600/50 transition-colors"
                >
                    <X className="w-4 h-4 mr-2" />
                    Limpiar Filtros
                </Button>
            </div>
        </div>
    ), [disciplinas, selectedDisciplinas, selectedUbicacion, ubicaciones, tournaments, filterMinPrice, filterMaxPrice, minPriceInput, maxPriceInput, applyMinPrice, applyMaxPrice, clearFilters]);

    return (
        <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-white text-4xl mb-2">Explorar Torneos</h1>
                    <p className="text-gray-400">
                        Descubre y únete a torneos de todas las disciplinas
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        {/* Mobile Filter Button */}
                        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="lg:hidden border-purple-600 text-purple-300 hover:bg-purple-600/10">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filtros
                                    {activeFiltersCount > 0 && (
                                        <Badge className="ml-2 bg-purple-600">{activeFiltersCount}</Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-[#1a1a1a] border-gray-800 w-80 overflow-y-auto">
                                <SheetHeader className="pb-4">
                                    <SheetTitle className="text-white flex items-center gap-2">
                                        <SlidersHorizontal className="w-5 h-5" />
                                        Filtros
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="pr-2">
                                    {FiltersSidebar}
                                </div>
                            </SheetContent>
                        </Sheet>

                        <div className="text-gray-400">
                            <span className="text-white">{filteredTournaments.length}</span> torneos encontrados
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Ordenar por:</span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[200px] bg-[#2a2a2a] border-gray-700 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2a2a2a] border-gray-700">
                                <SelectItem value="fecha-desc" className="text-white focus:bg-purple-600/20 focus:text-white">
                                    Fecha: Más reciente
                                </SelectItem>
                                <SelectItem value="fecha-asc" className="text-white focus:bg-purple-600/20 focus:text-white">
                                    Fecha: Más antiguo
                                </SelectItem>
                                <SelectItem value="precio-asc" className="text-white focus:bg-purple-600/20 focus:text-white">
                                    Precio: Menor a mayor
                                </SelectItem>
                                <SelectItem value="precio-desc" className="text-white focus:bg-purple-600/20 focus:text-white">
                                    Precio: Mayor a menor
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-8">
                    {/* Desktop Filters Sidebar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-24 bg-[#2a2a2a] border border-gray-800 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <SlidersHorizontal className="w-5 h-5 text-purple-400" />
                                <h2 className="text-white text-lg">Filtros</h2>
                            </div>
                            {FiltersSidebar}
                        </div>
                    </aside>

                    {/* Tournaments Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                                </div>
                                <h3 className="text-white text-xl mb-2">Cargando torneos...</h3>
                            </div>
                        ) : filteredTournaments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredTournaments.map((tournament) => (
                                    <TournamentCardAlt key={tournament.id} tournament={tournament} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}