import React, { useEffect, useState } from "react";
import { ClientAPI, OrderAPI } from "../api/Api"; // Предполагаем, что API для заказов и пользователей уже настроены
import { Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Card, CardContent } from "@mui/material";
import { FaUser, FaBox, FaTruck, FaMapMarkerAlt, FaPlus } from "react-icons/fa"; // Иконки
import { keyframes } from "@emotion/react";
import { styled } from "@mui/system";

// Анимация для формы
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

export const CreateOrderPage = () => {
    const [users, setUsers] = useState([]); // Список всех пользователей
    const [formData, setFormData] = useState({
        clientId: "",
        recipientId: "",
        description: "",
        weight: 0,
        volume: 0,
        pickupAddress: "",
        deliveryAddress: "",
    });

    // Загружаем список пользователей при монтировании компонента
    useEffect(() => {
        ClientAPI.getAllClients()
            .then((response) => {
                setUsers(response.data); // Предполагаем, что данные находятся в response.data
            })
            .catch((error) => {
                console.error("Ошибка при получении списка пользователей:", error);
            });
    }, []);

    // Обработчик изменения значений в форме
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();

        // Преобразуем clientId и recipientId в числа
        const payload = {
            ...formData,
            clientId: parseInt(formData.clientId, 10),
            recipientId: parseInt(formData.recipientId, 10),
        };

        // Отправляем данные на сервер
        OrderAPI.createOrder(payload)
            .then((response) => {
                console.log("Заказ успешно создан:", response.data);
                alert("Заказ успешно создан!");
                // Очищаем форму после успешного создания
                setFormData({
                    clientId: "",
                    recipientId: "",
                    description: "",
                    weight: 0,
                    volume: 0,
                    pickupAddress: "",
                    deliveryAddress: "",
                });
            })
            .catch((error) => {
                console.error("Ошибка при создании заказа:", error);
                alert("Ошибка при создании заказа. Пожалуйста, попробуйте снова.");
            });
    };

    return (
        <Box sx={{ p: 3, background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)", minHeight: "100vh" }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}>
                <FaBox /> Создание нового заказа
            </Typography>

            <StyledCard>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Выбор клиента */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Клиент</InputLabel>
                                    <Select
                                        name="clientId"
                                        value={formData.clientId}
                                        onChange={handleInputChange}
                                        label="Клиент"
                                        required
                                    >
                                        {users.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                <FaUser /> {user.name} (ID: {user.id})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Выбор получателя */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Получатель</InputLabel>
                                    <Select
                                        name="recipientId"
                                        value={formData.recipientId}
                                        onChange={handleInputChange}
                                        label="Получатель"
                                        required
                                    >
                                        {users.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                <FaUser /> {user.name} (ID: {user.id})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Описание заказа */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Описание заказа"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>

                            {/* Вес */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Вес (кг)"
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>

                            {/* Объем */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Объем (м³)"
                                    type="number"
                                    name="volume"
                                    value={formData.volume}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>

                            {/* Адрес забора */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Адрес отправки"
                                    name="pickupAddress"
                                    value={formData.pickupAddress}
                                    onChange={handleInputChange}
                                    required
                                    InputProps={{
                                        startAdornment: <FaMapMarkerAlt style={{ marginRight: 8, color: "#666" }} />,
                                    }}
                                />
                            </Grid>

                            {/* Адрес доставки */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Адрес доставки"
                                    name="deliveryAddress"
                                    value={formData.deliveryAddress}
                                    onChange={handleInputChange}
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
                                    size="large"
                                    startIcon={<FaPlus />}
                                    sx={{ textTransform: "none", fontWeight: "bold" }}
                                >
                                    Создать заказ
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </StyledCard>
        </Box>
    );
};