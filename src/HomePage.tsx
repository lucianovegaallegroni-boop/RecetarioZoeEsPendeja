import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getIngredients, createRecipe, getRecipes } from './lib/api';
import type { Ingredient, Recipe } from './lib/database.types';

const UNIT_OPTIONS = ['kg', 'g', 'L', 'ml', 'un'];

interface RecipeIngredient {
    ingredientId: string;
    quantity: string;
    unit: string;
}

export default function HomePage() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
    const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);

    // Fetch recipes state
    const [itemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination for recipes
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedRecipes = recipes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(recipes.length / itemsPerPage);

    // Initial fetch
    useEffect(() => {
        fetchRecipes();
        fetchIngredients();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchRecipes = async () => {
        try {
            const data = await getRecipes();
            setRecipes(data);
        } catch (err) {
            console.error('Error fetching recipes:', err);
        }
    };

    const fetchIngredients = async () => {
        try {
            setIsLoadingIngredients(true);
            const data = await getIngredients();
            setAvailableIngredients(data);
        } catch (err) {
            console.error('Error fetching ingredients:', err);
        } finally {
            setIsLoadingIngredients(false);
        }
    };

    // Helper functions re-added since they were seemingly removed in previous chunk replacement
    const handleAddIngredient = () => {
        if (newIngredient.ingredientId && newIngredient.quantity) {
            setSelectedIngredients([...selectedIngredients, { ...newIngredient }]);
            setNewIngredient({ ingredientId: '', quantity: '', unit: 'kg' });
        }
    };

    const handleRemoveIngredient = (index: number) => {
        setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
    };

    const handleAddStep = () => {
        if (newStep.trim()) {
            setSteps([...steps, newStep.trim()]);
            setNewStep('');
        }
    };

    const handleRemoveStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index));
        if (editingStepIndex === index) {
            setEditingStepIndex(null);
        }
    };

    const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
    const [editingStepValue, setEditingStepValue] = useState('');

    const handleStartEditStep = (index: number) => {
        setEditingStepIndex(index);
        setEditingStepValue(steps[index]);
    };

    const handleSaveEditStep = () => {
        if (editingStepIndex !== null && editingStepValue.trim()) {
            const newSteps = [...steps];
            newSteps[editingStepIndex] = editingStepValue.trim();
            setSteps(newSteps);
            setEditingStepIndex(null);
            setEditingStepValue('');
        }
    };

    const handleCancelEditStep = () => {
        setEditingStepIndex(null);
        setEditingStepValue('');
    };

    // Recipe form state
    const [recipeName, setRecipeName] = useState('');
    const [recipeDescription, setRecipeDescription] = useState('');
    const [recipeImage, setRecipeImage] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState<RecipeIngredient[]>([]);
    const [steps, setSteps] = useState<string[]>([]);
    const [newStep, setNewStep] = useState('');
    const [newIngredient, setNewIngredient] = useState<RecipeIngredient>({
        ingredientId: '',
        quantity: '',
        unit: 'kg'
    });





    const handleSaveRecipe = async () => {
        try {
            if (!recipeName) return;

            const recipeData = {
                name: recipeName,
                description: recipeDescription,
                image: recipeImage,
            };

            const recipeIngredients = selectedIngredients.map(ing => ({
                ingredient_id: ing.ingredientId,
                quantity: parseFloat(ing.quantity), // Convert string to number
                unit: ing.unit
            }));

            await createRecipe(recipeData, recipeIngredients, steps);

            // Close modal and reset form
            closeModal();

            // Optionally refresh the recipes list if we display them
            await fetchRecipes();
            alert('¡Receta guardada con éxito!');
        } catch (error) {
            console.error('Error saving recipe:', error);
            alert('Hubo un error al guardar la receta. Por favor intenta de nuevo.');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setRecipeName('');
        setRecipeDescription('');
        setRecipeImage('');
        setSelectedIngredients([]);
        setSteps([]);
        setNewStep('');
        setNewIngredient({ ingredientId: '', quantity: '', unit: 'kg' });
        setEditingStepIndex(null);
        setEditingStepValue('');
    };

    const getIngredientName = (id: string) => {
        return availableIngredients.find(i => i.id === id)?.name || '';
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="w-full px-8 py-6 flex justify-between items-center border-b border-terracotta/10 bg-cream/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-terracotta text-3xl">menu_book</span>
                    <h1 className="text-2xl font-black tracking-tight text-stone">Zoe es <span className="text-terracotta italic">Pendeja</span></h1>
                </div>
                <nav className="hidden md:flex items-center gap-12 font-sans text-sm uppercase tracking-[0.2em] font-medium text-stone/70">
                    <Link to="/" className="text-terracotta border-b border-terracotta">Recetas</Link>
                    <a className="hover:text-terracotta transition-colors" href="#">Precios</a>
                    <Link to="/materiaprima" className="hover:text-terracotta transition-colors">Materia Prima</Link>
                </nav>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-stone text-cream rounded-full hover:bg-stone/90 transition-all text-sm font-semibold tracking-wide"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        NUEVA RECETA
                    </button>
                    <div className="size-10 rounded-full border-2 border-terracotta/20 p-0.5">
                        <div
                            className="w-full h-full rounded-full bg-cover bg-center"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDQLsz3M05NHMurGr2XdE5ytIyWJTGQb0UCDYt6ZrH8hjHTs_auB2Z1UXcs1XM4gCbP321jGNN2he-o-Bj3POhpp-57tS1HrIJTmZZLE17eYVInXDVexgBt_FgXpw1G0SBWimYaLpCO_5c5AyFe5ktWdhV6WkmlA98eybJHGLz_UzzyBaNcnXIb-g9SyGjmroPg3MwrilIAIhuuzbtpnzy-5rnULhDI3XP50L8gtW-JjRLQTqDjrGZXEBL_cqmA1bvhsj5SMAGOMME")' }}
                        ></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1400px] mx-auto px-4 md:px-12 py-12">
                {/* Hero Section */}
                <section className="mb-16">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b-2 border-stone pb-8">
                        <div className="max-w-3xl">
                            <span className="handwritten text-terracotta text-2xl mb-4 block">Inventario de Esencias Nobles</span>
                            <h2 className="text-6xl md:text-8xl font-black italic text-stone tracking-tight leading-none">El Almacén de Esencias</h2>
                            <p className="mt-6 text-xl text-stone/60 font-serif italic max-w-xl">Donde descansan los aromas del mundo y se custodian los secretos de nuestra repostería más preciada.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white p-6 rounded-2xl border border-blush shadow-sm text-center min-w-[160px]">
                                <p className="text-[10px] uppercase tracking-widest text-stone/40 mb-1 font-bold">Valor Total Almacén</p>
                                <p className="text-3xl font-serif text-terracotta">€4,280.40</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Table Section */}
                <section className="relative">
                    <div className="absolute -top-12 -right-4 hidden xl:block">
                        <div className="bg-white p-8 rounded-2xl shadow-xl -rotate-2 max-w-[220px] border border-blush">
                            <p className="handwritten text-sage text-lg mb-2">Nota del Bodeguero</p>
                            <p className="text-sm italic text-stone/70">"Asegurar que la Vainilla de Madagascar siempre mantenga su humedad óptima en el estante de arriba."</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-1 lg:p-4 border border-blush shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full border-separate border-spacing-0">
                                <thead>
                                    <tr className="text-left">
                                        <th className="px-6 py-8 border-b-2 border-stone/10 bg-cream/30">
                                            <span className="text-xs uppercase tracking-[0.3em] font-bold text-stone/40">Receta</span>
                                        </th>
                                        <th className="px-6 py-8 border-b-2 border-stone/10 bg-cream/30">
                                            <span className="text-xs uppercase tracking-[0.3em] font-bold text-stone/40">Descripción</span>
                                        </th>
                                        <th className="px-6 py-8 border-b-2 border-stone/10 bg-cream/30">
                                            <span className="text-xs uppercase tracking-[0.3em] font-bold text-stone/40">Fecha de Creación</span>
                                        </th>
                                        <th className="px-6 py-8 border-b-2 border-stone/10 bg-cream/30"></th>
                                    </tr>
                                </thead>
                                <tbody className="font-sans text-stone">
                                    {paginatedRecipes.map((recipe) => (
                                        <tr
                                            key={recipe.id}
                                            className="ledger-row group cursor-pointer hover:bg-cream/50 transition-colors"
                                            onClick={() => navigate(`/receta/${recipe.id}`)}
                                        >
                                            <td className="px-6 py-8 border-b border-stone/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-16 bg-blush rounded-xl flex items-center justify-center text-terracotta group-hover:scale-110 transition-transform overflow-hidden shadow-sm">
                                                        {recipe.image ? (
                                                            <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="material-symbols-outlined text-3xl">restaurant_menu</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-serif font-bold text-xl italic leading-none mb-1">{recipe.name}</p>
                                                        <p className="text-[10px] text-stone/40 uppercase tracking-widest font-bold">Ref: {recipe.id.slice(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-8 border-b border-stone/5">
                                                <p className="font-serif italic text-stone/70 text-sm line-clamp-2 max-w-xs">
                                                    {recipe.description || 'Sin descripción'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-8 border-b border-stone/5">
                                                <p className="text-sm font-medium text-stone/60">
                                                    {new Date(recipe.created_at || Date.now()).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </td>
                                            <td className="px-6 py-8 border-b border-stone/5 text-right">
                                                <button className="text-stone/20 hover:text-terracotta transition-colors p-2">
                                                    <span className="material-symbols-outlined">edit_square</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {paginatedRecipes.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-stone/40 italic">
                                                No hay recetas disponibles. ¡Crea la primera!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-8 border-t border-blush bg-cream/20 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-xs uppercase tracking-widest font-bold text-stone/50 hover:text-stone transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined text-sm">arrow_back</span> Anterior
                                </button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`size-8 flex items-center justify-center rounded-full transition-colors font-serif italic text-sm cursor-pointer ${currentPage === page ? 'bg-stone text-white' : 'hover:bg-blush'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-xs uppercase tracking-widest font-bold text-stone hover:text-terracotta transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Siguiente <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-stone/40">
                                    Mostrando {recipes.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, recipes.length)} de {recipes.length} recetas
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Cards */}
                <section className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="p-8 bg-stone text-cream rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <span className="material-symbols-outlined text-[12rem]">bar_chart</span>
                        </div>
                        <h4 className="text-2xl font-serif italic mb-6">Métricas de Almacén</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-cream/10 pb-2">
                                <span className="text-xs uppercase tracking-widest text-cream/60">Rotación Media</span>
                                <span className="font-serif italic text-xl">14 días</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-cream/10 pb-2">
                                <span className="text-xs uppercase tracking-widest text-cream/60">Capital Inmovilizado</span>
                                <span className="font-serif italic text-xl">€1,240.00</span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-xs uppercase tracking-widest text-cream/60">Pedidos Pendientes</span>
                                <span className="font-serif italic text-xl">3</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-terracotta text-white rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <span className="material-symbols-outlined text-[12rem]">notifications_active</span>
                        </div>
                        <h4 className="text-2xl font-serif italic mb-6">Alertas de Reposición</h4>
                        <div className="space-y-4">
                            <p className="text-sm font-light leading-relaxed">Se requieren órdenes de compra urgentes para <span className="font-bold underline italic">Mantequilla AOP</span> y <span className="font-bold underline italic">Chocolate Guanaja 70%</span>.</p>
                            <button className="mt-4 px-6 py-2 bg-white text-terracotta rounded-full text-xs font-bold tracking-widest uppercase hover:bg-cream transition-colors">GENERAR ÓRDENES</button>
                        </div>
                    </div>

                    <div className="p-8 bg-white border border-blush rounded-[2.5rem] flex flex-col justify-center text-center">
                        <span className="material-symbols-outlined text-4xl text-terracotta mb-4">history_edu</span>
                        <p className="handwritten text-xl text-stone mb-4">Exportar Libro de Cuentas</p>
                        <p className="text-xs text-stone/50 italic mb-6 px-4">Genera un documento PDF estilo pergamino con el estado actual de todas tus esencias para contabilidad.</p>
                        <button className="w-full py-3 bg-cream border border-stone/10 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-sepia transition-colors">DESCARGAR LIBRO</button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-stone text-cream py-20 mt-20">
                <div className="max-w-[1400px] mx-auto px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
                        <div>
                            <h2 className="text-3xl font-serif italic mb-6">La Boutique <span className="text-terracotta">Sucrée</span></h2>
                            <p className="text-white/50 text-sm leading-relaxed max-w-xs italic">La gestión del gusto a través de la precisión. Cada gramo cuenta una historia, cada céntimo construye un sueño.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold tracking-[0.2em] uppercase text-xs text-terracotta">Administración</h4>
                            <a className="text-cream/70 hover:text-white transition-colors" href="#">Libro Mayor</a>
                            <a className="text-cream/70 hover:text-white transition-colors" href="#">Proveedores Nobles</a>
                            <a className="text-cream/70 hover:text-white transition-colors" href="#">Histórico de Precios</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold tracking-[0.2em] uppercase text-xs text-terracotta">Soporte</h4>
                            <a className="text-cream/70 hover:text-white transition-colors" href="#">Ayuda de Bitácora</a>
                            <a className="text-cream/70 hover:text-white transition-colors" href="#">Configuración de Moneda</a>
                            <a className="text-cream/70 hover:text-white transition-colors" href="#">Términos del Atelier</a>
                        </div>
                    </div>
                    <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between gap-6 items-center">
                        <span className="text-white/30 text-xs tracking-widest uppercase">© 2024 La Boutique Sucrée — Sistema de Gestión Artisanal</span>
                        <div className="flex gap-8 text-white/30 text-xs tracking-widest uppercase">
                            <a className="hover:text-terracotta" href="#">Confidencialidad</a>
                            <a className="hover:text-terracotta" href="#">Conserjería</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* New Recipe Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-stone/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-[#FCF9F3] w-full max-w-2xl rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-stone/10 bg-white">
                            <h3 className="font-serif text-2xl font-bold italic text-stone">Nueva Receta Artesanal</h3>
                            <p className="text-sm text-stone/50 mt-1">Crea una nueva obra maestra culinaria.</p>
                            <button onClick={closeModal} className="absolute top-6 right-6 text-stone/40 hover:text-terracotta transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto space-y-6">
                            {/* Recipe Name */}
                            <div>
                                <label className="block text-xs font-bold tracking-widest uppercase text-stone/40 mb-2">Nombre de la Receta</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-stone/20 rounded-xl px-4 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif"
                                    placeholder="Ej. Tarta de Queso Vasca"
                                    value={recipeName}
                                    onChange={(e) => setRecipeName(e.target.value)}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold tracking-widest uppercase text-stone/40 mb-2">Descripción</label>
                                <textarea
                                    className="w-full bg-white border border-stone/20 rounded-xl px-4 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif resize-none h-20"
                                    placeholder="Una breve descripción de la receta..."
                                    value={recipeDescription}
                                    onChange={(e) => setRecipeDescription(e.target.value)}
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-xs font-bold tracking-widest uppercase text-stone/40 mb-2">URL de la Imagen (Opcional)</label>
                                <input
                                    type="url"
                                    className="w-full bg-white border border-stone/20 rounded-xl px-4 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif"
                                    placeholder="https://ejemplo.com/foto.jpg"
                                    value={recipeImage}
                                    onChange={(e) => setRecipeImage(e.target.value)}
                                />
                            </div>

                            {/* Ingredients Section */}
                            <div className="bg-sage/10 p-6 rounded-2xl border border-dashed border-sage/30">
                                <h4 className="font-serif font-bold italic text-sage mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined">inventory_2</span>
                                    Ingredientes
                                </h4>

                                {/* Selected Ingredients List */}
                                {selectedIngredients.length > 0 && (
                                    <div className="space-y-2 mb-4">
                                        {selectedIngredients.map((ing, index) => (
                                            <div key={index} className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-sage/20">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-bold text-stone">{index + 1}.</span>
                                                    <span className="font-serif text-stone">{getIngredientName(ing.ingredientId)}</span>
                                                    <span className="text-stone/60">{ing.quantity} {ing.unit}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveIngredient(index)}
                                                    className="text-terracotta/60 hover:text-terracotta transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add Ingredient Form */}
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold tracking-widest uppercase text-stone/40 mb-1">Materia Prima</label>
                                        <select
                                            className="w-full bg-white border border-stone/20 rounded-xl px-4 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif"
                                            value={newIngredient.ingredientId}
                                            onChange={(e) => setNewIngredient({ ...newIngredient, ingredientId: e.target.value })}
                                            disabled={isLoadingIngredients}
                                        >
                                            <option value="">{isLoadingIngredients ? 'Cargando...' : 'Seleccionar...'}</option>
                                            {availableIngredients.map(ing => (
                                                <option key={ing.id} value={ing.id}>{ing.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-[10px] font-bold tracking-widest uppercase text-stone/40 mb-1">Cantidad</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full bg-white border border-stone/20 rounded-xl px-4 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif"
                                            placeholder="0"
                                            value={newIngredient.quantity}
                                            onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                                        />
                                    </div>
                                    <div className="w-20">
                                        <label className="block text-[10px] font-bold tracking-widest uppercase text-stone/40 mb-1">Unidad</label>
                                        <select
                                            className="w-full bg-white border border-stone/20 rounded-xl px-2 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif text-sm"
                                            value={newIngredient.unit}
                                            onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                                        >
                                            {UNIT_OPTIONS.map(unit => (
                                                <option key={unit} value={unit}>{unit}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleAddIngredient}
                                        className="p-3 bg-sage text-white rounded-xl hover:bg-sage/90 transition-colors"
                                        title="Agregar ingrediente"
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                            </div>

                            {/* Steps Section */}
                            <div className="bg-terracotta/5 p-6 rounded-2xl border border-dashed border-terracotta/20">
                                <h4 className="font-serif font-bold italic text-terracotta mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined">format_list_numbered</span>
                                    Pasos de Preparación
                                </h4>

                                {/* Steps List */}
                                {steps.length > 0 && (
                                    <div className="space-y-2 mb-4">
                                        {steps.map((step, index) => (
                                            <div key={index} className="flex items-start gap-3 bg-white px-4 py-3 rounded-xl border border-terracotta/10">
                                                <span className="flex-shrink-0 size-7 bg-terracotta text-white rounded-full flex items-center justify-center font-serif text-sm font-bold">
                                                    {index + 1}
                                                </span>
                                                {editingStepIndex === index ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            className="flex-1 bg-cream border border-terracotta/30 rounded-lg px-3 py-1 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif text-sm"
                                                            value={editingStepValue}
                                                            onChange={(e) => setEditingStepValue(e.target.value)}
                                                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEditStep()}
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={handleSaveEditStep}
                                                            className="flex-shrink-0 text-sage hover:text-sage/80 transition-colors"
                                                            title="Guardar"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">check</span>
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEditStep}
                                                            className="flex-shrink-0 text-terracotta/60 hover:text-terracotta transition-colors"
                                                            title="Cancelar"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">close</span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="flex-1 font-serif text-stone text-sm pt-0.5">{step}</p>
                                                        <button
                                                            onClick={() => handleStartEditStep(index)}
                                                            className="flex-shrink-0 text-stone/40 hover:text-terracotta transition-colors"
                                                            title="Editar paso"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveStep(index)}
                                                            className="flex-shrink-0 text-terracotta/60 hover:text-terracotta transition-colors"
                                                            title="Eliminar paso"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">close</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add Step Form */}
                                <div className="flex gap-2">
                                    <div className="flex-shrink-0 size-7 bg-terracotta/20 text-terracotta rounded-full flex items-center justify-center font-serif text-sm font-bold">
                                        {steps.length + 1}
                                    </div>
                                    <input
                                        type="text"
                                        className="flex-1 bg-white border border-stone/20 rounded-xl px-4 py-2 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif text-sm"
                                        placeholder="Escribe el siguiente paso..."
                                        value={newStep}
                                        onChange={(e) => setNewStep(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddStep()}
                                    />
                                    <button
                                        onClick={handleAddStep}
                                        className="p-2 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-colors"
                                        title="Agregar paso"
                                    >
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-stone/10 bg-white">
                            <button
                                onClick={handleSaveRecipe}
                                disabled={!recipeName || selectedIngredients.length === 0 || steps.length === 0}
                                className="w-full bg-stone text-white py-4 rounded-xl font-bold tracking-[0.2em] uppercase hover:bg-stone/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Guardar Receta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
