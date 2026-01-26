import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
    actions?: React.ReactNode;
}

export default function Header({ actions }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { name: 'Recetas', path: '/' },
        { name: 'Materia Prima', path: '/materiaprima' },
    ];

    return (
        <>
            <header className="w-full px-4 md:px-8 py-6 flex justify-between items-center border-b border-terracotta/10 bg-cream/80 backdrop-blur-md sticky top-0 z-50">
                {/* Logo & Hamburger */}
                <div className="flex items-center gap-4">
                    {/* Hamburger Button (Mobile Only) */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="md:hidden p-1 text-stone hover:text-terracotta transition-colors"
                    >
                        <span className="material-symbols-outlined text-3xl">menu</span>
                    </button>

                    <Link to="/" className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-terracotta text-3xl hidden md:block">menu_book</span>
                        <h1 className="text-xl md:text-2xl font-black tracking-tight text-stone">
                            Zoe es <span className="text-terracotta italic">Pendeja</span>
                        </h1>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-12 font-sans text-sm uppercase tracking-[0.2em] font-medium text-stone/70">
                    {navLinks.map(link => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`hover:text-terracotta transition-colors ${isActive(link.path) ? 'text-terracotta border-b border-terracotta' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions Slot */}
                <div className="flex items-center gap-4 md:gap-6">
                    {actions}
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-[60] bg-stone/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMenuOpen(false)}
            ></div>

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 left-0 z-[70] h-full w-[80%] max-w-sm bg-[#FCF9F3] shadow-2xl transition-transform duration-300 transform md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-xl font-black tracking-tight text-stone">Menú</span>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-1 text-stone/50 hover:text-terracotta transition-colors"
                        >
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </button>
                    </div>

                    <nav className="flex flex-col gap-6 font-serif text-2xl font-bold text-stone">
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-4 py-2 ${isActive(link.path) ? 'text-terracotta italic' : 'text-stone/60'}`}
                            >
                                {isActive(link.path) && <span className="w-1.5 h-1.5 rounded-full bg-terracotta"></span>}
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto pt-8 border-t border-stone/10">
                        <p className="text-xs text-stone/40 uppercase tracking-widest text-center">Zoe es Pendeja App v1.0</p>
                    </div>
                </div>
            </div>
        </>
    );
}
