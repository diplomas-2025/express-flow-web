import React, { useEffect, useState } from "react";
import { OrderAPI } from "../api/Api"; // Предполагаем, что API для заказов уже настроен
import { Box, Typography, Card, CardContent, Stack, Chip, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Для навигации между экранами
import { FaBox, FaUser, FaCalendarAlt, FaPlus, FaSignOutAlt } from "react-icons/fa"; // Иконки
import { keyframes } from "@emotion/react";
import { styled } from "@mui/system";
import { translateOrderStatus } from "./OrderTracking";
import {StyledButton} from "./UserPage";

// Анимация для карточек
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

// Стилизованный компонент Card
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    animation: `${fadeIn} 0.5s ease-in-out`,
    "&:hover": {
        transform: "scale(1.02)",
    },
}));

export const OrdersListPage = () => {
    const [orders, setOrders] = useState([]); // Список всех заказов
    const navigate = useNavigate();

    // Загружаем список заказов при монтировании компонента
    useEffect(() => {
        OrderAPI.getAllOrders()
            .then((response) => {
                setOrders(response.data); // Предполагаем, что данные находятся в response.data
            })
            .catch((error) => {
                console.error("Ошибка при получении списка заказов:", error);
            });
    }, []);

    // Переход на экран управления заказом
    const handleOrderClick = (orderId) => {
        navigate(`/orders/${orderId}`); // Переход на страницу заказа
    };

    // Переход на экран создания заказа
    const handleCreateOrderClick = () => {
        navigate("/orders/create"); // Переход на страницу создания заказа
    };

    // Обработчик выхода из аккаунта
    const handleLogout = () => {
        // Очищаем данные пользователя (например, токен аутентификации)
        localStorage.removeItem("authToken"); // Удаляем токен из localStorage
        // Перенаправляем пользователя на страницу входа
        window.location.href = "/";
    };

    return (
        <Box sx={{ p: 3, background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)", minHeight: "100vh" }}>
            {/* Заголовок, кнопка создания заказа и кнопка выхода */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
                    Список заказов
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FaPlus />}
                        onClick={handleCreateOrderClick}
                        sx={{ textTransform: "none", fontWeight: "bold", borderRadius: "15px" }}
                    >
                        Создать заказ
                    </Button>
                    <StyledButton variant="contained" color="secondary" onClick={handleLogout}>
                        Выход
                    </StyledButton>
                </Box>
            </Box>

            {/* Список заказов */}
            <Grid container spacing={3}>
                {orders.map((order) => (
                    <Grid item xs={12} sm={6} md={4} key={order.id}>
                        <StyledCard onClick={() => handleOrderClick(order.id)} sx={{ cursor: "pointer" }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <FaBox /> Заказ #{order.id}
                                </Typography>
                                <Stack spacing={2}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Chip label={translateOrderStatus(order.status)} color="primary" sx={{ fontWeight: "bold" }} />
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <FaUser />
                                        <b>Клиент:</b> {order.cargo.client.name} ({order.cargo.client.phone})
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <FaUser />
                                        <b>Получатель:</b> {order.cargo.recipient.name} ({order.cargo.recipient.phone})
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <FaCalendarAlt />
                                        <b>Дата заказа:</b> {new Date(order.orderDate).toLocaleDateString()}
                                    </Box>
                                </Stack>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};