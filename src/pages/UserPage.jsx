import React, { useEffect, useState } from "react";
import { OrderAPI, OrderTrackingAPI } from "../api/Api";
import { Card, CardContent, Typography, Divider, Box, Chip, Stack, TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid } from "@mui/material";
import { FaTruck, FaBox, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import OrderTracking, {translateOrderStatus} from "./OrderTracking"; // Компонент для отслеживания
import { styled } from "@mui/system";
import { keyframes } from "@emotion/react";

// Анимация fadeIn
const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Стилизованный компонент Card с fallback для shadows
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows ? theme.shadows[5] : "0px 4px 20px rgba(0, 0, 0, 0.1)", // Fallback для shadows
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
        transform: "scale(1.02)",
    },
    animation: `${fadeIn} 0.5s ease-in-out`,
}));

// Стилизованный компонент Button
export const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1.5),
    fontWeight: "bold",
    textTransform: "none",
}));

// Стилизованный компонент TextField с fallback для palette.background.paper
const StyledTextField = styled(TextField)(({ theme }) => ({
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette?.background?.paper || "#ffffff", // Fallback для palette.background.paper
}));

export const UserPage = () => {
    const [orders, setOrders] = useState([]);
    const [orderNumber, setOrderNumber] = useState("");
    const [trackingInfo, setTrackingInfo] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        OrderAPI.getAllOrders()
            .then((response) => {
                setOrders(response.data);
                setFilteredOrders(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при получении данных о заказах:", error);
            });
    }, []);

    useEffect(() => {
        let filteredData = orders;

        if (statusFilter) {
            filteredData = filteredData.filter(order => order.status === statusFilter);
        }

        filteredData.sort((a, b) => {
            if (sortOrder === "asc") {
                return new Date(a.orderDate) - new Date(b.orderDate);
            } else {
                return new Date(b.orderDate) - new Date(a.orderDate);
            }
        });

        const userId = localStorage.getItem("userId")
        console.log(userId)
        filteredData = filteredData.filter(order => {
            return order.cargo.client.id == userId || order.cargo.recipient.id == userId
        })

        setFilteredOrders(filteredData);
    }, [statusFilter, sortOrder, orders]);

    const handleTrackOrder = (orderId) => {
        setTrackingInfo(null);
        OrderTrackingAPI.getOrderTrackingByOrderId(orderId)
            .then((response) => {
                setTrackingInfo(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при получении информации об отслеживании заказа:", error);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        window.location.href = "/";
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3} justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
                        Мои заказы
                    </Typography>
                </Grid>
                <Grid item>
                    <StyledButton variant="contained" color="secondary" onClick={handleLogout}>
                        Выход
                    </StyledButton>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Фильтр по статусу</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label="Фильтр по статусу"
                        >
                            <MenuItem value="">Все</MenuItem>
                            <MenuItem value="PENDING">В ожидании</MenuItem>
                            <MenuItem value="IN_TRANSIT">В пути</MenuItem>
                            <MenuItem value="DELIVERED">Доставлен</MenuItem>
                            <MenuItem value="CANCELED">Отменен</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Сортировка</InputLabel>
                        <Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            label="Сортировка"
                        >
                            <MenuItem value="asc">По дате (по возрастанию)</MenuItem>
                            <MenuItem value="desc">По дате (по убыванию)</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <StyledCard sx={{ mt: 3, p: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: "primary.main" }}>
                        <FaSearch />
                        Отследить заказ
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <StyledTextField
                            fullWidth
                            label="Номер заказа"
                            variant="outlined"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                        />
                        <StyledButton
                            variant="contained"
                            onClick={() => handleTrackOrder(orderNumber)}
                            sx={{ height: '56px' }}
                        >
                            Отследить
                        </StyledButton>
                    </Box>
                    {trackingInfo && <OrderTracking orderData={trackingInfo} />}
                </CardContent>
            </StyledCard>

            {filteredOrders.map((order) => (
                <StyledCard sx={{ mt: 3, cursor: "pointer" }} key={order.id} onClick={() => {
                    setOrderNumber(order.id);
                    handleTrackOrder(order.id);
                }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom sx={{ color: "primary.main" }}>
                            <FaBox /> Заказ #{order.id}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <FaMapMarkerAlt /> <b>Откуда:</b> {order.cargo.pickupAddress}
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <FaMapMarkerAlt /> <b>Куда:</b> {order.cargo.deliveryAddress}
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <b>Вес:</b> {order.cargo.weight} кг, <b>Объем:</b> {order.cargo.volume} м³
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <b>Статус заказа:</b>
                                <Chip label={translateOrderStatus(order.status)} color="primary" />
                            </Box>
                        </Stack>
                    </CardContent>
                </StyledCard>
            ))}
        </Box>
    );
};