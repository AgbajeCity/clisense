import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { runDependencyCheck } from './lib/depCheck'

runDependencyCheck();

createRoot(document.getElementById("root")!).render(<App />);
