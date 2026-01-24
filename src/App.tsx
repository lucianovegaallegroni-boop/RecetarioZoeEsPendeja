import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import RecipeDetail from './RecipeDetail';
import IngredientsCatalog from './IngredientsCatalog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/receta/:id" element={<RecipeDetail />} />
        <Route path="/materiaprima" element={<IngredientsCatalog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
