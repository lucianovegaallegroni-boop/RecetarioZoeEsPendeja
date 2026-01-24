import { Link, useNavigate } from 'react-router-dom';

export default function RecipeDetail() {
    const navigate = useNavigate();

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
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all shadow-lg shadow-terracotta/20 text-sm font-semibold tracking-wide">
                        <span className="material-symbols-outlined text-lg">print</span>
                        PRINT JOURNAL
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
                        <img alt="Tarta de Queso" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV2QiEvoT6YSxPpiXObhRd-8kQ7w-qLB_jQIS_nMc-zKXLulJrfuTfVUFt31aagcvWX1xLNplKBpZ-mRbgC4QeedF7oVO97jllchYllleOWJUAD_CCmFDbTXtZzJHOEpevZpqIFmT7eq1w23lpJEXshRLHj_vZXIbXgoxLkcaFGIa-okpTX9-IhzJsBxMwlvKDae5RK7RAmjUwlwSTASjZMnmGsuRzaEfTVodi7fumA9TJQuZEE5XePH1SFaW8utJEV9W4M8Kt_iw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-6 text-white">
                            <div className="max-w-2xl">
                                <span className="inline-block px-4 py-1 bg-terracotta/90 text-xs font-bold tracking-[0.3em] uppercase mb-4 rounded-sm">Featured Creation</span>
                                <h2 className="text-6xl md:text-8xl font-black italic leading-none mb-4">Tarta de Queso</h2>
                                <p className="font-sans text-lg text-white/90 italic max-w-lg">A velvet-smooth Basque inspiration, kissed by fire and balanced with the precise alchemy of our boutique cellar's finest ingredients.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-right">
                                    <p className="text-xs uppercase tracking-widest text-white/60 mb-1">Recipe Yield</p>
                                    <p className="text-2xl font-bold">12 Golden Slices</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-10 right-20 hidden lg:block">
                        <div className="bg-white p-8 rounded-2xl shadow-xl rotate-3 max-w-[200px] border border-blush">
                            <p className="handwritten text-terracotta text-lg mb-2">Baker's Note</p>
                            <p className="text-sm italic text-stone/70">"The center must dance like a flame when it leaves the hearth."</p>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                    <div className="lg:col-span-4 space-y-12">
                        <div>
                            <h3 className="text-3xl font-bold mb-6 italic border-b border-terracotta/20 pb-4">The Economics of Taste</h3>
                            <div className="space-y-8">
                                <div className="flex items-center justify-between group">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-stone/50 font-bold">Atelier Cost</p>
                                        <p className="text-4xl font-serif text-stone group-hover:text-terracotta transition-colors">€12.50 <span className="text-sm font-sans text-sage italic">+2.4%</span></p>
                                    </div>
                                    <span className="material-symbols-outlined text-4xl text-terracotta/20">payments</span>
                                </div>
                                <div className="flex items-center justify-between group">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-stone/50 font-bold">Per Indulgence</p>
                                        <p className="text-4xl font-serif text-stone group-hover:text-terracotta transition-colors">€1.04 <span className="text-sm font-sans text-stone/40 italic">stable</span></p>
                                    </div>
                                    <span className="material-symbols-outlined text-4xl text-terracotta/20">bakery_dining</span>
                                </div>
                                <div className="flex items-center justify-between group">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-stone/50 font-bold">Recommended Offering</p>
                                        <p className="text-4xl font-serif text-terracotta">€3.50 <span className="text-sm font-sans text-stone/40 italic">30% margin</span></p>
                                    </div>
                                    <span className="material-symbols-outlined text-4xl text-terracotta/20">star</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-sage/10 p-8 rounded-3xl border border-sage/20 relative overflow-hidden">
                            <div className="absolute top-4 right-4 text-sage opacity-20 transform rotate-12">
                                <span className="material-symbols-outlined text-7xl">trending_up</span>
                            </div>
                            <h4 className="text-lg font-bold text-sage mb-2 uppercase tracking-widest">Profit Insight</h4>
                            <p className="text-3xl font-serif text-stone mb-4">68.5% Grace</p>
                            <p className="text-sm leading-relaxed text-stone/70">Our artisanal approach yields a premium margin, allowing for the reinvestment into seasonal ingredients and craft development.</p>
                        </div>
                    </div>
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-blush relative">
                            <div className="absolute -top-6 left-10 px-6 py-2 bg-cream border border-terracotta/30 rounded-full flex items-center gap-2">
                                <span className="material-symbols-outlined text-terracotta">inventory_2</span>
                                <span className="text-xs font-bold tracking-widest uppercase">The Ingredient Journal</span>
                            </div>
                            <div className="mt-4 space-y-6">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs uppercase tracking-[0.2em] text-stone/40 border-b border-terracotta/10">
                                            <th className="pb-4 font-bold">Noble Ingredient</th>
                                            <th className="pb-4 font-bold">Quantity</th>
                                            <th className="pb-4 font-bold text-right">Investment</th>
                                            <th className="pb-4 font-bold text-right">Sum</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-sans text-stone divide-y divide-terracotta/5">
                                        <tr className="group hover:bg-cream/50 transition-colors">
                                            <td className="py-6 flex items-center gap-4">
                                                <span className="material-symbols-outlined text-terracotta/40">egg_alt</span>
                                                <span className="font-medium text-lg">Cream Cheese</span>
                                            </td>
                                            <td className="py-6 italic text-stone/60">1.0 kg</td>
                                            <td className="py-6 text-right text-stone/60">€8.00/kg</td>
                                            <td className="py-6 text-right font-serif font-bold text-lg">€8.00</td>
                                        </tr>
                                        <tr className="group hover:bg-cream/50 transition-colors">
                                            <td className="py-6 flex items-center gap-4">
                                                <span className="material-symbols-outlined text-terracotta/40">water_drop</span>
                                                <span className="font-medium text-lg">Heavy Cream</span>
                                            </td>
                                            <td className="py-6 italic text-stone/60">500 ml</td>
                                            <td className="py-6 text-right text-stone/60">€4.50/L</td>
                                            <td className="py-6 text-right font-serif font-bold text-lg">€2.25</td>
                                        </tr>
                                        <tr className="group hover:bg-cream/50 transition-colors">
                                            <td className="py-6 flex items-center gap-4">
                                                <span className="material-symbols-outlined text-terracotta/40">cooking</span>
                                                <span className="font-medium text-lg">Large Eggs</span>
                                            </td>
                                            <td className="py-6 italic text-stone/60">5 units</td>
                                            <td className="py-6 text-right text-stone/60">€0.22/u</td>
                                            <td className="py-6 text-right font-serif font-bold text-lg">€1.10</td>
                                        </tr>
                                        <tr className="group hover:bg-cream/50 transition-colors">
                                            <td className="py-6 flex items-center gap-4">
                                                <span className="material-symbols-outlined text-terracotta/40">grain</span>
                                                <span className="font-medium text-lg">Sugar (White)</span>
                                            </td>
                                            <td className="py-6 italic text-stone/60">300 g</td>
                                            <td className="py-6 text-right text-stone/60">€1.20/kg</td>
                                            <td className="py-6 text-right font-serif font-bold text-lg">€0.36</td>
                                        </tr>
                                        <tr className="group hover:bg-cream/50 transition-colors">
                                            <td className="py-6 flex items-center gap-4">
                                                <span className="material-symbols-outlined text-terracotta/40">science</span>
                                                <span className="font-medium text-lg">Wheat Flour</span>
                                            </td>
                                            <td className="py-6 italic text-stone/60">20 g</td>
                                            <td className="py-6 text-right text-stone/60">€0.95/kg</td>
                                            <td className="py-6 text-right font-serif font-bold text-lg">€0.02</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td className="pt-8 text-right font-sans text-xs uppercase tracking-[0.3em] font-bold text-stone/40" colSpan={3}>Grand Atelier Total</td>
                                            <td className="pt-8 text-right font-serif text-3xl font-black text-terracotta">€12.50</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-24">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <span className="handwritten text-terracotta text-3xl mb-4">The Secret Method</span>
                        <h3 className="text-5xl font-serif italic text-stone">Crafting the Perfect Soul</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        <div className="flex flex-col gap-6 relative p-8 bg-white rounded-3xl border border-blush shadow-sm hover:shadow-xl transition-all group">
                            <span className="absolute -top-4 -left-4 size-12 bg-terracotta text-white rounded-full flex items-center justify-center font-serif text-2xl italic group-hover:scale-110 transition-transform">1</span>
                            <div className="size-16 bg-blush rounded-2xl flex items-center justify-center text-terracotta mb-2">
                                <span className="material-symbols-outlined text-4xl">oven</span>
                            </div>
                            <h4 className="text-xl font-serif font-bold italic">The Hearth's Breath</h4>
                            <p className="text-stone/70 leading-relaxed italic">Preheat your sanctuary to 210°C (410°F). Seek a deep, enveloping heat from both upper and lower elements to kiss the surface while cradling the core.</p>
                        </div>
                        <div className="flex flex-col gap-6 relative p-8 bg-white rounded-3xl border border-blush shadow-sm hover:shadow-xl transition-all group">
                            <span className="absolute -top-4 -left-4 size-12 bg-terracotta text-white rounded-full flex items-center justify-center font-serif text-2xl italic group-hover:scale-110 transition-transform">2</span>
                            <div className="size-16 bg-blush rounded-2xl flex items-center justify-center text-terracotta mb-2">
                                <span className="material-symbols-outlined text-4xl">agender</span>
                            </div>
                            <h4 className="text-xl font-serif font-bold italic">The Velvet Union</h4>
                            <p className="text-stone/70 leading-relaxed italic">Whisk the cream cheese and sugar with gentle intention. We seek smoothness, not air. Treat it as a meditation, removing every lump with soft strokes.</p>
                        </div>
                        <div className="flex flex-col gap-6 relative p-8 bg-white rounded-3xl border border-blush shadow-sm hover:shadow-xl transition-all group">
                            <span className="absolute -top-4 -left-4 size-12 bg-terracotta text-white rounded-full flex items-center justify-center font-serif text-2xl italic group-hover:scale-110 transition-transform">3</span>
                            <div className="size-16 bg-blush rounded-2xl flex items-center justify-center text-terracotta mb-2">
                                <span className="material-symbols-outlined text-4xl">waves</span>
                            </div>
                            <h4 className="text-xl font-serif font-bold italic">The Flow of Gold</h4>
                            <p className="text-stone/70 leading-relaxed italic">Introduce the eggs one by one, watching them vanish into the fold. Slowly whisper in the heavy cream and a fine dusting of sieved flour.</p>
                        </div>
                        <div className="flex flex-col gap-6 relative p-8 bg-white rounded-3xl border border-blush shadow-sm hover:shadow-xl transition-all group lg:col-start-1">
                            <span className="absolute -top-4 -left-4 size-12 bg-terracotta text-white rounded-full flex items-center justify-center font-serif text-2xl italic group-hover:scale-110 transition-transform">4</span>
                            <div className="size-16 bg-blush rounded-2xl flex items-center justify-center text-terracotta mb-2">
                                <span className="material-symbols-outlined text-4xl">foundation</span>
                            </div>
                            <h4 className="text-xl font-serif font-bold italic">The Cradle</h4>
                            <p className="text-stone/70 leading-relaxed italic">Line a 24cm springform pan with damp parchment paper—let it crinkle and fold naturally. Pour the nectar and bake for 40-45 minutes until the edges are firm but the heart remains tender.</p>
                        </div>
                        <div className="flex flex-col gap-6 relative p-8 bg-white rounded-3xl border border-blush shadow-sm hover:shadow-xl transition-all group lg:col-span-2">
                            <span className="absolute -top-4 -left-4 size-12 bg-terracotta text-white rounded-full flex items-center justify-center font-serif text-2xl italic group-hover:scale-110 transition-transform">5</span>
                            <div className="size-16 bg-blush rounded-2xl flex items-center justify-center text-terracotta mb-2">
                                <span className="material-symbols-outlined text-4xl">ac_unit</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xl font-serif font-bold italic">The Patient Rest</h4>
                                    <p className="text-stone/70 leading-relaxed italic">The center should dance like jelly when you pull it from the heat. Allow it to rest at room temperature for 4 hours, then chill to settle its soul.</p>
                                </div>
                                <div className="bg-terracotta/5 p-6 rounded-2xl border border-dashed border-terracotta/30">
                                    <p className="handwritten text-terracotta text-sm mb-2">Pro Tip</p>
                                    <p className="text-xs italic text-stone/60">Serve at room temperature for maximum creaminess. A pinch of Maldon salt on top brings out the hidden depths of the cheese.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-stone text-cream py-20">
                <div className="max-w-[1400px] mx-auto px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
                        <div>
                            <h2 className="text-3xl font-serif italic mb-6">La Boutique <span className="text-terracotta">Sucrée</span></h2>
                            <p className="text-white/50 text-sm leading-relaxed max-w-xs italic">Curation of taste, master of cost. Our recipes are more than formulas—they are the story of our craft.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold tracking-[0.2em] uppercase text-xs text-terracotta">The Archive</h4>
                            <a className="text-cream/70 hover:text-white transition-colors" href="#">Tarts & Cakes</a>
                            <a className="text-cream/70 hover:text-white transition-colors" href="#">Morning Viennoiserie</a>
                            <a className="text-cream/70 hover:text-white transition-colors" href="#">Seasonal Specials</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold tracking-[0.2em] uppercase text-xs text-terracotta">Registry</h4>
                            <a className="text-cream/70 hover:text-white transition-colors" href="#">Ingredient Intelligence</a>
                            <a className="text-cream/70 hover:text-white transition-colors" href="#">Margin Reports</a>
                            <a className="text-cream/70 hover:text-white transition-colors" href="#">Export Ledger</a>
                        </div>
                    </div>
                    <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between gap-6 items-center">
                        <span className="text-white/30 text-xs tracking-widest uppercase">© 2023 Boutique Atelier Manager — Artisan Edition</span>
                        <div className="flex gap-8 text-white/30 text-xs tracking-widest uppercase">
                            <a className="hover:text-terracotta" href="#">Confidentiality</a>
                            <a className="hover:text-terracotta" href="#">Concierge</a>
                            <a className="hover:text-terracotta" href="#">Terms of Craft</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
