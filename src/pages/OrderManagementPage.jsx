import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Для получения ID заказа
import { OrderAPI, OrderTrackingAPI } from "../api/Api"; // Предполагаем, что API для заказов и отслеживания уже настроены
import {
    Box,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Card,
    CardContent,
    Stack,
    Chip,
    List,
    ListItem,
    ListItemText,
    Grid
} from "@mui/material";
import { FaBox, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaTruck } from "react-icons/fa"; // Иконки
import { keyframes } from "@emotion/react";
import { styled } from "@mui/system";
import { translateOrderStatus } from "./OrderTracking";

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
        transform: "scale(1.02)"
    },
}));

export const OrderManagementPage = () => {
    const { orderId } = useParams(); // Получаем ID заказа из URL
    const [order, setOrder] = useState(null); // Данные о заказе
    const [statusHistory, setStatusHistory] = useState([]); // Список истории статусов
    const [statusForm, setStatusForm] = useState({
        status: "PENDING",
        location: "",
    });

    // Загружаем данные о заказе и его истории статусов при монтировании компонента
    useEffect(() => {
        // Загружаем данные о заказе
        OrderAPI.getOrderById(orderId)
            .then((response) => {
                setOrder(response.data); // Предполагаем, что данные находятся в response.data
            })
            .catch((error) => {
                console.error("Ошибка при получении данных о заказе:", error);
            });

        // Загружаем историю статусов для заказа
        OrderTrackingAPI.getOrderTrackingByOrderId(orderId)
            .then((response) => {
                setStatusHistory(response.data); // Предполагаем, что данные находятся в response.data
            })
            .catch((error) => {
                console.error("Ошибка при получении данных об истории статусов:", error);
            });
    }, [orderId]);

    // Обработчик изменения значений в форме статуса
    const handleStatusInputChange = (e) => {
        const { name, value } = e.target;
        setStatusForm({
            ...statusForm,
            [name]: value,
        });
    };

    // Обработчик отправки формы статуса
    const handleStatusSubmit = (e) => {
        e.preventDefault();

        // Отправляем данные на сервер
        OrderTrackingAPI.createOrderTracking({
            orderId: parseInt(orderId, 10),
            ...statusForm,
        })
            .then((response) => {
                console.log("Статус успешно добавлен:", response.data);
                alert("Статус успешно добавлен!");
                // Обновляем список истории статусов
                setStatusHistory((prevStatusHistory) => [...prevStatusHistory, response.data]);
                // Очищаем форму после успешного создания
                setStatusForm({
                    status: "PENDING",
                    location: "",
                });
            })
            .catch((error) => {
                console.error("Ошибка при добавлении статуса:", error);
                alert("Ошибка при добавлении статуса. Пожалуйста, попробуйте снова.");
            });
    };

    // Обработчик изменения статуса заказа
    const handleOrderStatusChange = (newStatus) => {
        OrderAPI.updateOrderStatus(orderId, newStatus)
            .then((response) => {
                console.log("Статус заказа успешно обновлен:", response.data);
                // Обновляем данные о заказе
                setOrder((prevOrder) => ({
                    ...prevOrder,
                    status: newStatus,
                }));
            })
            .catch((error) => {
                console.error("Ошибка при обновлении статуса заказа:", error);
            });
    };

    // Обработчик изменения статуса в истории
    const handleStatusHistoryChange = (statusId, newStatus) => {
        OrderTrackingAPI.updateOrderTrackingStatus(statusId, newStatus)
            .then((response) => {
                console.log("Статус успешно обновлен:", response.data);
                // Обновляем список истории статусов
                setStatusHistory((prevStatusHistory) =>
                    prevStatusHistory.map((status) =>
                        status.id === statusId ? { ...status, status: newStatus } : status
                    )
                );
            })
            .catch((error) => {
                console.error("Ошибка при обновлении статуса:", error);
            });
    };

    if (!order) {
        return <Typography>Загрузка...</Typography>; // Отображаем загрузку, пока данные не получены
    }

    return (
        <Box sx={{ p: 3, background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)", minHeight: "100vh" }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}>
                <FaBox /> Управление заказом #{order.id}
            </Typography>

            {/* Информация о заказе */}
            <StyledCard sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Информация о заказе
                    </Typography>
                    <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <b>Статус:</b>
                            <FormControl sx={{ minWidth: 120 }}>
                                <Select
                                    value={order.status}
                                    onChange={(e) => handleOrderStatusChange(e.target.value)}
                                    size="small"
                                >
                                    <MenuItem value="PENDING">В ожидании</MenuItem>
                                    <MenuItem value="IN_TRANSIT">В пути</MenuItem>
                                    <MenuItem value="DELIVERED">Доставлен</MenuItem>
                                    <MenuItem value="CANCELED">Отменен</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <FaBox />
                            <b>Описание:</b> {order.cargo.description}
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <FaUser />
                            <b>Клиент:</b> {order.cargo.client.name} ({order.cargo.client.email})
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <FaUser />
                            <b>Получатель:</b> {order.cargo.recipient.name} ({order.cargo.recipient.email})
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <FaCalendarAlt />
                            <b>Дата заказа:</b> {new Date(order.orderDate).toLocaleDateString()}
                        </Box>
                    </Stack>
                </CardContent>
            </StyledCard>

            {/* Форма для добавления статуса */}
            <StyledCard sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Добавить статус
                    </Typography>
                    <form onSubmit={handleStatusSubmit}>
                        <Grid container spacing={3}>
                            {/* Статус */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Статус</InputLabel>
                                    <Select
                                        name="status"
                                        value={statusForm.status}
                                        onChange={handleStatusInputChange}
                                        label="Статус"
                                        required
                                    >
                                        <MenuItem value="PENDING">В ожидании</MenuItem>
                                        <MenuItem value="IN_TRANSIT">В пути</MenuItem>
                                        <MenuItem value="DELIVERED">Доставлен</MenuItem>
                                        <MenuItem value="CANCELED">Отменен</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Местоположение */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Местоположение"
                                    name="location"
                                    value={statusForm.location}
                                    onChange={handleStatusInputChange}
                                    required
                                    InputProps={{
                                        startAdornment: <FaMapMarkerAlt style={{ marginRight: 8, color: "#666" }} />,
                                    }}
                                />
                            </Grid>

                            {/* Кнопка отправки */}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<FaTruck />}
                                    sx={{ textTransform: "none", fontWeight: "bold" }}
                                >
                                    Добавить статус
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </StyledCard>

            {/* История статусов */}
            <StyledCard>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        История статусов
                    </Typography>
                    <List>
                        {statusHistory.map((status) => (
                            <ListItem key={status.id} sx={{ borderBottom: "1px solid #eee" }}>
                                <ListItemText
                                    primary={`Статус: ${translateOrderStatus(status.status)}`}
                                    secondary={`Местоположение: ${status.location} | Дата: ${new Date(status.timestamp).toLocaleString()}`}
                                />
                                <FormControl sx={{ minWidth: 120 }}>
                                    <Select
                                        value={status.status}
                                        onChange={(e) => handleStatusHistoryChange(status.id, e.target.value)}
                                        size="small"
                                    >
                                        <MenuItem value="PENDING">В ожидании</MenuItem>
                                        <MenuItem value="IN_TRANSIT">В пути</MenuItem>
                                        <MenuItem value="DELIVERED">Доставлен</MenuItem>
                                        <MenuItem value="CANCELED">Отменен</MenuItem>
                                    </Select>
                                </FormControl>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </StyledCard>
        </Box>
    );
};