import { useState } from 'react';
import './index.css';
import HomePage from './HomePage';
import RecipeDetail from './RecipeDetail';

import IngredientsCatalog from './IngredientsCatalog';

type ViewState = 'home' | 'detail' | 'ingredients';

function App() {
  const [view, setView] = useState<ViewState>('home');

  return (
    <>
      {view === 'home' && <HomePage onNavigate={(v) => setView(v)} />}
      {view === 'detail' && <RecipeDetail onBack={() => setView('home')} onNavigate={(v) => setView(v)} />}
      {view === 'ingredients' && <IngredientsCatalog onBack={() => setView('home')} onNavigate={(v) => setView(v)} />}
    </>
  );
}

export default App;
