import React, { useEffect, useState } from "react";
import { CargoAPI, ClientAPI, DriverAPI, VehicleAPI, OrderAPI } from "../api/Api"; // Предполагаем, что API настроены
import { Card, Button, Row, Col, Typography, Form, Select, Input, InputNumber, Space } from "antd"; // Импортируем компоненты Ant Design
import { FaUser, FaBox, FaTruck, FaMapMarkerAlt, FaPlus } from "react-icons/fa"; // Иконки

const { Title, Text } = Typography;
const { Option } = Select;

export const CreateOrderPage = () => {
    const [users, setUsers] = useState([]); // Список всех пользователей
    const [drivers, setDrivers] = useState([]); // Список всех водителей
    const [vehicles, setVehicles] = useState([]); // Список всех транспортных средств
    const [form] = Form.useForm(); // Форма для создания заказа

    // Загружаем список пользователей, водителей и транспортных средств при монтировании компонента
    useEffect(() => {
        // Загружаем список пользователей
        ClientAPI.getAllClients()
            .then((response) => {
                setUsers(response.data); // Предполагаем, что данные находятся в response.data
            })
            .catch((error) => {
                console.error("Ошибка при получении списка пользователей:", error);
            });

        // Загружаем список водителей
        DriverAPI.getAllDrivers()
            .then((response) => {
                setDrivers(response.data); // Предполагаем, что данные находятся в response.data
            })
            .catch((error) => {
                console.error("Ошибка при получении списка водителей:", error);
            });

        // Загружаем список транспортных средств
        VehicleAPI.getAllVehicles()
            .then((response) => {
                setVehicles(response.data); // Предполагаем, что данные находятся в response.data
            })
            .catch((error) => {
                console.error("Ошибка при получении списка транспортных средств:", error);
            });
    }, []);

    // Обработчик отправки формы
    const handleSubmit = (values) => {
        // Преобразуем clientId и recipientId в числа
        const payload = {
            ...values,
            clientId: parseInt(values.clientId, 10),
            recipientId: parseInt(values.recipientId, 10),
            driverId: parseInt(values.driverId, 10),
            vehicleId: parseInt(values.vehicleId, 10),
        };

        // Создаем груз
        CargoAPI.createCargo({
            clientId: payload.clientId,
            recipientId: payload.recipientId,
            description: payload.description,
            weight: payload.weight,
            volume: payload.volume,
            pickupAddress: payload.pickupAddress,
            deliveryAddress: payload.deliveryAddress,
        })
            .then((response) => {
                // Создаем заказ
                OrderAPI.createOrder({
                    cargoId: response.data.id,
                    driverId: payload.driverId,
                    vehicleId: payload.vehicleId,
                    status: "PENDING",
                })
                    .then(() => {
                        console.log("Заказ успешно создан:", response.data);
                        alert("Заказ успешно создан!");
                        // Очищаем форму после успешного создания
                        form.resetFields();
                    })
                    .catch(() => {
                        alert("Ошибка при создании заказа. Пожалуйста, попробуйте снова.");
                    });
            })
            .catch(() => {
                alert("Ошибка при создании заказа. Пожалуйста, попробуйте снова.");
            });
    };

    return (
        <div style={{ padding: "24px", background: "linear-gradient(135deg, #f5f7fa, #e6e9ef)", minHeight: "100vh" }}>
            {/* Заголовок */}
            <Title level={2} style={{ color: "#2c3e50", fontWeight: "bold", marginBottom: "24px" }}>
                <FaBox /> Создание нового заказа
            </Title>

            {/* Форма для создания заказа */}
            <Card
                style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", marginBottom: "24px" }}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Row gutter={[16, 16]}>
                        {/* Выбор клиента */}
                        <Col xs={24} md={12}>
                            <Form.Item name="clientId" label="Клиент" rules={[{ required: true }]}>
                                <Select placeholder="Выберите клиента">
                                    {users.map((user) => (
                                        <Option key={user.id} value={user.id}>
                                            <FaUser /> {user.name} (ID: {user.id})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* Выбор получателя */}
                        <Col xs={24} md={12}>
                            <Form.Item name="recipientId" label="Получатель" rules={[{ required: true }]}>
                                <Select placeholder="Выберите получателя">
                                    {users.map((user) => (
                                        <Option key={user.id} value={user.id}>
                                            <FaUser /> {user.name} (ID: {user.id})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* Описание заказа */}
                        <Col xs={24}>
                            <Form.Item name="description" label="Описание заказа" rules={[{ required: true }]}>
                                <Input placeholder="Введите описание заказа" />
                            </Form.Item>
                        </Col>

                        {/* Вес */}
                        <Col xs={24} md={12}>
                            <Form.Item name="weight" label="Вес (кг)" rules={[{ required: true }]}>
                                <InputNumber
                                    style={{ width: "100%" }}
                                    min={0}
                                    placeholder="Введите вес"
                                />
                            </Form.Item>
                        </Col>

                        {/* Объем */}
                        <Col xs={24} md={12}>
                            <Form.Item name="volume" label="Объем (м³)" rules={[{ required: true }]}>
                                <InputNumber
                                    style={{ width: "100%" }}
                                    min={0}
                                    placeholder="Введите объем"
                                />
                            </Form.Item>
                        </Col>

                        {/* Адрес отправки */}
                        <Col xs={24} md={12}>
                            <Form.Item name="pickupAddress" label="Адрес отправки" rules={[{ required: true }]}>
                                <Input
                                    placeholder="Введите адрес отправки"
                                    prefix={<FaMapMarkerAlt style={{ color: "#666" }} />}
                                />
                            </Form.Item>
                        </Col>

                        {/* Адрес доставки */}
                        <Col xs={24} md={12}>
                            <Form.Item name="deliveryAddress" label="Адрес доставки" rules={[{ required: true }]}>
                                <Input
                                    placeholder="Введите адрес доставки"
                                    prefix={<FaMapMarkerAlt style={{ color: "#666" }} />}
                                />
                            </Form.Item>
                        </Col>

                        {/* Выбор водителя */}
                        <Col xs={24} md={12}>
                            <Form.Item name="driverId" label="Водитель" rules={[{ required: true }]}>
                                <Select placeholder="Выберите водителя">
                                    {drivers.map((driver) => (
                                        <Option key={driver.id} value={driver.id}>
                                            <FaUser /> {driver.name} (ID: {driver.id})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* Выбор транспортного средства */}
                        <Col xs={24} md={12}>
                            <Form.Item name="vehicleId" label="Транспортное средство" rules={[{ required: true }]}>
                                <Select placeholder="Выберите транспортное средство">
                                    {vehicles.map((vehicle) => (
                                        <Option key={vehicle.id} value={vehicle.id}>
                                            <FaTruck /> {vehicle.licensePlate} (ID: {vehicle.id})
                                        </Option>
                                    ))}
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
                                Создать заказ
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
};