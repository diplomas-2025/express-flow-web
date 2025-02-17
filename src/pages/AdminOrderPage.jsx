import React, { useEffect, useState } from "react";
import { OrderAPI, OrderTrackingAPI } from "../api/Api"; // Предполагаем, что API для заказов и отслеживания уже настроены
import { Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Card, CardContent, Stack, Chip } from "@mui/material";

export const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]); // Список всех заказов
    const [trackingForm, setTrackingForm] = useState({
        orderId: "",
        status: "PENDING",
        location: "",
    });

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

    // Обработчик изменения значений в форме отслеживания
    const handleTrackingInputChange = (e) => {
        const { name, value } = e.target;
        setTrackingForm({
            ...trackingForm,
            [name]: value,
        });
    };

    // Обработчик отправки формы отслеживания
    const handleTrackingSubmit = (e) => {
        e.preventDefault();

        // Преобразуем orderId в число
        const payload = {
            ...trackingForm,
            orderId: parseInt(trackingForm.orderId, 10),
        };

        // Отправляем данные на сервер
        OrderTrackingAPI.createOrderTracking(payload)
            .then((response) => {
                console.log("Отслеживание успешно создано:", response.data);
                alert("Отслеживание успешно создано!");
                // Очищаем форму после успешного создания
                setTrackingForm({
                    orderId: "",
                    status: "PENDING",
                    location: "",
                });
            })
            .catch((error) => {
                console.error("Ошибка при создании отслеживания:", error);
                alert("Ошибка при создании отслеживания. Пожалуйста, попробуйте снова.");
            });
    };

    // Обработчик изменения статуса заказа
    const handleStatusChange = (orderId, newStatus) => {
        OrderAPI.updateOrderStatus(orderId, newStatus)
            .then((response) => {
                console.log("Статус заказа успешно обновлен:", response.data);
                // Обновляем список заказов
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            })
            .catch((error) => {
                console.error("Ошибка при обновлении статуса заказа:", error);
            });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
                Управление заказами
            </Typography>

            {/* Форма для создания отслеживания */}
            <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Создать отслеживание
                    </Typography>
                    <form onSubmit={handleTrackingSubmit}>
                        <Grid container spacing={3}>
                            {/* Выбор заказа */}
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Заказ</InputLabel>
                                    <Select
                                        name="orderId"
                                        value={trackingForm.orderId}
                                        onChange={handleTrackingInputChange}
                                        label="Заказ"
                                        required
                                    >
                                        {orders.map((order) => (
                                            <MenuItem key={order.id} value={order.id}>
                                                Заказ #{order.id}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Статус */}
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Статус</InputLabel>
                                    <Select
                                        name="status"
                                        value={trackingForm.status}
                                        onChange={handleTrackingInputChange}
                                        label="Статус"
                                        required
                                    >
                                        <MenuItem value="PENDING">В ожидании</MenuItem>
                                        <MenuItem value="SHIPPED">Отправлен</MenuItem>
                                        <MenuItem value="DELIVERED">Доставлен</MenuItem>
                                        <MenuItem value="CANCELED">Отменен</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Местоположение */}
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Местоположение"
                                    name="location"
                                    value={trackingForm.location}
                                    onChange={handleTrackingInputChange}
                                    required
                                />
                            </Grid>

                            {/* Кнопка отправки */}
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary">
                                    Создать отслеживание
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            {/* Список всех заказов */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: "bold" }}>
                Список заказов
            </Typography>
            {orders.map((order) => (
                <Card key={order.id} sx={{ mb: 2, boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Заказ #{order.id}
                        </Typography>
                        <Stack spacing={2}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <b>Статус:</b>
                                <FormControl sx={{ minWidth: 120 }}>
                                    <Select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        size="small"
                                    >
                                        <MenuItem value="PENDING">В ожидании</MenuItem>
                                        <MenuItem value="SHIPPED">Отправлен</MenuItem>
                                        <MenuItem value="DELIVERED">Доставлен</MenuItem>
                                        <MenuItem value="CANCELED">Отменен</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <b>Описание:</b> {order.description}
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <b>Вес:</b> {order.weight} кг, <b>Объем:</b> {order.volume} м³
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <b>Адрес забора:</b> {order.pickupAddress}
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <b>Адрес доставки:</b> {order.deliveryAddress}
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};