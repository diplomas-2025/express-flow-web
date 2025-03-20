import React, { useEffect, useState } from "react";
import { OrderAPI } from "../api/Api"; // Предполагаем, что API для заказов уже настроен
import { useNavigate } from "react-router-dom"; // Для навигации между экранами
import { Card, Button, Row, Col, Typography, Tag, Space, Avatar, Divider } from "antd"; // Импортируем компоненты Ant Design
import { FaBox, FaUser, FaCalendarAlt, FaPlus, FaSignOutAlt } from "react-icons/fa"; // Иконки
import { translateOrderStatus } from "./OrderTracking";

const { Title, Text } = Typography;

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
        localStorage.removeItem("authToken"); // Удаляем токен из localStorage
        window.location.href = "/"; // Перенаправляем пользователя на страницу входа
    };

    return (
        <div style={{ padding: "24px", background: "linear-gradient(135deg, #f5f7fa, #e6e9ef)", minHeight: "100vh" }}>
            {/* Заголовок, кнопка создания заказа и кнопка выхода */}
            <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
                <Title level={2} style={{ color: "#2c3e50", fontWeight: "bold" }}>
                    Заказы
                </Title>
                <Space>
                    <div>
                        <Button
                            type="primary"
                            shape="round"
                            icon={<FaPlus />}
                            onClick={handleCreateOrderClick}
                            style={{ background: "#3498db", border: "none", fontWeight: "bold" }}
                        >
                            Новый заказ
                        </Button>

                        <Button
                            type="primary"
                            shape="round"
                            icon={<FaPlus />}
                            onClick={() => navigate("/vehicles")}
                            style={{ background: "#3498db", border: "none", fontWeight: "bold" }}
                        >
                            Транспортные средства
                        </Button>

                        <Button
                            type="primary"
                            shape="round"
                            icon={<FaPlus />}
                            onClick={() => navigate("/drivers")}
                            style={{ background: "#3498db", border: "none", fontWeight: "bold" }}
                        >
                            Водители
                        </Button>
                    </div>
                    <Button
                        type="default"
                        shape="round"
                        danger
                        icon={<FaSignOutAlt />}
                        onClick={handleLogout}
                        style={{ fontWeight: "bold" }}
                    >
                        Выйти
                    </Button>
                </Space>
            </Row>

            {/* Список заказов */}
            <Row gutter={[24, 24]}>
                {orders.map((order) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={order.id}>
                        <Card
                            hoverable
                            onClick={() => handleOrderClick(order.id)}
                            style={{
                                borderRadius: "12px",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                transition: "transform 0.2s, box-shadow 0.2s",
                                background: "#ffffff",
                                border: "none",
                            }}
                            bodyStyle={{ padding: "16px" }}
                        >
                            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                                <Title level={4} style={{ margin: 0, color: "#2c3e50" }}>
                                    Номер заказа: {order.id}
                                </Title>

                                {/* Статус заказа */}
                                <Tag
                                    color={
                                        order.status === "completed"
                                            ? "green"
                                            : order.status === "pending"
                                                ? "orange"
                                                : "red"
                                    }
                                    style={{ fontWeight: "bold", borderRadius: "12px" }}
                                >
                                    {translateOrderStatus(order.status)}
                                </Tag>

                                {/* Информация о клиенте и получателе */}
                                <Divider style={{ margin: "8px 0" }} />
                                <Text strong style={{ color: "#7f8c8d" }}>
                                    <FaUser /> Клиент:
                                </Text>
                                <Text style={{ display: "block", color: "#34495e" }}>
                                    {order.cargo.client.name} ({order.cargo.client.phone})
                                </Text>

                                <Text strong style={{ color: "#7f8c8d" }}>
                                    <FaUser /> Получатель:
                                </Text>
                                <Text style={{ display: "block", color: "#34495e" }}>
                                    {order.cargo.recipient.name} ({order.cargo.recipient.phone})
                                </Text>

                                {/* Дата заказа */}
                                <Divider style={{ margin: "8px 0" }} />
                                <Text strong style={{ color: "#7f8c8d" }}>
                                    <FaCalendarAlt /> Дата заказа:
                                </Text>
                                <Text style={{ display: "block", color: "#34495e" }}>
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </Text>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};