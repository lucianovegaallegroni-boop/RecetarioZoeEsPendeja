export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            ingredients: {
                Row: {
                    category: string
                    created_at: string | null
                    id: string
                    image: string | null
                    last_updated: string | null
                    name: string
                    price: number
                    purchase_price: number | null
                    purchase_quantity: number | null
                    purchase_unit: string | null
                    trend: string | null
                    unit: string
                    vendor: string
                }
                Insert: {
                    category: string
                    created_at?: string | null
                    id?: string
                    image?: string | null
                    last_updated?: string | null
                    name: string
                    price: number
                    purchase_price?: number | null
                    purchase_quantity?: number | null
                    purchase_unit?: string | null
                    trend?: string | null
                    unit: string
                    vendor: string
                }
                Update: {
                    category?: string
                    created_at?: string | null
                    id?: string
                    image?: string | null
                    last_updated?: string | null
                    name?: string
                    price?: number
                    purchase_price?: number | null
                    purchase_quantity?: number | null
                    purchase_unit?: string | null
                    trend?: string | null
                    unit?: string
                    vendor?: string
                }
                Relationships: []
            }
            recipe_ingredients: {
                Row: {
                    created_at: string | null
                    id: string
                    ingredient_id: string
                    quantity: number
                    recipe_id: string
                    unit: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    ingredient_id: string
                    quantity: number
                    recipe_id: string
                    unit: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    ingredient_id?: string
                    quantity?: number
                    recipe_id?: string
                    unit?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
                        columns: ["ingredient_id"]
                        isOneToOne: false
                        referencedRelation: "ingredients"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "recipe_ingredients_recipe_id_fkey"
                        columns: ["recipe_id"]
                        isOneToOne: false
                        referencedRelation: "recipes"
                        referencedColumns: ["id"]
                    },
                ]
            }
            recipe_steps: {
                Row: {
                    created_at: string | null
                    id: string
                    instruction: string
                    recipe_id: string
                    step_number: number
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    instruction: string
                    recipe_id: string
                    step_number: number
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    instruction?: string
                    recipe_id?: string
                    step_number?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "recipe_steps_recipe_id_fkey"
                        columns: ["recipe_id"]
                        isOneToOne: false
                        referencedRelation: "recipes"
                        referencedColumns: ["id"]
                    },
                ]
            }
            recipes: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    image: string | null
                    name: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    image?: string | null
                    name: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    image?: string | null
                    name?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Helper types for easier usage
export type Ingredient = Database['public']['Tables']['ingredients']['Row']
export type InsertIngredient = Database['public']['Tables']['ingredients']['Insert']
export type UpdateIngredient = Database['public']['Tables']['ingredients']['Update']

export type Recipe = Database['public']['Tables']['recipes']['Row']
export type InsertRecipe = Database['public']['Tables']['recipes']['Insert']
export type UpdateRecipe = Database['public']['Tables']['recipes']['Update']

export type RecipeIngredient = Database['public']['Tables']['recipe_ingredients']['Row']
export type InsertRecipeIngredient = Database['public']['Tables']['recipe_ingredients']['Insert']

export type RecipeStep = Database['public']['Tables']['recipe_steps']['Row']
export type InsertRecipeStep = Database['public']['Tables']['recipe_steps']['Insert']
