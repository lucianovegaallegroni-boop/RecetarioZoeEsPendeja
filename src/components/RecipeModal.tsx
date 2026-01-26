import { useState, useEffect } from 'react';
import { getIngredients } from '../lib/api';
import type { RecipeWithDetails } from '../lib/api';
import type { Ingredient } from '../lib/database.types';

const UNIT_OPTIONS = ['kg', 'g', 'L', 'ml', 'un'];

interface RecipeIngredientState {
    ingredientId: string;
    quantity: string;
    unit: string;
}

interface RecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: {
        name: string;
        description: string;
        image: string;
        ingredients: RecipeIngredientState[];
        steps: string[];
    }) => Promise<void>;
    initialData?: RecipeWithDetails | null;
}

export default function RecipeModal({ isOpen, onClose, onSave, initialData }: RecipeModalProps) {
    const [recipeName, setRecipeName] = useState('');
    const [recipeDescription, setRecipeDescription] = useState('');
    const [recipeImage, setRecipeImage] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState<RecipeIngredientState[]>([]);
    const [steps, setSteps] = useState<string[]>([]);

    // UI State
    const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
    const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form Input State
    const [newStep, setNewStep] = useState('');
    const [newIngredient, setNewIngredient] = useState<RecipeIngredientState>({
        ingredientId: '',
        quantity: '',
        unit: 'kg'
    });
    const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
    const [editingStepValue, setEditingStepValue] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchIngredients();
            if (initialData) {
                // Populate form with initial data for editing
                setRecipeName(initialData.name);
                setRecipeDescription(initialData.description || '');
                setRecipeImage(initialData.image || '');

                // Map existing ingredients
                if (initialData.recipe_ingredients) {
                    setSelectedIngredients(initialData.recipe_ingredients.map(ri => ({
                        ingredientId: ri.ingredient_id,
                        quantity: ri.quantity.toString(),
                        unit: ri.unit
                    })));
                }

                // Map existing steps
                if (initialData.recipe_steps) {
                    // Sort just in case, though API does it
                    const sortedSteps = [...initialData.recipe_steps].sort((a, b) => a.step_number - b.step_number);
                    setSteps(sortedSteps.map(s => s.instruction));
                }
            } else {
                // Reset form for new recipe
                setRecipeName('');
                setRecipeDescription('');
                setRecipeImage('');
                setSelectedIngredients([]);
                setSteps([]);
            }
        }
    }, [isOpen, initialData]);

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

    const getIngredientName = (id: string) => {
        return availableIngredients.find(i => i.id === id)?.name || '';
    };

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

    const handleSubmit = async () => {
        if (!recipeName) return;

        setIsSaving(true);
        try {
            await onSave({
                name: recipeName,
                description: recipeDescription,
                image: recipeImage,
                ingredients: selectedIngredients,
                steps: steps
            });
            onClose();
        } catch (error) {
            console.error(error);
            alert('Error al guardar la receta');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-stone/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-[#FCF9F3] w-full max-w-2xl text-stone rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="p-6 md:p-8 border-b border-stone/10 bg-white flex justify-between items-start">
                    <div>
                        <h3 className="font-serif text-xl md:text-2xl font-bold italic text-stone">
                            {initialData ? 'Editar Receta' : 'Nueva Receta Artesanal'}
                        </h3>
                        <p className="text-sm text-stone/50 mt-1">
                            {initialData ? 'Modifica los detalles de tu creación.' : 'Crea una nueva obra maestra culinaria.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-stone/40 hover:text-terracotta transition-colors p-2">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8 overflow-y-auto space-y-6">
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
                    <div className="bg-sage/10 p-4 md:p-6 rounded-2xl border border-dashed border-sage/30">
                        <h4 className="font-serif font-bold italic text-sage mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">inventory_2</span>
                            Ingredientes
                        </h4>

                        {/* Selected Ingredients List */}
                        {selectedIngredients.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {selectedIngredients.map((ing, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-sage/20">
                                        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                                            <span className="text-sm font-bold text-stone flex-shrink-0">{index + 1}.</span>
                                            <span className="font-serif text-stone truncate text-sm md:text-base">{getIngredientName(ing.ingredientId)}</span>
                                            <span className="text-stone/60 text-sm whitespace-nowrap">{ing.quantity} {ing.unit}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveIngredient(index)}
                                            className="text-terracotta/60 hover:text-terracotta transition-colors ml-2"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Ingredient Form */}
                        <div className="flex flex-col md:flex-row gap-2">
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold tracking-widest uppercase text-stone/40 mb-1">Materia Prima</label>
                                <select
                                    className="w-full bg-white border border-stone/20 rounded-xl px-4 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif text-sm"
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
                            <div className="flex gap-2">
                                <div className="w-20 md:w-24">
                                    <label className="block text-[10px] font-bold tracking-widest uppercase text-stone/40 mb-1">Cant.</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full bg-white border border-stone/20 rounded-xl px-3 py-3 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif text-sm"
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
                                    className="mt-auto aspect-square h-[46px] bg-sage text-white rounded-xl hover:bg-sage/90 transition-colors flex items-center justify-center"
                                    title="Agregar ingrediente"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Steps Section */}
                    <div className="bg-terracotta/5 p-4 md:p-6 rounded-2xl border border-dashed border-terracotta/20">
                        <h4 className="font-serif font-bold italic text-terracotta mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">format_list_numbered</span>
                            Pasos de Preparación
                        </h4>

                        {/* Steps List */}
                        {steps.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex items-start gap-3 bg-white px-4 py-3 rounded-xl border border-terracotta/10">
                                        <span className="flex-shrink-0 size-7 bg-terracotta text-white rounded-full flex items-center justify-center font-serif text-sm font-bold mt-0.5">
                                            {index + 1}
                                        </span>
                                        {editingStepIndex === index ? (
                                            <div className="flex-1 flex gap-2 flex-col md:flex-row">
                                                <input
                                                    type="text"
                                                    className="flex-1 bg-cream border border-terracotta/30 rounded-lg px-3 py-1 text-stone focus:outline-none focus:border-terracotta transition-colors font-serif text-sm"
                                                    value={editingStepValue}
                                                    onChange={(e) => setEditingStepValue(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEditStep()}
                                                    autoFocus
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleSaveEditStep}
                                                        className="flex-shrink-0 text-sage hover:text-sage/80 transition-colors p-1"
                                                        title="Guardar"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">check</span>
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEditStep}
                                                        className="flex-shrink-0 text-terracotta/60 hover:text-terracotta transition-colors p-1"
                                                        title="Cancelar"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">close</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="flex-1 font-serif text-stone text-sm pt-1 leading-relaxed">{step}</p>
                                                <div className="flex gap-1 flex-col md:flex-row">
                                                    <button
                                                        onClick={() => handleStartEditStep(index)}
                                                        className="flex-shrink-0 text-stone/40 hover:text-terracotta transition-colors p-1"
                                                        title="Editar paso"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveStep(index)}
                                                        className="flex-shrink-0 text-terracotta/60 hover:text-terracotta transition-colors p-1"
                                                        title="Eliminar paso"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">close</span>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Step Form */}
                        <div className="flex gap-2">
                            <div className="flex-shrink-0 size-7 bg-terracotta/20 text-terracotta rounded-full flex items-center justify-center font-serif text-sm font-bold mt-2">
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
                                className="p-3 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-colors flex items-center justify-center"
                                title="Agregar paso"
                            >
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-stone/10 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button
                        onClick={handleSubmit}
                        disabled={!recipeName || selectedIngredients.length === 0 || steps.length === 0 || isSaving}
                        className="w-full bg-stone text-white py-4 rounded-xl font-bold tracking-[0.2em] uppercase hover:bg-stone/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {isSaving && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                        {isSaving ? 'Guardando...' : 'Guardar Receta'}
                    </button>
                </div>
            </div>
        </div>
    );
}
