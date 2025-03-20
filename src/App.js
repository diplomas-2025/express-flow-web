import './App.css';
import MainPage from "./pages/MainPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserPage } from "./pages/UserPage";
import { CreateOrderPage } from "./pages/CreateOrderPage";
import { OrdersListPage } from "./pages/OrderListPage";
import { OrderManagementPage } from "./pages/OrderManagementPage";
import TrackOrderScreen from "./pages/TrackOrderScreen";
import {VehiclesPage} from "./pages/VehiclesPage";
import {DriversPage} from "./pages/DriversPage";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    {localStorage.getItem("authToken") !== null &&
                        <>
                            {localStorage.getItem("isAdmin") === "true" ?
                                <>
                                    <Route path={'orders/create'} element={<CreateOrderPage/>}/>
                                    <Route path={'orders'} element={<OrdersListPage/>}/>
                                    <Route path={'vehicles'} element={<VehiclesPage/>}/>
                                    <Route path={'drivers'} element={<DriversPage/>}/>
                                    <Route path={'orders/:orderId'} element={<OrderManagementPage/>}/>
                                    <Route path="*" element={<Navigate to="/orders"/>}/>
                                </> :
                                <>
                                    <Route path={'user'} element={<UserPage/>}/>
                                    <Route path="*" element={<Navigate to="/user"/>}/>
                                </>
                            }
                        </>
                    }
                    {localStorage.getItem("authToken") === null &&
                        <>
                            <Route path={'/'} element={<MainPage/>}/>
                            <Route path="/track-order" element={<TrackOrderScreen />} />
                            <Route path="*" element={<Navigate to="/"/>}/>
                        </>
                    }
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;