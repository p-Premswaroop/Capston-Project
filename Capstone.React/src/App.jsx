import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import ServiceRequestTable from './pages/serviceRequestTable';
import Create from "./pages/Create";
import Delete from "./pages/Delete";
import Reopen from "./pages/reopen";
import Search from "./pages/Search";
import './App.css'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/serviceRequests" element={<ServiceRequestTable />} />
                <Route path="/Create" element={<Create />} />
                <Route path="/reOpen/:id" element={<Reopen />} />
                <Route path="/Delete/:id" element={<Delete />} />
                <Route path="/search" element={<Search />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;