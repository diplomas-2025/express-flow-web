import './App.css';
import MainPage from "./pages/MainPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {UserPage} from "./pages/UserPage";
import {CreateOrderPage} from "./pages/CreateOrderPage";
import {OrdersListPage} from "./pages/OrderListPage";
import {OrderManagementPage} from "./pages/OrderManagementPage";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<MainPage/>}/>
                <Route path={'user'} element={<UserPage/>}/>
                <Route path={'orders/create'} element={<CreateOrderPage/>}/>
                <Route path={'orders'} element={<OrdersListPage/>}/>
                <Route path={'orders/:orderId'} element={<OrderManagementPage/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
