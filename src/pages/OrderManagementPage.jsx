import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Для получения ID заказа
import {getVehicleStatusOrType, OrderAPI, OrderTrackingAPI} from "../api/Api"; // Предполагаем, что API для заказов и отслеживания уже настроены
import { Card, Button, Row, Col, Typography, Tag, Form, Select, Input, List, Avatar, Divider, Space } from "antd"; // Импортируем компоненты Ant Design
import {
    FaBox,
    FaUser,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaTruck,
    FaIdCard,
    FaCar,
    FaShippingFast,
    FaEnvelope, FaPhone
} from "react-icons/fa"; // Иконки
import { translateOrderStatus } from "./OrderTracking";

const { Title, Text } = Typography;
const { Option } = Select;

export const OrderManagementPage = () => {
    const { orderId } = useParams(); // Получаем ID заказа из URL
    const [order, setOrder] = useState(null); // Данные о заказе
    const [statusHistory, setStatusHistory] = useState([]); // Список истории статусов
    const [form] = Form.useForm(); // Форма для добавления статуса

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

    // Обработчик отправки формы статуса
    const handleStatusSubmit = (values) => {
        // Отправляем данные на сервер
        OrderTrackingAPI.createOrderTracking({
            orderId: parseInt(orderId, 10),
            ...values,
        })
            .then((response) => {
                console.log("Статус успешно добавлен:", response.data);
                // Обновляем список истории статусов
                setStatusHistory((prevStatusHistory) => [...prevStatusHistory, response.data]);
                // Очищаем форму после успешного создания
                form.resetFields();
            })
            .catch((error) => {
                console.error("Ошибка при добавлении статуса:", error);
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
        <div style={{ padding: "24px", background: "linear-gradient(135deg, #f5f7fa, #e6e9ef)", minHeight: "100vh" }}>
            {/* Заголовок */}
            <Title level={2} style={{ color: "#2c3e50", fontWeight: "bold", marginBottom: "24px" }}>
                <FaBox /> Номер заказа: {order.id}
            </Title>

            {/* Информация о заказе */}
            <Card
                style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", marginBottom: "24px" }}
            >
                <Title level={4} style={{ color: "#34495e", marginBottom: "16px" }}>
                    Информация о заказе
                </Title>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    {/* Статус заказа */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Статус:
                        </Text>
                        <Select
                            value={order.status}
                            onChange={handleOrderStatusChange}
                            style={{ width: "150px" }}
                        >
                            <Option value="PENDING">В ожидании</Option>
                            <Option value="IN_TRANSIT">В пути</Option>
                            <Option value="DELIVERED">Доставлен</Option>
                            <Option value="CANCELED">Отменен</Option>
                        </Select>
                    </div>

                    {/* Описание заказа */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaBox />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Описание:
                        </Text>
                        <Text>{order.cargo.description}</Text>
                    </div>

                    {/* Вес и объем груза */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <FaShippingFast />
                            <Text strong style={{ color: "#7f8c8d" }}>
                                Вес:
                            </Text>
                            <Text>{order.cargo.weight} кг</Text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <FaShippingFast />
                            <Text strong style={{ color: "#7f8c8d" }}>
                                Объем:
                            </Text>
                            <Text>{order.cargo.volume} м³</Text>
                        </div>
                    </div>

                    {/* Адрес забора и доставки */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <FaMapMarkerAlt />
                            <Text strong style={{ color: "#7f8c8d" }}>
                                Адрес отправки:
                            </Text>
                            <Text>{order.cargo.pickupAddress}</Text>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <FaMapMarkerAlt />
                            <Text strong style={{ color: "#7f8c8d" }}>
                                Адрес доставки:
                            </Text>
                            <Text>{order.cargo.deliveryAddress}</Text>
                        </div>
                    </div>

                    {/* Клиент */}
                    <Divider />
                    <Title level={5} style={{ color: "#34495e" }}>
                        <FaUser /> Клиент
                    </Title>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaIdCard />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Имя:
                        </Text>
                        <Text>{order.cargo.client.name}</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaEnvelope />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Email:
                        </Text>
                        <Text>{order.cargo.client.email}</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaPhone />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Телефон:
                        </Text>
                        <Text>{order.cargo.client.phone}</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaMapMarkerAlt />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Адрес:
                        </Text>
                        <Text>{order.cargo.client.address}</Text>
                    </div>

                    {/* Получатель */}
                    <Divider />
                    <Title level={5} style={{ color: "#34495e" }}>
                        <FaUser /> Получатель
                    </Title>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaIdCard />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Имя:
                        </Text>
                        <Text>{order.cargo.recipient.name}</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaEnvelope />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Email:
                        </Text>
                        <Text>{order.cargo.recipient.email}</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaPhone />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Телефон:
                        </Text>
                        <Text>{order.cargo.recipient.phone}</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaMapMarkerAlt />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Адрес:
                        </Text>
                        <Text>{order.cargo.recipient.address}</Text>
                    </div>

                    {/* Водитель */}
                    <Divider />
                    <Title level={5} style={{ color: "#34495e" }}>
                        <FaUser /> Водитель
                    </Title>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaIdCard />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Имя:
                        </Text>
                        <Text>{order.driver.name}</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaPhone />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Телефон:
                        </Text>
                        <Text>{order.driver.phone}</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaEnvelope />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Email:
                        </Text>
                        <Text>{order.driver.email}</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaIdCard />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Номер лицензии:
                        </Text>
                        <Text>{order.driver.licenseNumber}</Text>
                    </div>

                    {/* Транспортное средство */}
                    <Divider />
                    <Title level={5} style={{ color: "#34495e" }}>
                        <FaCar /> Транспортное средство
                    </Title>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaIdCard />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Номер:
                        </Text>
                        <Text>{order.vehicle.licensePlate}</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaCar />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Тип:
                        </Text>
                        <Text>{getVehicleStatusOrType(order.vehicle.type)}</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaShippingFast />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Вместимость:
                        </Text>
                        <Text>{order.vehicle.capacity} кг</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaMapMarkerAlt />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Статус:
                        </Text>
                        <Text>{getVehicleStatusOrType(order.vehicle.status)}</Text>
                    </div>

                    {/* Даты */}
                    <Divider />
                    <Title level={5} style={{ color: "#34495e" }}>
                        <FaCalendarAlt /> Даты
                    </Title>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaCalendarAlt />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Дата заказа:
                        </Text>
                        <Text>{new Date(order.orderDate).toLocaleDateString()}</Text>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaCalendarAlt />
                        <Text strong style={{ color: "#7f8c8d" }}>
                            Дата отправки:
                        </Text>
                        <Text>{order.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : "Не указана"}</Text>
                    </div>
                </Space>
            </Card>

            {/* Форма для добавления статуса */}
            <Card
                style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", marginBottom: "24px" }}
            >
                <Title level={4} style={{ color: "#34495e", marginBottom: "16px" }}>
                    Добавить статус
                </Title>
                <Form form={form} onFinish={handleStatusSubmit} layout="vertical">
                    <Row gutter={[16, 16]}>
                        {/* Статус */}
                        <Col xs={24} md={12}>
                            <Form.Item name="status" label="Статус" rules={[{ required: true }]}>
                                <Select placeholder="Выберите статус">
                                    <Option value="PENDING">В ожидании</Option>
                                    <Option value="IN_TRANSIT">В пути</Option>
                                    <Option value="DELIVERED">Доставлен</Option>
                                    <Option value="CANCELED">Отменен</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* Местоположение */}
                        <Col xs={24} md={12}>
                            <Form.Item name="location" label="Местоположение" rules={[{ required: true }]}>
                                <Input
                                    placeholder="Введите местоположение"
                                    prefix={<FaMapMarkerAlt style={{ color: "#666" }} />}
                                />
                            </Form.Item>
                        </Col>

                        {/* Кнопка отправки */}
                        <Col xs={24}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<FaTruck />}
                                style={{ fontWeight: "bold" }}
                            >
                                Добавить статус
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            {/* История статусов */}
            <Card style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
                <Title level={4} style={{ color: "#34495e", marginBottom: "16px" }}>
                    История статусов
                </Title>
                <List
                    dataSource={statusHistory}
                    renderItem={(status) => (
                        <List.Item
                            style={{ borderBottom: "1px solid #eee", padding: "12px 0" }}
                            actions={[
                                <Select
                                    value={status.status}
                                    onChange={(value) => handleStatusHistoryChange(status.id, value)}
                                    style={{ width: "120px" }}
                                >
                                    <Option value="PENDING">В ожидании</Option>
                                    <Option value="IN_TRANSIT">В пути</Option>
                                    <Option value="DELIVERED">Доставлен</Option>
                                    <Option value="CANCELED">Отменен</Option>
                                </Select>,
                            ]}
                        >
                            <List.Item.Meta
                                title={`Статус: ${translateOrderStatus(status.status)}`}
                                description={`Местоположение: ${status.location} | Дата: ${new Date(status.timestamp).toLocaleString()}`}
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};