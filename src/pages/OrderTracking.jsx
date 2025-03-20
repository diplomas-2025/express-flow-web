import React from "react";
import { Card, Progress, Timeline, Typography, Space } from "antd";
import {
    FaBox,
    FaMapMarkerAlt,
    FaUser,
    FaTruck,
    FaWeightHanging,
    FaRuler,
} from "react-icons/fa";

const { Title, Text } = Typography;

export const translateOrderStatus = (status) => {
    switch (status) {
        case 'PENDING':
            return 'Ожидание';
        case 'IN_TRANSIT':
            return 'В пути';
        case 'DELIVERED':
            return 'Доставлен';
        case 'CANCELED':
            return 'Отменен';
        default:
            return status;
    }
};

const statusToProgress = {
    PENDING: 25,
    IN_TRANSIT: 50,
    DELIVERED: 100,
    CANCELED: 0,
};

const OrderTracking = ({ orderData }) => {
    if (!orderData || orderData.length === 0) {
        return <Text>Нет данных о заказе.</Text>;
    }

    const order = orderData[0].order;
    const sortedStatuses = [...orderData].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    return (
        <Card style={{ borderRadius: 12, padding: 20, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
            <Title level={3} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FaBox /> Заказ #{order.id}
            </Title>

            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Progress percent={statusToProgress[order.status]} status={order.status === "CANCELED" ? "exception" : "active"} />

                <Timeline>
                    {sortedStatuses.map((track, index) => (
                        <Timeline.Item key={index}>
                            <Text strong>{translateOrderStatus(track.status)}</Text> – {new Date(track.timestamp).toLocaleString()} ({track.location})
                        </Timeline.Item>
                    ))}
                </Timeline>

                <Card type="inner" title="Детали заказа">
                    <Text><FaWeightHanging /> Вес: {order.cargo.weight} кг</Text><br />
                    <Text><FaRuler /> Объем: {order.cargo.volume} м³</Text><br />
                    <Text><FaMapMarkerAlt /> Откуда: {order.cargo.pickupAddress}</Text><br />
                    <Text><FaMapMarkerAlt /> Куда: {order.cargo.deliveryAddress}</Text><br />
                    <Text><FaUser /> Отправитель: {order.cargo.client.name} ({order.cargo.client.phone})</Text><br />
                    <Text><FaUser /> Получатель: {order.cargo.recipient.name} ({order.cargo.recipient.phone})</Text>
                </Card>

                <Card type="inner" title="Информация о транспорте">
                    <Text><FaTruck /> Водитель: {order.driver.name} ({order.driver.phone})</Text><br />
                    <Text><FaTruck /> Транспорт: {order.vehicle.licensePlate} ({order.vehicle.type})</Text><br />
                    <Text><FaTruck /> Грузоподъемность: {order.vehicle.capacity} кг</Text>
                </Card>
            </Space>
        </Card>
    );
};

export default OrderTracking;