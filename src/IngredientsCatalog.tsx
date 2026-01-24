import { useState } from 'react';

interface Ingredient {
    id: string;
    name: string;
    category: 'Lácteos' | 'Harinas' | 'Especias' | 'Chocolates' | 'Frutas';
    vendor: string;
    price: number;
    unit: string;
    image: string;
    lastUpdated: string;
    trend: 'up' | 'down' | 'stable';
}

const INITIAL_INGREDIENTS: Ingredient[] = [
    {
        id: '1',
        name: 'Mantequilla de Soria',
        category: 'Lácteos',
        vendor: 'Lácteos Castilla',
        price: 12.50, // per kg
        unit: 'kg',
        image: 'https://cdn-icons-png.flaticon.com/512/2313/2313495.png', // Placeholder stylized icon
        lastUpdated: 'Hoy, 09:45 AM',
        trend: 'up'
    },
    {
        id: '2',
        name: 'Harina Orgánica T65',
        category: 'Harinas',
        vendor: 'Molinos del Sur',
        price: 1.20,
        unit: 'kg',
        image: 'https://cdn-icons-png.flaticon.com/512/3014/3014521.png',
        lastUpdated: 'Ayer',
        trend: 'down'
    },
    {
        id: '3',
        name: 'Vainilla Bourbon',
        category: 'Especias',
        vendor: 'Especias Mundi',
        price: 45.00,
        unit: 'kg', // Maybe usually priced per pod or gram, but keeping kg for consistency in demo
        image: 'https://cdn-icons-png.flaticon.com/512/7395/7395166.png',
        lastUpdated: 'Hace 2 días',
        trend: 'stable'
    },
    {
        id: '4',
        name: 'Cacao 70% Origen',
        category: 'Chocolates',
        vendor: 'Cacao Real',
        price: 18.90,
        unit: 'kg',
        image: 'https://cdn-icons-png.flaticon.com/512/2234/2234796.png',
        lastUpdated: 'Hoy, 10:00 AM',
        trend: 'up'
    },
];

interface IngredientsCatalogProps {
    onBack: () => void;
    onNavigate: (view: any) => void; // Using any for now to be flexible with ViewState
}

export default function IngredientsCatalog({ onBack, onNavigate }: IngredientsCatalogProps) {
    const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('Todos');

    // Form State
    const [newIng, setNewIng] = useState({
        name: '',
        category: 'Harinas',
        vendor: '',
        image: '',
        totalPrice: '',
        totalQuantity: '',
        quantityUnit: 'kg'
    });

    const categories = ['Todos', 'Harinas', 'Lácteos', 'Especias', 'Chocolates'];

    const handleAddIngredient = (e: React.FormEvent) => {
        e.preventDefault();
        const price = parseFloat(newIng.totalPrice);
        const qty = parseFloat(newIng.totalQuantity);

        if (isNaN(price) || isNaN(qty) || qty === 0) return;

        const pricePerUnit = price / qty;

        const newIngredient: Ingredient = {
            id: Date.now().toString(),
            name: newIng.name,
            category: newIng.category as any,
            vendor: newIng.vendor,
            price: pricePerUnit,
            unit: newIng.quantityUnit,
            image: newIng.image || 'https://cdn-icons-png.flaticon.com/512/5029/5029236.png', // Generic fallback or user image
            lastUpdated: 'Ahora mismo',
            trend: 'stable'
        };

        setIngredients([...ingredients, newIngredient]);
        setIsModalOpen(false);
        setNewIng({ name: '', category: 'Harinas', vendor: '', image: '', totalPrice: '', totalQuantity: '', quantityUnit: 'kg' });
    };

    const filteredIngredients = filter === 'Todos'
        ? ingredients
        : ingredients.filter(i => i.category === filter);

    return (
        <div className="min-h-screen selection:bg-terracotta/20 bg-[#FCF9F3]">
            {/* Header - Consistent with others */}
            <header className="w-full px-8 py-6 flex justify-between items-center border-b border-terracotta/10 bg-cream/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
                    <span className="material-symbols-outlined text-terracotta text-3xl">restaurant_menu</span>
                    <h1 className="text-2xl font-black tracking-tight text-stone">Zoe es <span className="text-terracotta italic">Pendeja</span></h1>
                </div>
                <nav className="hidden md:flex items-center gap-12 font-sans text-sm uppercase tracking-[0.2em] font-medium text-stone/70">
                    <a className="hover:text-terracotta transition-colors" href="#" onClick={() => onNavigate('home')}>Inicio</a>
                    <a className="hover:text-terracotta transition-colors" href="#" onClick={() => onNavigate('home')}>Recetas</a>
                    <a className="hover:text-terracotta transition-colors" href="#">Precios</a>
                    <a className="text-terracotta border-b border-terracotta" href="#">Materia Prima</a>
                </nav>
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all shadow-lg shadow-terracotta/20 text-sm font-semibold tracking-wide">
                        <span className="material-symbols-outlined">download</span>
                        EXPORTAR
                    </button>
                    <div className="size-10 rounded-full border-2 border-terracotta/20 p-0.5">
                        <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDQLsz3M05NHMurGr2XdE5ytIyWJTGQb0UCDYt6ZrH8hjHTs_auB2Z1UXcs1XM4gCbP321jGNN2he-o-Bj3POhpp-57tS1HrIJTmZZLE17eYVInXDVexgBt_FgXpw1G0SBWimYaLpCO_5c5AyFe5ktWdhV6WkmlA98eybJHGLz_UzzyBaNcnXIb-g9SyGjmroPg3MwrilIAIhuuzbtpnzy-5rnULhDI3XP50L8gtW-JjRLQTqDjrGZXEBL_cqmA1bvhsj5SMAGOMME")' }}></div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 md:px-12 py-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-terracotta mb-2 block">Despensa de Autor</span>
                        <h2 className="text-5xl font-black italic text-stone mb-4 font-serif">Catálogo de Materias Primas</h2>
                        <p className="text-stone/60 font-serif italic text-lg">Un registro artesanal de nuestros ingredientes esenciales y sus fluctuaciones de mercado.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-sage text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-sage/90 transition-all flex items-center gap-2 shadow-xl shadow-sage/20"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        Nuevo Ingrediente
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-12 border-b border-stone/10 pb-8">
                    <span className="text-xs font-bold tracking-widest uppercase text-stone/40 self-center mr-4">Filtrar por:</span>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${filter === cat
                                ? 'bg-stone text-white'
                                : 'bg-cream text-stone/60 hover:bg-stone/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredIngredients.map(ing => (
                        <div key={ing.id} className="bg-white rounded-3xl p-6 border border-terracotta/10 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className="absolute top-4 right-4 text-[10px] font-bold tracking-widest uppercase bg-cream px-3 py-1 rounded-full text-stone/60 border border-stone/5">
                                {ing.category}
                            </div>
                            <div className="aspect-square mb-6 bg-cream rounded-2xl flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-500">
                                <img src={ing.image} alt={ing.name} className="w-full h-full object-contain drop-shadow-md" />
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
                                            ${ing.price.toFixed(2)} <span className="text-sm text-stone/40 italic">/ {ing.unit}</span>
                                        </p>
                                    </div>
                                    <div className={`text-xs font-bold flex flex-col items-end ${ing.trend === 'up' ? 'text-terracotta' : ing.trend === 'down' ? 'text-sage' : 'text-stone/40'}`}>
                                        <span className="material-symbols-outlined text-sm">
                                            {ing.trend === 'up' ? 'trending_up' : ing.trend === 'down' ? 'trending_down' : 'remove'}
                                        </span>
                                        {ing.trend === 'up' ? '+4.2%' : ing.trend === 'down' ? '-2.1%' : 'Estable'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State / Add Card */}
                    <button
                        onClick={() => setIsModalOpen(true)}
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
            </main>

            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-stone/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-FCF9F3 w-full max-w-lg bg-[#FCF9F3] rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-stone/10 bg-white">
                            <h3 className="font-serif text-2xl font-bold italic text-stone">Nuevo Ingrediente Noble</h3>
                            <p className="text-sm text-stone/50 mt-1">Registre la llegada de una nueva materia prima.</p>
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-stone/40 hover:text-terracotta transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleAddIngredient} className="p-8 overflow-y-auto space-y-6">
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
                                        <input
                                            type="text"
                                            className="w-full bg-white border border-stone/20 rounded-xl px-4 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif"
                                            placeholder="Ej. Molinos Sur"
                                            value={newIng.vendor}
                                            onChange={e => setNewIng({ ...newIng, vendor: e.target.value })}
                                        />
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
                                            <label className="block text-[10px] font-bold tracking-widest uppercase text-stone/40 mb-2">Precio Total (€)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                className="w-full bg-white border border-stone/20 rounded-xl px-4 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif"
                                                placeholder="0.00"
                                                value={newIng.totalPrice}
                                                onChange={e => setNewIng({ ...newIng, totalPrice: e.target.value })}
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
                                                    value={newIng.totalQuantity}
                                                    onChange={e => setNewIng({ ...newIng, totalQuantity: e.target.value })}
                                                />
                                            </div>
                                            <div className="w-20">
                                                <label className="block text-[10px] font-bold tracking-widest uppercase text-stone/40 mb-2">Unidad</label>
                                                <select
                                                    className="w-full bg-white border border-stone/20 rounded-xl px-2 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif text-sm"
                                                    value={newIng.quantityUnit}
                                                    onChange={e => setNewIng({ ...newIng, quantityUnit: e.target.value })}
                                                >
                                                    <option value="kg">kg</option>
                                                    <option value="g">g</option>
                                                    <option value="L">L</option>
                                                    <option value="ml">ml</option>
                                                    <option value="un">un</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {newIng.totalPrice && newIng.totalQuantity && (
                                        <div className="flex justify-between items-center pt-2 border-t border-terracotta/10">
                                            <span className="text-xs uppercase font-bold text-terracotta">Costo Calculado:</span>
                                            <span className="font-serif font-black text-xl text-stone">
                                                €{(parseFloat(newIng.totalPrice) / parseFloat(newIng.totalQuantity)).toFixed(2)} / {newIng.quantityUnit}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-stone text-white py-4 rounded-xl font-bold tracking-[0.2em] uppercase hover:bg-stone/90 transition-colors shadow-lg"
                            >
                                Guardar en Despensa
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
