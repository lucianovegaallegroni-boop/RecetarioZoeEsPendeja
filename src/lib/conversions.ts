
export type UnitType = 'mass' | 'volume' | 'count' | 'unknown';

export const UNITS = {
    MASS: ['kg', 'g', 'oz', 'lb'],
    VOLUME: ['L', 'ml', 'cup', 'tbsp', 'tsp'],
    COUNT: ['un', 'unit', 'pcs']
};

export const UNIT_LABELS: Record<string, string> = {
    'kg': 'Kilogramos',
    'g': 'Gramos',
    'L': 'Litros',
    'ml': 'Mililitros',
    'un': 'Unidades',
    'oz': 'Onzas',
    'lb': 'Libras',
    'cup': 'Tazas',
    'tbsp': 'Cuchardas',
    'tsp': 'Cucharaditas'
};



const CONVERSION_RATES: Record<string, number> = {
    // Mass (to kg)
    'kg': 1,
    'g': 0.001,
    'oz': 0.0283495,
    'lb': 0.453592,

    // Volume (to L)
    'L': 1,
    'ml': 0.001,
    'cup': 0.236588, // US Cup
    'tbsp': 0.0147868,
    'tsp': 0.00492892,

    // Count (to un)
    'un': 1,
    'unit': 1,
    'pcs': 1
};

export function getUnitType(unit: string): UnitType {
    if (UNITS.MASS.includes(unit)) return 'mass';
    if (UNITS.VOLUME.includes(unit)) return 'volume';
    if (UNITS.COUNT.includes(unit)) return 'count';
    return 'unknown';
}

export function convertValue(amount: number, fromUnit: string, toUnit: string): number {
    const fromType = getUnitType(fromUnit);
    const toType = getUnitType(toUnit);

    if (fromType === 'unknown' || toType === 'unknown') {
        console.warn(`Cannot convert unknown unit types: ${fromUnit} -> ${toUnit}`);
        return amount;
    }

    if (fromType !== toType) {
        // Simple heuristic: 1kg approx 1L for water-based.
        // But strictly speaking, we can't convert mass to volume without density.
        // For this app, we might fallback to 1:1 if types differ but user insists, 
        // OR better, we return null or throw. 
        // User requirement: "si se pone en otra medida se debe de hacer la conversion".
        // Let's assume 1kg = 1L for simplicity if crossing types (common in simple kitchen apps),
        // or just return amount and warn.
        // Let's implement strict conversion within type, and 1:1 fallback across types with warning for MVP.
        if ((fromType === 'mass' && toType === 'volume') || (fromType === 'volume' && toType === 'mass')) {
            // 1 kg = 1 L assumption
            const amountInBase = amount * CONVERSION_RATES[fromUnit];
            // Convert base kg to base L (1:1) -> then to target volume unit
            // rate(L -> target) = 1 / rate(target -> L)
            return amountInBase / CONVERSION_RATES[toUnit];
        }

        console.warn(`Incompatible unit types: ${fromUnit} (${fromType}) -> ${toUnit} (${toType})`);
        return amount;
    }

    const amountInBase = amount * CONVERSION_RATES[fromUnit];
    return amountInBase / CONVERSION_RATES[toUnit];
}

/**
 * Calculates the price per BASE unit (kg, L, un).
 * @param purchasePrice Total price paid
 * @param purchaseQuantity Total quantity bought
 * @param purchaseUnit Unit of the quantity bought
 */
export function calculateStandardCost(purchasePrice: number, purchaseQuantity: number, purchaseUnit: string): number {
    if (purchaseQuantity === 0) return 0;

    const type = getUnitType(purchaseUnit);
    let baseUnit = 'kg';
    if (type === 'volume') baseUnit = 'L';
    if (type === 'count') baseUnit = 'un';

    // We want Price / BaseUnit
    // 1. Convert purchaseQuantity to BaseUnit
    const quantityInBase = convertValue(purchaseQuantity, purchaseUnit, baseUnit);

    if (quantityInBase === 0) return 0;

    return purchasePrice / quantityInBase;
}
