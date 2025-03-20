import React, { useState } from 'react';
import { Button, Card, Input, Space, Typography, message } from 'antd';
import { SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { OrderTrackingAPI } from '../api/Api';
import OrderTracking from './OrderTracking';

const { Title, Text } = Typography;

const TrackOrderScreen = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [trackingInfo, setTrackingInfo] = useState(null);
    const navigate = useNavigate();

    const handleTrackOrder = async () => {
        try {
            const response = await OrderTrackingAPI.getOrderTrackingByOrderId(orderNumber);
            setTrackingInfo(response.data);
        } catch (error) {
            console.error('Ошибка при получении данных о заказе:', error);
            message.error('Не удалось получить информацию о заказе. Проверьте номер заказа.');
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/')}
                style={{ marginBottom: 16 }}
            >
                На главную
            </Button>

            <Card
                title={
                    <Title level={3} style={{ margin: 0 }}>
                        <SearchOutlined /> Отследить заказ
                    </Title>
                }
                style={{ borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            >
                <Space.Compact style={{ width: '100%' }}>
                    <Input
                        placeholder="Номер заказа"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        style={{ borderRadius: 8 }}
                    />
                    <Button type="primary" onClick={handleTrackOrder} style={{ borderRadius: 8 }}>
                        Отследить
                    </Button>
                </Space.Compact>
                {trackingInfo && <OrderTracking orderData={trackingInfo} />}
            </Card>
        </div>
    );
};

export default TrackOrderScreen;