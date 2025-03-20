import React, { useEffect, useState } from "react";
import {DriverAPI, getVehicleStatusOrType, VehicleAPI} from "../api/Api"; // Предполагаем, что API для водителей и транспортных средств уже настроены
import { Card, Button, Row, Col, Typography, Form, Select, Input, List, Space, Tag } from "antd"; // Импортируем компоненты Ant Design
import { FaUser, FaPlus, FaCar } from "react-icons/fa"; // Иконки

const { Title, Text } = Typography;
const { Option } = Select;

// Функция для получения перевода статуса
export function getDriverStatus(value) {
    const statuses = {
        ACTIVE: "Активен",
        INACTIVE: "Неактивен",
        ON_LEAVE: "В отпуске",
        SUSPENDED: "Отстранен",
    };

    return statuses[value] || value; // Если не найдено соответствие, возвращаем исходное значение
}

export const DriversPage = () => {
    const [drivers, setDrivers] = useState([]); // Список водителей
    const [vehicles, setVehicles] = useState([]); // Список транспортных средств
    const [form] = Form.useForm(); // Форма для добавления водителя

    // Загружаем список водителей и транспортных средств при монтировании компонента
    useEffect(() => {
        fetchDrivers();
        fetchVehicles();
    }, []);

    // Функция для загрузки списка водителей
    const fetchDrivers = () => {
        DriverAPI.getAllDrivers()
            .then((response) => {
                setDrivers(response.data); // Предполагаем, что данные находятся в response.data
            })
            .catch((error) => {
                console.error("Ошибка при получении списка водителей:", error);
            });
    };

    // Функция для загрузки списка транспортных средств
    const fetchVehicles = () => {
        VehicleAPI.getAllVehicles()
            .then((response) => {
                setVehicles(response.data); // Предполагаем, что данные находятся в response.data
            })
            .catch((error) => {
                console.error("Ошибка при получении списка транспортных средств:", error);
            });
    };

    // Обработчик отправки формы добавления водителя
    const handleAddDriver = (values) => {
        DriverAPI.createDriver(values)
            .then((response) => {
                console.log("Водитель успешно добавлен:", response.data);
                fetchDrivers(); // Обновляем список
                form.resetFields(); // Очищаем форму
            })
            .catch((error) => {
                console.error("Ошибка при добавлении водителя:", error);
            });
    };

    // Обработчик изменения статуса водителя
    const handleStatusChange = (driverId, newStatus) => {
        DriverAPI.updateDriverStatus(driverId, newStatus)
            .then((response) => {
                console.log("Статус успешно обновлен:", response.data);
                fetchDrivers(); // Обновляем список
            })
            .catch((error) => {
                console.error("Ошибка при обновлении статуса:", error);
            });
    };

    return (
        <div style={{ padding: "24px", background: "linear-gradient(135deg, #f5f7fa, #e6e9ef)", minHeight: "100vh" }}>
            {/* Заголовок */}
            <Title level={2} style={{ color: "#2c3e50", fontWeight: "bold", marginBottom: "24px" }}>
                <FaUser /> Управление водителями
            </Title>

            {/* Форма для добавления водителя */}
            <Card
                style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", marginBottom: "24px" }}
            >
                <Title level={4} style={{ color: "#34495e", marginBottom: "16px" }}>
                    Добавить водителя
                </Title>
                <Form form={form} onFinish={handleAddDriver} layout="vertical">
                    <Row gutter={[16, 16]}>
                        {/* Имя */}
                        <Col xs={24} md={12}>
                            <Form.Item name="name" label="Имя" rules={[{ required: true }]}>
                                <Input placeholder="Введите имя" />
                            </Form.Item>
                        </Col>

                        {/* Телефон */}
                        <Col xs={24} md={12}>
                            <Form.Item name="phone" label="Телефон" rules={[{ required: true }]}>
                                <Input placeholder="Введите телефон" />
                            </Form.Item>
                        </Col>

                        {/* Email */}
                        <Col xs={24} md={12}>
                            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                                <Input placeholder="Введите email" />
                            </Form.Item>
                        </Col>

                        {/* Номер лицензии */}
                        <Col xs={24} md={12}>
                            <Form.Item name="licenseNumber" label="Номер лицензии" rules={[{ required: true }]}>
                                <Input placeholder="Введите номер лицензии" />
                            </Form.Item>
                        </Col>

                        {/* Транспортное средство */}
                        <Col xs={24} md={12}>
                            <Form.Item name="vehicleId" label="Транспортное средство" rules={[{ required: true }]}>
                                <Select placeholder="Выберите транспортное средство">
                                    {vehicles.map((vehicle) => (
                                        <Option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.licensePlate} ({getVehicleStatusOrType(vehicle.type)})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* Статус */}
                        <Col xs={24} md={12}>
                            <Form.Item name="status" label="Статус" rules={[{ required: true }]}>
                                <Select placeholder="Выберите статус">
                                    <Option value="ACTIVE">Активен</Option>
                                    <Option value="INACTIVE">Неактивен</Option>
                                    <Option value="ON_LEAVE">В отпуске</Option>
                                    <Option value="SUSPENDED">Отстранен</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* Кнопка отправки */}
                        <Col xs={24}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<FaPlus />}
                                style={{ fontWeight: "bold" }}
                            >
                                Добавить
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            {/* Список водителей */}
            <Card style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
                <Title level={4} style={{ color: "#34495e", marginBottom: "16px" }}>
                    Список водителей
                </Title>
                <List
                    dataSource={drivers}
                    renderItem={(driver) => (
                        <List.Item
                            style={{ borderBottom: "1px solid #eee", padding: "12px 0" }}
                            actions={[
                                <Select
                                    value={driver.status}
                                    onChange={(value) => handleStatusChange(driver.id, value)}
                                    style={{ width: "120px" }}
                                >
                                    <Option value="ACTIVE">Активен</Option>
                                    <Option value="INACTIVE">Неактивен</Option>
                                    <Option value="ON_LEAVE">В отпуске</Option>
                                    <Option value="SUSPENDED">Отстранен</Option>
                                </Select>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<FaUser style={{ fontSize: "24px", color: "#1890ff" }} />}
                                title={driver.name}
                                description={
                                    <Space direction="vertical" size="small">
                                        <Text>
                                            <b>Телефон:</b> {driver.phone}
                                        </Text>
                                        <Text>
                                            <b>Email:</b> {driver.email}
                                        </Text>
                                        <Text>
                                            <b>Номер лицензии:</b> {driver.licenseNumber}
                                        </Text>
                                        <Text>
                                            <b>Транспортное средство:</b>{" "}
                                            {driver.vehicle ? (
                                                <Tag color="blue">
                                                    {driver.vehicle.licensePlate} ({getVehicleStatusOrType(driver.vehicle.type)})
                                                </Tag>
                                            ) : (
                                                "Не назначено"
                                            )}
                                        </Text>
                                        <Text>
                                            <b>Статус:</b>{" "}
                                            <Tag color={driver.status === "ACTIVE" ? "green" : "orange"}>
                                                {getDriverStatus(driver.status)}
                                            </Tag>
                                        </Text>
                                        <Text>
                                            <b>Дата создания:</b> {new Date(driver.createdAt).toLocaleDateString()}
                                        </Text>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};