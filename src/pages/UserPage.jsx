import { Button as MateruaBut } from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import { OrderAPI, OrderTrackingAPI } from "../api/Api";
import { Card, Typography, Divider, Button, Select, List, Row, Col, Input, Tag, Space } from "antd";
import { FaBox, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import OrderTracking, { translateOrderStatus } from "./OrderTracking";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

export const UserPage = () => {
    const [orders, setOrders] = useState([]);
    const [orderNumber, setOrderNumber] = useState("");
    const [trackingInfo, setTrackingInfo] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [statusFilter, setStatusFilter] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        OrderAPI.getAllOrders()
            .then((response) => {
                setOrders(response.data);
                setFilteredOrders(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при получении данных о заказах:", error);
            });
    }, []);

    useEffect(() => {
        let filteredData = orders;

        if (statusFilter) {
            filteredData = filteredData.filter((order) => order.status === statusFilter);
        }

        filteredData.sort((a, b) => {
            if (sortOrder === "asc") {
                return new Date(a.orderDate) - new Date(b.orderDate);
            } else {
                return new Date(b.orderDate) - new Date(a.orderDate);
            }
        });

        const userId = localStorage.getItem("userId");
        filteredData = filteredData.filter((order) => {
            return order.cargo.client.id == userId || order.cargo.recipient.id == userId;
        });

        setFilteredOrders(filteredData);
    }, [statusFilter, sortOrder, orders]);

    const handleTrackOrder = (orderId) => {
        setTrackingInfo(null);
        OrderTrackingAPI.getOrderTrackingByOrderId(orderId)
            .then((response) => {
                setTrackingInfo(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при получении информации об отслеживании заказа:", error);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        window.location.reload();
    };

    return (
        <div style={{ padding: 24 }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>
                    Мои заказы
                </Title>
                <Button type="primary" danger onClick={handleLogout}>
                    Выход
                </Button>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Select
                        placeholder="Фильтр по статусу"
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                        style={{ width: "100%" }}
                    >
                        <Option value="">Все</Option>
                        <Option value="PENDING">В ожидании</Option>
                        <Option value="IN_TRANSIT">В пути</Option>
                        <Option value="DELIVERED">Доставлен</Option>
                        <Option value="CANCELED">Отменен</Option>
                    </Select>
                </Col>
                <Col span={12}>
                    <Select
                        placeholder="Сортировка"
                        value={sortOrder}
                        onChange={(value) => setSortOrder(value)}
                        style={{ width: "100%" }}
                    >
                        <Option value="asc">По дате (по возрастанию)</Option>
                        <Option value="desc">По дате (по убыванию)</Option>
                    </Select>
                </Col>
            </Row>

            <Card
                title={
                    <Space>
                        <FaSearch />
                        <Text strong>Отследить заказ</Text>
                    </Space>
                }
                style={{ marginBottom: 24 }}
            >
                <Row gutter={16}>
                    <Col flex="auto">
                        <Input
                            placeholder="Номер заказа"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Button type="primary" onClick={() => handleTrackOrder(orderNumber)}>
                            Отследить
                        </Button>
                    </Col>
                </Row>
                {trackingInfo && <OrderTracking orderData={trackingInfo} />}
            </Card>

            <List
                dataSource={filteredOrders}
                renderItem={(order) => (
                    <Card
                        key={order.id}
                        style={{ marginBottom: 16, cursor: "pointer" }}
                        onClick={() => {
                            setOrderNumber(order.id);
                            handleTrackOrder(order.id);
                        }}
                    >
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Title level={5} style={{ margin: 0 }}>
                                    <FaBox /> Заказ #{order.id}
                                </Title>
                            </Col>
                            <Col>
                                <Tag color="blue">{translateOrderStatus(order.status)}</Tag>
                            </Col>
                        </Row>
                        <Divider style={{ margin: "12px 0" }} />
                        <Row gutter={16}>
                            <Col span={12}>
                                <Text strong>
                                    <FaMapMarkerAlt /> Откуда:
                                </Text>{" "}
                                {order.cargo.pickupAddress}
                            </Col>
                            <Col span={12}>
                                <Text strong>
                                    <FaMapMarkerAlt /> Куда:
                                </Text>{" "}
                                {order.cargo.deliveryAddress}
                            </Col>
                            <Col span={24}>
                                <Text strong>Вес:</Text> {order.cargo.weight} кг,{" "}
                                <Text strong>Объем:</Text> {order.cargo.volume} м³
                            </Col>
                        </Row>
                    </Card>
                )}
            />
        </div>
    );
};

export const StyledButton = styled(MateruaBut)(({ theme }) => ({
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1.5),
    fontWeight: "bold",
    textTransform: "none",
}));
