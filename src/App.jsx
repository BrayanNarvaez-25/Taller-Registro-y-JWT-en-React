import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvaider } from "./context/AuthContext"
import Login  from './pages/Login';
import Registrar from './pages/Registrar';
import ProtectedRoute from './components/ProtectedRout';
import Perfil from './pages/Perfli'
import Vehiculos from './pages/Vehiculos';

function App() {
  return (
    <AuthProvaider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/registrar' element={<Registrar />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/perfil' element={<Perfil />} />
            <Route path='/vehiculos' element={<Vehiculos/>}/>
          </Route>
          <Route path='*' element={<Navigate to={"/login"} replace/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvaider>
  )
};

export default App;