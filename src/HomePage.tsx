import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createRecipe, getRecipes } from './lib/api';
import type { Recipe } from './lib/database.types';
import RecipeModal from './components/RecipeModal';

export default function HomePage() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recipes, setRecipes] = useState<Recipe[]>([]);

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
    }, []);

    const fetchRecipes = async () => {
        try {
            const data = await getRecipes();
            setRecipes(data);
        } catch (err) {
            console.error('Error fetching recipes:', err);
        }
    };

    const handleCreateRecipe = async (data: {
        name: string;
        description: string;
        image: string;
        ingredients: { ingredientId: string; quantity: string; unit: string }[];
        steps: string[];
    }) => {
        const recipeData = {
            name: data.name,
            description: data.description,
            image: data.image,
        };

        const recipeIngredients = data.ingredients.map(ing => ({
            ingredient_id: ing.ingredientId,
            quantity: parseFloat(ing.quantity),
            unit: ing.unit
        }));

        await createRecipe(recipeData, recipeIngredients, data.steps);
        await fetchRecipes();
        alert('¡Receta guardada con éxito!');
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
            <RecipeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleCreateRecipe}
            />
        </div>
    )
}
