import React from "react";
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Chip,
    Paper,
    Box,
    Divider,
    Stack,
    Avatar,
} from "@mui/material";
import {
    FaBox,
    FaWeightHanging,
    FaRuler,
    FaMapMarkerAlt,
    FaUser,
    FaTruck,
    FaHistory,
} from "react-icons/fa";

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

const OrderTracking = ({ orderData }) => {
    if (!orderData || orderData.length === 0) {
        return <Typography>Нет данных о заказе.</Typography>;
    }

    const order = orderData[0].order;
    const sortedStatuses = [...orderData].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    return (
        <Card sx={{ borderRadius: 3, boxShadow: 4, p: 2, mt: 3 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FaBox /> Заказ #{order.id}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <FaWeightHanging /> <b>Вес:</b> {order.cargo.weight} кг
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <FaRuler /> <b>Объем:</b> {order.cargo.volume} м³
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <FaMapMarkerAlt /> <b>Откуда:</b> {order.cargo.pickupAddress}
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <FaMapMarkerAlt /> <b>Куда:</b> {order.cargo.deliveryAddress}
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 24, height: 24 }} /> <b>Отправитель:</b> {order.cargo.client.name} ({order.cargo.client.phone})
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 24, height: 24 }} /> <b>Получатель:</b> {order.cargo.recipient.name} ({order.cargo.recipient.phone})
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <b>Статус заказа:</b>
                        <Chip label={translateOrderStatus(order.status)} color="primary" />
                    </Box>
                </Stack>

                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <FaHistory /> История статусов
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <List>
                        {sortedStatuses.map((track, index) => (
                            <ListItem
                                key={track.id}
                                divider={index !== sortedStatuses.length - 1}
                                sx={{ transition: "background-color 0.3s", "&:hover": { backgroundColor: "action.hover" } }}
                            >
                                <ListItemText
                                    primary={<b>{track.location}</b>}
                                    secondary={new Date(track.timestamp).toLocaleString()}
                                />
                                <Chip label={translateOrderStatus(track.status)} color="secondary" />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </CardContent>
        </Card>
    );
};

export default OrderTracking;
