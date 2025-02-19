import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Tabs,
    Tab,
} from '@mui/material';
import { AuthAPI, OrderTrackingAPI } from '../api/Api';
import { FaSearch, FaSignInAlt, FaTruck, FaUserPlus } from 'react-icons/fa'; // Иконки
import OrderTracking from './OrderTracking';
import {useNavigate} from "react-router-dom"; // Импортируем компонент

const MainPage = () => {
    const navigate = useNavigate()
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [trackingInfo, setTrackingInfo] = useState(null);
    const [tabValue, setTabValue] = useState(0); // Состояние для переключения между вкладками

    // Состояние для регистрации
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });

    // Функция для отслеживания заказа
    const handleTrackOrder = async () => {
        try {
            // Запрос к API для получения данных о заказе
            const response = await OrderTrackingAPI.getOrderTrackingByOrderId(orderNumber);
            setTrackingInfo(response.data); // Сохраняем данные в состоянии
        } catch (error) {
            console.error('Ошибка при получении данных о заказе:', error);
            alert('Не удалось получить информацию о заказе. Проверьте номер заказа.');
        }
    };

    // Функция для входа
    const handleLogin = () => {
        AuthAPI.signIn({ email, password })
            .then(() => {
                window.location.reload();
            })
            .catch(() => {
                alert('Неверный email или пароль');
            });
    };

    // Функция для регистрации
    const handleRegister = () => {
        AuthAPI.signUp(registerData)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.error('Ошибка при регистрации:', error);
                alert('Ошибка при регистрации. Проверьте введенные данные.');
            });
    };

    // Обработчик изменения вкладки
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            {/* Заголовок */}
            <Typography
                variant="h3"
                component="h1"
                align="center"
                gutterBottom
                sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}
            >
                <FaTruck style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                Сервис доставки грузов
            </Typography>
            <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ color: 'text.secondary' }}>
                ООО «АвтоТансИндустрия»
            </Typography>

            {/* Блок отслеживания заказа */}
            <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FaSearch />
                        Отследить заказ
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Номер заказа"
                            variant="outlined"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleTrackOrder}
                            sx={{ height: '56px', borderRadius: 1 }}
                        >
                            Отследить
                        </Button>
                    </Box>
                    {trackingInfo && <OrderTracking orderData={trackingInfo} />}
                </CardContent>
            </Card>

            {/* Вкладки для входа и регистрации */}
            <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Tabs value={tabValue} onChange={handleTabChange} centered>
                        <Tab label="Вход" icon={<FaSignInAlt />} />
                        <Tab label="Регистрация" icon={<FaUserPlus />} />
                    </Tabs>

                    {tabValue === 0 && (
                        // Форма входа
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        variant="outlined"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Пароль"
                                        type="password"
                                        variant="outlined"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button fullWidth variant="contained" onClick={handleLogin} sx={{ borderRadius: 1 }}>
                                        Войти
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {tabValue === 1 && (
                        // Форма регистрации
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Имя"
                                        variant="outlined"
                                        value={registerData.name}
                                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                        sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        variant="outlined"
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Телефон"
                                        variant="outlined"
                                        value={registerData.phone}
                                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                        sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Пароль"
                                        type="password"
                                        variant="outlined"
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button fullWidth variant="contained" onClick={handleRegister} sx={{ borderRadius: 1 }}>
                                        Зарегистрироваться
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Информация о компании */}
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        О компании
                    </Typography>
                    <Typography paragraph>
                        ООО «АвтоТансИндустрия» — это современная компания, специализирующаяся на доставке грузов по всей России. Мы
                        предлагаем надежные и быстрые решения для ваших логистических потребностей.
                    </Typography>
                    <Typography paragraph>
                        Наши контакты: +7 (930) 312-12-32, email: info@avtotransindustry.ru
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default MainPage;