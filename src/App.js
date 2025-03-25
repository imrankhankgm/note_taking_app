import './App.css';
import Home from './components/home';
import ResponsiveAppBar from './components/appBar';
import { ComponentsAccessProvider } from './components/ComponentsAccess';

function App() {
  return (
    <ComponentsAccessProvider>
      <div>
        <ResponsiveAppBar />
        <Home />
      </div>
    </ComponentsAccessProvider>
  );
}

export default App;
