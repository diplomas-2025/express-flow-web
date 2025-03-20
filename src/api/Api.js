import axios from 'axios';

// Базовый URL API
const API_BASE_URL = 'https://spotdiff.ru/express-flow-api';

// Создаем экземпляр Axios с базовыми настройками
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Получаем токен из localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Добавляем токен в заголовки
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// Запросы для работы с заказами
const OrderAPI = {
    // Получить все заказы
    getAllOrders: () => api.get('/api/v1/orders'),

    // Получить заказ по ID
    getOrderById: (id) => api.get(`/api/v1/orders/${id}`),

    // Создать новый заказ
    createOrder: (orderData) => api.post('/api/v1/orders', orderData),

    // Обновить статус заказа
    updateOrderStatus: (id, status) =>
        api.put(`/api/v1/orders/${id}/status`, status),
};

// Запросы для работы с отслеживанием заказов
const OrderTrackingAPI = {
    // Получить все записи отслеживания
    getAllOrderTracking: () => api.get('/api/v1/order-tracking'),

    // Получить записи отслеживания по ID заказа
    getOrderTrackingByOrderId: (orderId) =>
        api.get(`/users/security/order-tracking/${orderId}`),

    // Получить детали записи отслеживания по ID
    getOrderTrackingById: (id) => api.get(`/api/v1/order-tracking/${id}/details`),

    // Создать новую запись отслеживания
    createOrderTracking: (trackingData) =>
        api.post('/api/v1/order-tracking', trackingData),

    // Обновить статус отслеживания
    updateOrderTrackingStatus: (id, status) =>
        api.put(`/api/v1/order-tracking/${id}/status`, status),
};

// Запросы для работы с транспортными средствами
const VehicleAPI = {
    // Получить все транспортные средства
    getAllVehicles: () => api.get('/api/v1/vehicles'),

    // Получить транспортное средство по ID
    getVehicleById: (id) => api.get(`/api/v1/vehicles/${id}`),

    // Создать новое транспортное средство
    createVehicle: (vehicleData) => api.post('/api/v1/vehicles', vehicleData),
    updateVehicleStatus: (vehicleId, newStatus) => api.patch('/api/v1/vehicles/' + vehicleId + "/status?status=" + newStatus),
};

// Запросы для работы с водителями
const DriverAPI = {
    // Получить всех водителей
    getAllDrivers: () => api.get('/api/v1/drivers'),

    // Получить водителя по ID
    getDriverById: (id) => api.get(`/api/v1/drivers/${id}`),

    // Создать нового водителя
    createDriver: (driverData) => api.post('/api/v1/drivers', driverData),
    updateDriverStatus: (driverId, newStatus) => api.patch(`/api/v1/drivers/${driverId}/status?status=${newStatus}`),
};

// Запросы для работы с клиентами
const ClientAPI = {
    // Получить всех клиентов
    getAllClients: () => api.get('/api/v1/clients'),

    // Получить клиента по ID
    getClientById: (id) => api.get(`/api/v1/clients/${id}`),

    // Создать нового клиента
    createClient: (clientData) => api.post('/api/v1/clients', clientData),
};

// Запросы для работы с грузами
const CargoAPI = {
    // Получить все грузы
    getAllCargo: () => api.get('/api/v1/cargo'),

    // Получить груз по ID
    getCargoById: (id) => api.get(`/api/v1/cargo/${id}`),

    // Создать новый груз
    createCargo: (cargoData) => api.post('/api/v1/cargo', cargoData),
};

// Запросы для аутентификации
const AuthAPI = {
    // Вход пользователя
    signIn: async (credentials) => {
        const response = await api.post('/users/security/sign-in', credentials);
        const { accessToken, isAdmin, userId } = response.data; // Предполагаем, что токен возвращается в поле accessToken
        localStorage.setItem('authToken', accessToken); // Сохраняем токен в localStorage
        localStorage.setItem('isAdmin', isAdmin); // Сохраняем токен в localStorage
        localStorage.setItem('userId', userId); // Сохраняем токен в localStorage
        return response.data; // Возвращаем данные ответа
    },

    signUp: async (data) => {
        const response = await api.post('/users/security/sign-up', data);
        const { accessToken, isAdmin, userId } = response.data; // Предполагаем, что токен возвращается в поле accessToken
        localStorage.setItem('authToken', accessToken); // Сохраняем токен в localStorage
        localStorage.setItem('isAdmin', isAdmin); // Сохраняем токен в localStorage
        localStorage.setItem('userId', userId); // Сохраняем токен в localStorage
        return response.data; // Возвращаем данные ответа
    },

    // Выход пользователя
    signOut: () => {
        localStorage.removeItem('authToken'); // Удаляем токен из localStorage
    },
};

const translateVehicleStatus = (status) => {
    switch (status) {
        case 'AVAILABLE':
            return 'Доступен';
        case 'IN_TRANSIT':
            return 'В пути';
        case 'UNDER_MAINTENANCE':
            return 'На обслуживании';
        default:
            return status;
    }
};

const translateVehicleType = (type) => {
    switch (type) {
        case 'TRUCK':
            return 'Грузовик';
        case 'VAN':
            return 'Фургон';
        case 'MOTORCYCLE':
            return 'Мотоцикл';
        default:
            return type;
    }
};

// Экспортируем все методы
export {
    api,
    OrderAPI,
    OrderTrackingAPI,
    VehicleAPI,
    DriverAPI,
    ClientAPI,
    CargoAPI,
    AuthAPI,
};

export function getVehicleStatusOrType(value) {
    const statuses = {
        AVAILABLE: 'Доступен',
        IN_TRANSIT: 'В пути',
        UNDER_MAINTENANCE: 'На ремонте'
    };

    const types = {
        TRUCK: 'Грузовик',
        VAN: 'Фургон',
        MOTORCYCLE: 'Мотоцикл'
    };

    // Если значение соответствует статусу
    if (statuses[value]) {
        return statuses[value];
    }
    // Если значение соответствует типу
    if (types[value]) {
        return types[value];
    }

    return value; // Если не найдено соответствие, возвращаем исходное значение
}


export function getDriverStatus2(value) {
    const statuses = {
        ACTIVE: "Активен",
        INACTIVE: "Неактивен",
        ON_LEAVE: "В отпуске",
        SUSPENDED: "Отстранен",
    };

    // Если значение соответствует статусу
    if (statuses[value]) {
        return statuses[value];
    }

    return value; // Если не найдено соответствие, возвращаем исходное значение
}