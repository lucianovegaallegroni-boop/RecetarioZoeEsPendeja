import { useState, useEffect } from 'react';
// Link removed as it is unused
import { getIngredients, createIngredient, updateIngredient, deleteIngredient } from './lib/api';
import type { Ingredient } from './lib/database.types';
import { UNITS, calculateStandardCost, getUnitType } from './lib/conversions';
import Header from './components/Header';

export default function IngredientsCatalog() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('Todos');
    const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

    // Delete confirmation modal state
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [deleteConfirmName, setDeleteConfirmName] = useState('');

    // Form State
    const [newIng, setNewIng] = useState({
        name: '',
        category: 'Harinas',
        vendor: '',
        image: '',
        purchasePrice: '',
        purchaseQuantity: '',
        purchaseUnit: 'kg'
    });

    // Fetch ingredients on mount
    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getIngredients();
            setIngredients(data);
        } catch (err) {
            setError('Error al cargar los ingredientes');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const openEditModal = (ing: Ingredient) => {
        setEditingIngredient(ing);
        setNewIng({
            name: ing.name,
            category: ing.category,
            vendor: ing.vendor,
            image: ing.image || '',
            purchasePrice: (ing.purchase_price || ing.price).toString(),
            purchaseQuantity: (ing.purchase_quantity || 1).toString(),
            purchaseUnit: ing.purchase_unit || ing.unit
        });
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingIngredient(null);
        setNewIng({ name: '', category: 'Harinas', vendor: '', image: '', purchasePrice: '', purchaseQuantity: '', purchaseUnit: 'kg' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingIngredient(null);
        setNewIng({ name: '', category: 'Harinas', vendor: '', image: '', purchasePrice: '', purchaseQuantity: '', purchaseUnit: 'kg' });
    };

    const categories = ['Todos', 'Harinas', 'Lácteos', 'Especias', 'Chocolates', 'Frutas'];

    const handleSaveIngredient = async (e: React.FormEvent) => {
        e.preventDefault();
        const pPrice = parseFloat(newIng.purchasePrice);
        const pQty = parseFloat(newIng.purchaseQuantity);

        if (isNaN(pPrice) || isNaN(pQty) || pQty === 0) return;

        const standardizedCost = calculateStandardCost(pPrice, pQty, newIng.purchaseUnit);
        let baseUnit = 'kg';
        const type = getUnitType(newIng.purchaseUnit);
        if (type === 'volume') baseUnit = 'L';
        if (type === 'count') baseUnit = 'un';

        try {
            const ingredientData = {
                name: newIng.name,
                category: newIng.category,
                vendor: newIng.vendor,
                price: standardizedCost, // Store Standard Cost
                unit: baseUnit,          // Standard Unit
                purchase_price: pPrice,
                purchase_quantity: pQty,
                purchase_unit: newIng.purchaseUnit,
                image: newIng.image || undefined
            };

            if (editingIngredient) {
                // Update existing ingredient
                await updateIngredient(editingIngredient.id, ingredientData);
            } else {
                // Create new ingredient
                await createIngredient({
                    ...ingredientData,
                    image: newIng.image || 'https://cdn-icons-png.flaticon.com/512/5029/5029236.png'
                });
            }

            // Refresh the list
            await fetchIngredients();
            closeModal();
        } catch (err) {
            console.error('Error saving ingredient:', err);
            setError('Error al guardar el ingrediente');
        }
    };

    const openDeleteConfirm = (ing: Ingredient) => {
        setDeleteConfirmId(ing.id);
        setDeleteConfirmName(ing.name);
    };

    const closeDeleteConfirm = () => {
        setDeleteConfirmId(null);
        setDeleteConfirmName('');
    };

    const confirmDelete = async () => {
        if (!deleteConfirmId) return;

        try {
            await deleteIngredient(deleteConfirmId);
            await fetchIngredients();
            closeDeleteConfirm();
        } catch (err) {
            console.error('Error deleting ingredient:', err);
            setError('Error al eliminar el ingrediente');
            closeDeleteConfirm();
        }
    };

    const [vendorFilter, setVendorFilter] = useState('Todos');

    // Get unique vendors
    const vendors = ['Todos', ...Array.from(new Set(ingredients.map(i => i.vendor).filter(Boolean)))];

    const filteredIngredients = ingredients.filter(ing => {
        const matchCategory = filter === 'Todos' || ing.category === filter;
        const matchVendor = vendorFilter === 'Todos' || ing.vendor === vendorFilter;
        return matchCategory && matchVendor;
    });

    return (
        <div className="min-h-screen selection:bg-terracotta/20 bg-[#FCF9F3]">
            {/* Header - Consistent with others */}
            <Header
                actions={
                    <>
                        <button
                            onClick={openCreateModal}
                            className="bg-sage text-white px-4 py-2 rounded-full font-bold uppercase tracking-widest hover:bg-sage/90 transition-all flex items-center gap-2 shadow-xl shadow-sage/20 text-xs md:text-sm"
                        >
                            <span className="material-symbols-outlined text-base">add_circle</span>
                            <span className="hidden md:inline">Nuevo Ingrediente</span>
                            <span className="md:hidden">Nuevo</span>
                        </button>
                        <div className="size-8 md:size-10 rounded-full border-2 border-terracotta/20 p-0.5 hidden md:block">
                            <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDQLsz3M05NHMurGr2XdE5ytIyWJTGQb0UCDYt6ZrH8hjHTs_auB2Z1UXcs1XM4gCbP321jGNN2he-o-Bj3POhpp-57tS1HrIJTmZZLE17eYVInXDVexgBt_FgXpw1G0SBWimYaLpCO_5c5AyFe5ktWdhV6WkmlA98eybJHGLz_UzzyBaNcnXIb-g9SyGjmroPg3MwrilIAIhuuzbtpnzy-5rnULhDI3XP50L8gtW-JjRLQTqDjrGZXEBL_cqmA1bvhsj5SMAGOMME")' }}></div>
                        </div>
                    </>
                }
            />

            <main className="max-w-[1400px] mx-auto px-4 md:px-12 py-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-terracotta mb-2 block">Despensa de Autor</span>
                        <h2 className="text-5xl font-black italic text-stone mb-4 font-serif">Catálogo de Materias Primas</h2>
                        <p className="text-stone/60 font-serif italic text-lg">Un registro artesanal de nuestros ingredientes esenciales y sus fluctuaciones de mercado.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 mb-12 border-b border-stone/10 pb-8 items-start md:items-center">
                    <span className="text-xs font-bold tracking-widest uppercase text-stone/40 self-center mr-4 hidden md:block">Filtrar por:</span>

                    <div className="w-full md:w-auto flex flex-col gap-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-stone/40 ml-2 md:hidden">Categoría</label>
                        <div className="relative">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full md:w-48 appearance-none bg-white border border-stone/20 rounded-full pl-12 pr-6 py-3 text-xs font-bold tracking-widest uppercase text-stone focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all cursor-pointer hover:border-stone/40"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone/40 pointer-events-none text-lg">category</span>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-stone/40 pointer-events-none text-lg md:hidden">expand_more</span>
                        </div>
                    </div>

                    <div className="w-full md:w-auto flex flex-col gap-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-stone/40 ml-2 md:hidden">Proveedor</label>
                        <div className="relative">
                            <select
                                value={vendorFilter}
                                onChange={(e) => setVendorFilter(e.target.value)}
                                className="w-full md:w-48 appearance-none bg-white border border-stone/20 rounded-full pl-12 pr-6 py-3 text-xs font-bold tracking-widest uppercase text-stone focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all cursor-pointer hover:border-stone/40"
                            >
                                {vendors.map(vendor => (
                                    <option key={vendor} value={vendor}>{vendor}</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone/40 pointer-events-none text-lg">store</span>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-stone/40 pointer-events-none text-lg md:hidden">expand_more</span>
                        </div>
                    </div>

                    {/* Active Filters Reset */}
                    {(filter !== 'Todos' || vendorFilter !== 'Todos') && (
                        <button
                            onClick={() => { setFilter('Todos'); setVendorFilter('Todos'); }}
                            className="bg-stone text-white rounded-full p-2 hover:bg-terracotta transition-colors self-end md:self-center"
                            title="Limpiar filtros"
                        >
                            <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                        </button>
                    )}
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-8 p-4 bg-terracotta/10 border border-terracotta/20 rounded-xl text-terracotta text-center">
                        {error}
                        <button onClick={fetchIngredients} className="ml-4 underline">Reintentar</button>
                    </div>
                )}

                {/* Loading state */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-terracotta border-t-transparent"></div>
                    </div>
                ) : (
                    /* Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredIngredients.map(ing => (
                            <div key={ing.id} className="bg-white rounded-3xl p-6 border border-terracotta/10 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                {/* Category badge */}
                                <div className="absolute top-4 right-4 z-10 text-[10px] font-bold tracking-widest uppercase bg-cream px-3 py-1 rounded-full text-stone/60 border border-stone/5">
                                    {ing.category}
                                </div>
                                {/* Delete button */}
                                <button
                                    onClick={() => openDeleteConfirm(ing)}
                                    className="absolute top-4 left-4 z-10 p-1.5 bg-white/80 rounded-full hover:bg-terracotta/10 transition-colors"
                                    title="Eliminar ingrediente"
                                >
                                    <span className="material-symbols-outlined text-sm text-terracotta/60 hover:text-terracotta">delete</span>
                                </button>
                                <div className="aspect-square mb-6 bg-cream rounded-2xl flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-500">
                                    <img src={ing.image || 'https://cdn-icons-png.flaticon.com/512/5029/5029236.png'} alt={ing.name} className="w-full h-full object-contain drop-shadow-md" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-xl text-stone mb-1">{ing.name}</h3>
                                    <div className="flex items-center gap-2 text-stone/50 text-xs mb-4">
                                        <span className="material-symbols-outlined text-sm">local_shipping</span>
                                        <span>{ing.vendor}</span>
                                    </div>
                                    <div className="flex items-end justify-between border-t border-stone/5 pt-4">
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest uppercase text-stone/40 mb-1">Costo Actual</p>
                                            <p className="text-2xl font-serif text-stone">
                                                €{Number(ing.price).toFixed(2)} <span className="text-sm text-stone/40 italic">/ {ing.unit}</span>
                                            </p>
                                            {ing.purchase_price && (
                                                <p className="text-[10px] text-stone/40">
                                                    (Comp: €{ing.purchase_price} x {ing.purchase_quantity} {ing.purchase_unit})
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => openEditModal(ing)}
                                            className="p-2 bg-cream rounded-full hover:bg-terracotta/10 transition-colors flex items-center justify-center"
                                            title="Editar ingrediente"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Empty State / Add Card */}
                        <button
                            onClick={openCreateModal}
                            className="bg-transparent rounded-3xl p-6 border-2 border-dashed border-stone/10 hover:border-sage/40 hover:bg-sage/5 transition-all flex flex-col items-center justify-center gap-4 group min-h-[400px]"
                        >
                            <div className="size-16 rounded-full bg-stone/5 flex items-center justify-center group-hover:bg-sage group-hover:text-white transition-colors text-stone/40">
                                <span className="material-symbols-outlined text-3xl">add</span>
                            </div>
                            <div className="text-center">
                                <p className="font-serif text-xl text-stone/60 italic mb-1">Añadir Ingrediente</p>
                                <p className="text-xs text-stone/40">Amplía su recetario artesanal</p>
                            </div>
                        </button>
                    </div>
                )}
            </main>

            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-stone/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-FCF9F3 w-full max-w-lg bg-[#FCF9F3] rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-stone/10 bg-white">
                            <h3 className="font-serif text-2xl font-bold italic text-stone">
                                {editingIngredient ? 'Editar Ingrediente' : 'Nuevo Ingrediente Noble'}
                            </h3>
                            <p className="text-sm text-stone/50 mt-1">
                                {editingIngredient ? 'Modifica los datos de esta materia prima.' : 'Registre la llegada de una nueva materia prima.'}
                            </p>
                            <button onClick={closeModal} className="absolute top-6 right-6 text-stone/40 hover:text-terracotta transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveIngredient} className="p-8 overflow-y-auto space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold tracking-widest uppercase text-stone/40 mb-2">Nombre del Producto</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white border border-stone/20 rounded-xl px-4 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif"
                                        placeholder="Ej. Harina de Centeno"
                                        value={newIng.name}
                                        onChange={e => setNewIng({ ...newIng, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold tracking-widest uppercase text-stone/40 mb-2">Categoría</label>
                                        <select
                                            className="w-full bg-white border border-stone/20 rounded-xl px-4 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif appearance-none"
                                            value={newIng.category}
                                            onChange={e => setNewIng({ ...newIng, category: e.target.value })}
                                        >
                                            {categories.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold tracking-widest uppercase text-stone/40 mb-2">Proveedor</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                list="vendor-options"
                                                className="w-full bg-white border border-stone/20 rounded-xl pl-10 pr-4 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif"
                                                placeholder="Seleccionar o escribir nuevo..."
                                                value={newIng.vendor}
                                                onChange={e => setNewIng({ ...newIng, vendor: e.target.value })}
                                            />
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone/30 text-lg">store</span>
                                            <datalist id="vendor-options">
                                                {vendors.filter(v => v !== 'Todos').map(v => (
                                                    <option key={v} value={v} />
                                                ))}
                                            </datalist>
                                        </div>
                                        <p className="text-[10px] text-stone/40 mt-1 ml-2 italic">Puedes seleccionar uno existente o escribir uno nuevo</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold tracking-widest uppercase text-stone/40 mb-2">Imagen del Producto (URL)</label>
                                    <input
                                        type="url"
                                        className="w-full bg-white border border-stone/20 rounded-xl px-4 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif"
                                        placeholder="https://ejemplo.com/imagen.png"
                                        value={newIng.image}
                                        onChange={e => setNewIng({ ...newIng, image: e.target.value })}
                                    />
                                </div>

                                <div className="bg-terracotta/5 p-6 rounded-2xl border border-dashed border-terracotta/20 space-y-4">
                                    <h4 className="font-serif font-bold italic text-terracotta mb-2">Cálculo de Costo Unitario</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold tracking-widest uppercase text-stone/40 mb-2">Precio Compra (€)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                className="w-full bg-white border border-stone/20 rounded-xl px-4 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif"
                                                placeholder="0.00"
                                                value={newIng.purchasePrice}
                                                onChange={e => setNewIng({ ...newIng, purchasePrice: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label className="block text-[10px] font-bold tracking-widest uppercase text-stone/40 mb-2">Cantidad</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    required
                                                    className="w-full bg-white border border-stone/20 rounded-xl px-4 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif"
                                                    placeholder="1"
                                                    value={newIng.purchaseQuantity}
                                                    onChange={e => setNewIng({ ...newIng, purchaseQuantity: e.target.value })}
                                                />
                                            </div>
                                            <div className="w-20">
                                                <label className="block text-[10px] font-bold tracking-widest uppercase text-stone/40 mb-2">Unidad</label>
                                                <select
                                                    className="w-full bg-white border border-stone/20 rounded-xl px-2 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif text-sm"
                                                    value={newIng.purchaseUnit}
                                                    onChange={e => setNewIng({ ...newIng, purchaseUnit: e.target.value })}
                                                >
                                                    <optgroup label="Masa">
                                                        {UNITS.MASS.map(u => <option key={u} value={u}>{u}</option>)}
                                                    </optgroup>
                                                    <optgroup label="Volumen">
                                                        {UNITS.VOLUME.map(u => <option key={u} value={u}>{u}</option>)}
                                                    </optgroup>
                                                    <optgroup label="Unidad">
                                                        {UNITS.COUNT.map(u => <option key={u} value={u}>{u}</option>)}
                                                    </optgroup>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {newIng.purchasePrice && newIng.purchaseQuantity && (
                                        <div className="flex justify-between items-center pt-2 border-t border-terracotta/10">
                                            <span className="text-xs uppercase font-bold text-terracotta">Costo Estandarizado:</span>
                                            <span className="font-serif font-black text-xl text-stone">
                                                €{calculateStandardCost(parseFloat(newIng.purchasePrice), parseFloat(newIng.purchaseQuantity), newIng.purchaseUnit).toFixed(2)}
                                                <span className="text-sm font-normal text-stone/50 ml-1">
                                                    / {getUnitType(newIng.purchaseUnit) === 'volume' ? 'L' : getUnitType(newIng.purchaseUnit) === 'count' ? 'un' : 'kg'}
                                                </span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-stone text-white py-4 rounded-xl font-bold tracking-[0.2em] uppercase hover:bg-stone/90 transition-colors shadow-lg"
                            >
                                {editingIngredient ? 'Actualizar Ingrediente' : 'Guardar en Despensa'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-stone/60 backdrop-blur-sm" onClick={closeDeleteConfirm}></div>
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden p-8 text-center">
                        <div className="size-16 mx-auto mb-6 rounded-full bg-terracotta/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-terracotta">delete_forever</span>
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-stone mb-2">¿Eliminar ingrediente?</h3>
                        <p className="text-stone/60 mb-6">
                            Estás a punto de eliminar <span className="font-bold text-terracotta">"{deleteConfirmName}"</span>.
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={closeDeleteConfirm}
                                className="flex-1 px-6 py-3 border border-stone/20 rounded-xl text-stone font-bold tracking-wide hover:bg-stone/5 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-6 py-3 bg-terracotta text-white rounded-xl font-bold tracking-wide hover:bg-terracotta/90 transition-colors"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
