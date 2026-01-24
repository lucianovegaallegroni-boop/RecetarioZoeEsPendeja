import { supabase } from './supabase';
import type {
    Ingredient,
    InsertIngredient,
    UpdateIngredient,
    Recipe,
    InsertRecipe,
    InsertRecipeIngredient,
    InsertRecipeStep,
    RecipeStep,
    RecipeIngredient
} from './database.types';

// =====================
// INGREDIENTS API
// =====================

export async function getIngredients(): Promise<Ingredient[]> {
    const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');

    if (error) throw error;
    return data || [];
}

export async function getIngredientById(id: string): Promise<Ingredient | null> {
    const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function createIngredient(ingredient: InsertIngredient): Promise<Ingredient> {
    const { data, error } = await supabase
        .from('ingredients')
        .insert(ingredient)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateIngredient(id: string, updates: UpdateIngredient): Promise<Ingredient> {
    const { data, error } = await supabase
        .from('ingredients')
        .update({ ...updates, last_updated: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteIngredient(id: string): Promise<void> {
    const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// =====================
// RECIPES API
// =====================

export interface RecipeWithDetails extends Recipe {
    recipe_ingredients: (RecipeIngredient & { ingredients: Ingredient })[];
    recipe_steps: RecipeStep[];
}

export async function getRecipes(): Promise<Recipe[]> {
    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getRecipeById(id: string): Promise<RecipeWithDetails | null> {
    const { data, error } = await supabase
        .from('recipes')
        .select(`
            *,
            recipe_ingredients (
                *,
                ingredients (*)
            ),
            recipe_steps (*)
        `)
        .eq('id', id)
        .single();

    if (error) throw error;

    // Sort steps by step_number
    if (data?.recipe_steps) {
        data.recipe_steps.sort((a: RecipeStep, b: RecipeStep) => a.step_number - b.step_number);
    }

    return data as RecipeWithDetails;
}

export async function createRecipe(
    recipe: InsertRecipe,
    ingredients: Omit<InsertRecipeIngredient, 'recipe_id'>[],
    steps: string[]
): Promise<Recipe> {
    // Insert recipe
    const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert(recipe)
        .select()
        .single();

    if (recipeError) throw recipeError;

    // Insert recipe ingredients
    if (ingredients.length > 0) {
        const recipeIngredients: InsertRecipeIngredient[] = ingredients.map(ing => ({
            ...ing,
            recipe_id: recipeData.id
        }));

        const { error: ingredientsError } = await supabase
            .from('recipe_ingredients')
            .insert(recipeIngredients);

        if (ingredientsError) throw ingredientsError;
    }

    // Insert recipe steps
    if (steps.length > 0) {
        const recipeSteps: InsertRecipeStep[] = steps.map((instruction, index) => ({
            recipe_id: recipeData.id,
            step_number: index + 1,
            instruction
        }));

        const { error: stepsError } = await supabase
            .from('recipe_steps')
            .insert(recipeSteps);

        if (stepsError) throw stepsError;
    }

    return recipeData;
}

export async function updateRecipe(
    id: string,
    recipe: Partial<InsertRecipe>,
    ingredients?: Omit<InsertRecipeIngredient, 'recipe_id'>[],
    steps?: string[]
): Promise<Recipe> {
    // Update recipe
    const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .update({ ...recipe, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (recipeError) throw recipeError;

    // Update ingredients if provided
    if (ingredients !== undefined) {
        // Delete existing ingredients
        await supabase
            .from('recipe_ingredients')
            .delete()
            .eq('recipe_id', id);

        // Insert new ingredients
        if (ingredients.length > 0) {
            const recipeIngredients: InsertRecipeIngredient[] = ingredients.map(ing => ({
                ...ing,
                recipe_id: id
            }));

            const { error: ingredientsError } = await supabase
                .from('recipe_ingredients')
                .insert(recipeIngredients);

            if (ingredientsError) throw ingredientsError;
        }
    }

    // Update steps if provided
    if (steps !== undefined) {
        // Delete existing steps
        await supabase
            .from('recipe_steps')
            .delete()
            .eq('recipe_id', id);

        // Insert new steps
        if (steps.length > 0) {
            const recipeSteps: InsertRecipeStep[] = steps.map((instruction, index) => ({
                recipe_id: id,
                step_number: index + 1,
                instruction
            }));

            const { error: stepsError } = await supabase
                .from('recipe_steps')
                .insert(recipeSteps);

            if (stepsError) throw stepsError;
        }
    }

    return recipeData;
}

export async function deleteRecipe(id: string): Promise<void> {
    const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
