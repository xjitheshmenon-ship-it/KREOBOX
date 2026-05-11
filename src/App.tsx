import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import NewProject from './pages/NewProject'
import DesignStudio from './pages/DesignStudio'
import BOQExport from './pages/BOQExport'
import ModuleCatalog from './pages/ModuleCatalog'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects/new" element={<NewProject />} />
      <Route path="/projects/:id/design" element={<DesignStudio />} />
      <Route path="/projects/:id/boq" element={<BOQExport />} />
      <Route path="/modules" element={<ModuleCatalog />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
