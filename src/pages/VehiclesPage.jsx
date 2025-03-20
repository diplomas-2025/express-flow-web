import React, { useEffect, useState } from "react";
import {getVehicleStatusOrType, VehicleAPI} from "../api/Api"; // Предполагаем, что API для транспортных средств уже настроен
import { Card, Button, Row, Col, Typography, Form, Select, Input, InputNumber, List, Space, Tag } from "antd"; // Импортируем компоненты Ant Design
import { FaCar, FaPlus } from "react-icons/fa"; // Иконки

const { Title, Text } = Typography;
const { Option } = Select;

export const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]); // Список транспортных средств
    const [form] = Form.useForm(); // Форма для добавления транспортного средства

    // Загружаем список транспортных средств при монтировании компонента
    useEffect(() => {
        fetchVehicles();
    }, []);

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

    // Обработчик отправки формы добавления транспортного средства
    const handleAddVehicle = (values) => {
        VehicleAPI.createVehicle(values)
            .then((response) => {
                console.log("Транспортное средство успешно добавлено:", response.data);
                fetchVehicles(); // Обновляем список
                form.resetFields(); // Очищаем форму
            })
            .catch((error) => {
                console.error("Ошибка при добавлении транспортного средства:", error);
            });
    };

    // Обработчик изменения статуса транспортного средства
    const handleStatusChange = (vehicleId, newStatus) => {
        VehicleAPI.updateVehicleStatus(vehicleId, newStatus)
            .then((response) => {
                console.log("Статус успешно обновлен:", response.data);
                fetchVehicles(); // Обновляем список
            })
            .catch((error) => {
                console.error("Ошибка при обновлении статуса:", error);
            });
    };

    return (
        <div style={{ padding: "24px", background: "linear-gradient(135deg, #f5f7fa, #e6e9ef)", minHeight: "100vh" }}>
            {/* Заголовок */}
            <Title level={2} style={{ color: "#2c3e50", fontWeight: "bold", marginBottom: "24px" }}>
                <FaCar /> Управление транспортными средствами
            </Title>

            {/* Форма для добавления транспортного средства */}
            <Card
                style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", marginBottom: "24px" }}
            >
                <Title level={4} style={{ color: "#34495e", marginBottom: "16px" }}>
                    Добавить транспортное средство
                </Title>
                <Form form={form} onFinish={handleAddVehicle} layout="vertical">
                    <Row gutter={[16, 16]}>
                        {/* Номерной знак */}
                        <Col xs={24} md={12}>
                            <Form.Item name="licensePlate" label="Номерной знак" rules={[{ required: true }]}>
                                <Input placeholder="Введите номерной знак" />
                            </Form.Item>
                        </Col>

                        {/* Тип транспортного средства */}
                        <Col xs={24} md={12}>
                            <Form.Item name="type" label="Тип" rules={[{ required: true }]}>
                                <Select placeholder="Выберите тип">
                                    <Option value="TRUCK">Грузовик</Option>
                                    <Option value="VAN">Фургон</Option>
                                    <Option value="MOTORCYCLE">Мотоцикл</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* Вместимость */}
                        <Col xs={24} md={12}>
                            <Form.Item name="capacity" label="Вместимость (кг)" rules={[{ required: true }]}>
                                <InputNumber
                                    style={{ width: "100%" }}
                                    min={0}
                                    placeholder="Введите вместимость"
                                />
                            </Form.Item>
                        </Col>

                        {/* Статус */}
                        <Col xs={24} md={12}>
                            <Form.Item name="status" label="Статус" rules={[{ required: true }]}>
                                <Select placeholder="Выберите статус">
                                    <Option value="AVAILABLE">Доступен</Option>
                                    <Option value="IN_TRANSIT">В пути</Option>
                                    <Option value="UNDER_MAINTENANCE">На ремонте</Option>
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

            {/* Список транспортных средств */}
            <Card style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
                <Title level={4} style={{ color: "#34495e", marginBottom: "16px" }}>
                    Список транспортных средств
                </Title>
                <List
                    dataSource={vehicles}
                    renderItem={(vehicle) => (
                        <List.Item
                            style={{ borderBottom: "1px solid #eee", padding: "12px 0" }}
                            actions={[
                                <Select
                                    value={vehicle.status}
                                    onChange={(value) => handleStatusChange(vehicle.id, value)}
                                    style={{ width: "120px" }}
                                >
                                    <Option value="AVAILABLE">Доступен</Option>
                                    <Option value="IN_TRANSIT">В пути</Option>
                                    <Option value="UNDER_MAINTENANCE">На ремонте</Option>
                                </Select>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<FaCar style={{ fontSize: "24px", color: "#1890ff" }} />}
                                title={`${vehicle.licensePlate} (${getVehicleStatusOrType(vehicle.type)})`}
                                description={
                                    <Space direction="vertical" size="small">
                                        <Text>
                                            <b>Вместимость:</b> {vehicle.capacity} кг
                                        </Text>
                                        <Text>
                                            <b>Статус:</b>{" "}
                                            <Tag color={vehicle.status === "AVAILABLE" ? "green" : "orange"}>
                                                {getVehicleStatusOrType(vehicle.status)}
                                            </Tag>
                                        </Text>
                                        <Text>
                                            <b>Дата создания:</b> {new Date(vehicle.createdAt).toLocaleDateString()}
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