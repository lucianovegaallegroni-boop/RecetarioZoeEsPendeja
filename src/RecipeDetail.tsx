import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getRecipeById, updateRecipe, type RecipeWithDetails } from './lib/api';
import { convertValue } from './lib/conversions';
import RecipeModal from './components/RecipeModal';

export default function RecipeDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [recipe, setRecipe] = useState<RecipeWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchRecipe(id);
        }
    }, [id]);

    const fetchRecipe = async (recipeId: string) => {
        try {
            setLoading(true);
            const data = await getRecipeById(recipeId);
            setRecipe(data);
        } catch (error) {
            console.error('Error fetching recipe:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRecipe = async (data: {
        name: string;
        description: string;
        image: string;
        ingredients: { ingredientId: string; quantity: string; unit: string }[];
        steps: string[];
    }) => {
        if (!recipe) return;

        try {
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

            await updateRecipe(recipe.id, recipeData, recipeIngredients, data.steps);
            await fetchRecipe(recipe.id);
            alert('¡Receta actualizada con éxito!');
        } catch (error) {
            console.error('Error updating recipe:', error);
            alert('Hubo un error al actualizar la receta. Por favor intenta de nuevo.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FCF9F3]">
                <div className="text-center">
                    <span className="material-symbols-outlined text-4xl text-terracotta animate-spin">progress_activity</span>
                    <p className="mt-4 font-serif text-stone/50 italic">Recuperando receta...</p>
                </div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FCF9F3]">
                <div className="text-center">
                    <p className="font-serif text-2xl text-stone italic">Receta no encontrada</p>
                    <button onClick={() => navigate('/')} className="mt-4 text-terracotta underline hover:text-stone transition-colors">Volver al inicio</button>
                </div>
            </div>
        );
    }

    // Calculate economics
    // Calculate economics
    const totalCost = recipe.recipe_ingredients.reduce((sum, item) => {
        // We need to convert the quantity used in recipe (item.unit) 
        // to the unit used for pricing (item.ingredients.unit)
        const qtyInPriceUnit = convertValue(item.quantity, item.unit, item.ingredients.unit);
        return sum + (qtyInPriceUnit * item.ingredients.price);
    }, 0);

    const costPerServing = totalCost / 12; // Assuming 12 servings default for now, can be dynamic later or field added
    const recommendedPrice = costPerServing * 3.5; // 3.5x markup logic (approx 71% margin) or just * 3
    const margin = recommendedPrice > 0 ? ((recommendedPrice - costPerServing) / recommendedPrice) * 100 : 0;

    return (
        <div className="min-h-screen selection:bg-terracotta/20">
            <header className="w-full px-8 py-6 flex justify-between items-center border-b border-terracotta/10 bg-cream/80 backdrop-blur-md sticky top-0 z-50">
                <Link to="/" className="flex items-center gap-2 cursor-pointer">
                    <span className="material-symbols-outlined text-terracotta text-3xl">restaurant_menu</span>
                    <h1 className="text-2xl font-black tracking-tight text-stone">Zoe es <span className="text-terracotta italic">Pendeja</span></h1>
                </Link>
                <nav className="hidden md:flex items-center gap-12 font-sans text-sm uppercase tracking-[0.2em] font-medium text-stone/70">
                    <Link to="/" className="text-terracotta border-b border-terracotta">Recetas</Link>
                    <a className="hover:text-terracotta transition-colors" href="#">Precios</a>
                    <Link to="/materiaprima" className="hover:text-terracotta transition-colors">Materia Prima</Link>
                </nav>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-stone/10 text-stone rounded-full hover:bg-stone/20 transition-all text-sm font-semibold tracking-wide"
                    >
                        <span className="material-symbols-outlined text-lg">edit</span>
                        EDITAR
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all shadow-lg shadow-terracotta/20 text-sm font-semibold tracking-wide">
                        <span className="material-symbols-outlined text-lg">print</span>
                        IMPRIMIR
                    </button>
                    <div className="size-10 rounded-full border-2 border-terracotta/20 p-0.5">
                        <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDQLsz3M05NHMurGr2XdE5ytIyWJTGQb0UCDYt6ZrH8hjHTs_auB2Z1UXcs1XM4gCbP321jGNN2he-o-Bj3POhpp-57tS1HrIJTmZZLE17eYVInXDVexgBt_FgXpw1G0SBWimYaLpCO_5c5AyFe5ktWdhV6WkmlA98eybJHGLz_UzzyBaNcnXIb-g9SyGjmroPg3MwrilIAIhuuzbtpnzy-5rnULhDI3XP50L8gtW-JjRLQTqDjrGZXEBL_cqmA1bvhsj5SMAGOMME")' }}></div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 md:px-12 py-12">
                <section className="relative w-full mb-20">
                    {/* Back Button for better UX */}
                    <button onClick={() => navigate('/')} className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white text-stone transition-all">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>

                    <div className="aspect-[21/9] w-full overflow-hidden rounded-[2rem] shadow-2xl relative group">
                        {recipe.image ? (
                            <img alt={recipe.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src={recipe.image} />
                        ) : (
                            <div className="w-full h-full bg-stone flex items-center justify-center">
                                <span className="material-symbols-outlined text-9xl text-white/20">restaurant_menu</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-6 text-white">
                            <div className="max-w-2xl">
                                <span className="inline-block px-4 py-1 bg-terracotta/90 text-xs font-bold tracking-[0.3em] uppercase mb-4 rounded-sm">Receta Artesanal</span>
                                <h2 className="text-5xl md:text-7xl font-black italic leading-none mb-4">{recipe.name}</h2>
                                <p className="font-sans text-lg text-white/90 italic max-w-lg">{recipe.description}</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-right">
                                    <p className="text-xs uppercase tracking-widest text-white/60 mb-1">Costo Total</p>
                                    <p className="text-2xl font-bold">€{totalCost.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                    <div className="lg:col-span-4 space-y-12">
                        <div>
                            <h3 className="text-3xl font-bold mb-6 italic border-b border-terracotta/20 pb-4">Economía del Sabor</h3>
                            <div className="space-y-8">
                                <div className="flex items-center justify-between group">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-stone/50 font-bold">Costo del Atelier</p>
                                        <p className="text-4xl font-serif text-stone group-hover:text-terracotta transition-colors">€{totalCost.toFixed(2)}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-4xl text-terracotta/20">payments</span>
                                </div>
                                <div className="flex items-center justify-between group">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-stone/50 font-bold">Costo por Porción (WebApp)</p>
                                        <p className="text-4xl font-serif text-stone group-hover:text-terracotta transition-colors">€{costPerServing.toFixed(2)}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-4xl text-terracotta/20">bakery_dining</span>
                                </div>
                                <div className="flex items-center justify-between group">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-stone/50 font-bold">Venta Sugerida</p>
                                        <p className="text-4xl font-serif text-terracotta">€{recommendedPrice.toFixed(2)}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-4xl text-terracotta/20">star</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-sage/10 p-8 rounded-3xl border border-sage/20 relative overflow-hidden">
                            <div className="absolute top-4 right-4 text-sage opacity-20 transform rotate-12">
                                <span className="material-symbols-outlined text-7xl">trending_up</span>
                            </div>
                            <h4 className="text-lg font-bold text-sage mb-2 uppercase tracking-widest">Margen Estimado</h4>
                            <p className="text-3xl font-serif text-stone mb-4">{margin.toFixed(1)}%</p>
                            <p className="text-sm leading-relaxed text-stone/70">Calculado sobre ingredientes directos. Este margen sugiere una salud financiera robusta para esta creación.</p>
                        </div>
                    </div>
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-blush relative">
                            <div className="absolute -top-6 left-10 px-6 py-2 bg-cream border border-terracotta/30 rounded-full flex items-center gap-2">
                                <span className="material-symbols-outlined text-terracotta">inventory_2</span>
                                <span className="text-xs font-bold tracking-widest uppercase">Bitácora de Ingredientes</span>
                            </div>
                            <div className="mt-4 space-y-6">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs uppercase tracking-[0.2em] text-stone/40 border-b border-terracotta/10">
                                            <th className="pb-4 font-bold w-1/2 md:w-auto">Ingrediente Noble</th>
                                            <th className="pb-4 font-bold w-1/4 md:w-auto">Cantidad</th>
                                            <th className="pb-4 font-bold text-right hidden md:table-cell">Costo Unitario</th>
                                            <th className="pb-4 font-bold text-right hidden md:table-cell">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-sans text-stone divide-y divide-terracotta/5">
                                        {recipe.recipe_ingredients.map((item) => (
                                            <tr key={item.id} className="group hover:bg-cream/50 transition-colors">
                                                <td className="py-6 flex items-center gap-4">
                                                    <span className="material-symbols-outlined text-terracotta/40">grain</span>
                                                    <span className="font-medium text-lg text-stone">{item.ingredients.name}</span>
                                                </td>
                                                <td className="py-6 italic text-stone/60">{item.quantity} {item.unit}</td>
                                                <td className="py-6 text-right text-stone/60 hidden md:table-cell">€{item.ingredients.price.toFixed(2)}</td>
                                                <td className="py-6 text-right font-serif font-bold text-lg hidden md:table-cell">
                                                    €{(convertValue(item.quantity, item.unit, item.ingredients.unit) * item.ingredients.price).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td className="pt-8 text-right font-sans text-xs uppercase tracking-[0.3em] font-bold text-stone/40 hidden md:table-cell" colSpan={3}>Total Materia Prima</td>
                                            <td className="pt-8 text-right font-serif text-3xl font-black text-terracotta hidden md:table-cell">€{totalCost.toFixed(2)}</td>

                                            {/* Mobile Total */}
                                            <td className="pt-8 text-right font-sans text-xs uppercase tracking-[0.3em] font-bold text-stone/40 md:hidden pb-2" colSpan={2}>Total</td>
                                            <td className="pt-8 text-right font-serif text-3xl font-black text-terracotta md:hidden pb-2" colSpan={2}>€{totalCost.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-24">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <span className="handwritten text-terracotta text-3xl mb-4">Método Secreto</span>
                        <h3 className="text-5xl font-serif italic text-stone">La Alquimia</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {recipe.recipe_steps.length > 0 ? (
                            recipe.recipe_steps.map((step) => (
                                <div key={step.id} className="flex flex-col gap-6 relative p-8 bg-white rounded-3xl border border-blush shadow-sm hover:shadow-xl transition-all group">
                                    <span className="absolute -top-4 -left-4 size-12 bg-terracotta text-white rounded-full flex items-center justify-center font-serif text-2xl italic group-hover:scale-110 transition-transform">
                                        {step.step_number}
                                    </span>
                                    <div className="size-16 bg-blush rounded-2xl flex items-center justify-center text-terracotta mb-2">
                                        <span className="material-symbols-outlined text-4xl">cooking</span>
                                    </div>
                                    <h4 className="text-xl font-serif font-bold italic">Paso {step.step_number}</h4>
                                    <p className="text-stone/70 leading-relaxed italic">{step.instruction}</p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-stone/50 italic">No hay pasos registrados para esta receta.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <footer className="bg-stone text-cream py-20">
                <div className="max-w-[1400px] mx-auto px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
                        <div>
                            <h2 className="text-3xl font-serif italic mb-6">La Boutique <span className="text-terracotta">Sucrée</span></h2>
                            <p className="text-white/50 text-sm leading-relaxed max-w-xs italic">Gestión del gusto a través de la precisión.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold tracking-[0.2em] uppercase text-xs text-terracotta">Archivo</h4>
                            <a className="text-cream/70 hover:text-white transition-colors" href="#">Tartas & Pasteles</a>
                            <a className="text-cream/70 hover:text-white transition-colors" href="#">Viennoiserie</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold tracking-[0.2em] uppercase text-xs text-terracotta">Registro</h4>
                            <a className="text-cream/70 hover:text-white transition-colors" href="#">Inteligencia de Ingredientes</a>
                        </div>
                    </div>
                    <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between gap-6 items-center">
                        <span className="text-white/30 text-xs tracking-widest uppercase">© 2024 La Boutique Sucrée</span>
                    </div>
                </div>
            </footer>
            {/* Edit Modal */}
            <RecipeModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleUpdateRecipe}
                initialData={recipe}
            />
        </div>
    )
}
