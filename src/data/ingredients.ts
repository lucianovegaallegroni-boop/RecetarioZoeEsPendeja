// Shared ingredient data across the application

export interface Ingredient {
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

export const AVAILABLE_INGREDIENTS: Ingredient[] = [
    {
        id: '1',
        name: 'Mantequilla de Soria',
        category: 'Lácteos',
        vendor: 'Lácteos Castilla',
        price: 12.50,
        unit: 'kg',
        image: 'https://cdn-icons-png.flaticon.com/512/2313/2313495.png',
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
        unit: 'kg',
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
    {
        id: '5',
        name: 'Cream Cheese',
        category: 'Lácteos',
        vendor: 'Lácteos Premium',
        price: 8.00,
        unit: 'kg',
        image: 'https://cdn-icons-png.flaticon.com/512/3050/3050158.png',
        lastUpdated: 'Hoy',
        trend: 'stable'
    },
    {
        id: '6',
        name: 'Huevos Frescos',
        category: 'Lácteos',
        vendor: 'Granja Local',
        price: 0.22,
        unit: 'un',
        image: 'https://cdn-icons-png.flaticon.com/512/1713/1713396.png',
        lastUpdated: 'Hoy',
        trend: 'up'
    },
    {
        id: '7',
        name: 'Azúcar Blanca',
        category: 'Harinas',
        vendor: 'Azucarera Nacional',
        price: 1.20,
        unit: 'kg',
        image: 'https://cdn-icons-png.flaticon.com/512/2413/2413029.png',
        lastUpdated: 'Ayer',
        trend: 'stable'
    },
    {
        id: '8',
        name: 'Nata para Montar',
        category: 'Lácteos',
        vendor: 'Lácteos Premium',
        price: 4.50,
        unit: 'L',
        image: 'https://cdn-icons-png.flaticon.com/512/3050/3050132.png',
        lastUpdated: 'Hoy',
        trend: 'down'
    }
];

export const UNIT_OPTIONS = ['kg', 'g', 'L', 'ml', 'un'];
