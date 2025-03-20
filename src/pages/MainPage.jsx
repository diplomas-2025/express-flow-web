import React, { useState } from 'react';
import { Button, Card, Col, Input, Row, Typography, Space, message } from 'antd';
import { LoginOutlined, UserAddOutlined, TruckOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthAPI } from '../api/Api';

const { Title, Text } = Typography;

const MainPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tabIndex, setTabIndex] = useState(0);
    const [registerData, setRegisterData] = useState({ name: '', email: '', phone: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = () => {
        AuthAPI.signIn({ email, password })
            .then(() => window.location.reload())
            .catch(() => message.error('Неверный email или пароль'));
    };

    const handleRegister = () => {
        AuthAPI.signUp(registerData)
            .then(() => window.location.reload())
            .catch(() => message.error('Ошибка при регистрации. Проверьте введенные данные.'));
    };

    return (
        <Row justify="center" style={{ marginTop: 40, marginBottom: 40 }}>
            <Col xs={24} sm={20} md={12} lg={10} xl={8}>
                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: 32,
                        padding: '40px 20px',
                        background: 'linear-gradient(135deg, #1890ff, #0050b3)',
                        borderRadius: 16,
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                        color: '#fff',
                    }}
                >
                    <TruckOutlined
                        style={{
                            fontSize: 64,
                            color: '#fff',
                            animation: 'float 3s ease-in-out infinite',
                        }}
                    />
                    <Title
                        level={2}
                        style={{
                            marginTop: 16,
                            color: '#fff',
                            fontWeight: 600,
                            letterSpacing: '1px',
                        }}
                    >
                        Быстрая и надежная доставка
                    </Title>
                    <Text
                        style={{
                            display: 'block',
                            textAlign: 'center',
                            marginBottom: 16,
                            fontSize: 16,
                            color: 'rgba(255, 255, 255, 0.8)',
                        }}
                    >
                        ООО «ЭКСПРЕССГРУПП» — ваш надежный партнер в логистике
                    </Text>
                    <Button
                        type="primary"
                        size="large"
                        style={{
                            marginTop: 16,
                            background: '#fff',
                            color: '#1890ff',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 500,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        }}
                        onClick={() => navigate('/track-order')}
                    >
                        Отследить заказ
                    </Button>
                </div>

                <Space style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                    <Button
                        type={tabIndex === 0 ? "primary" : "default"}
                        icon={<LoginOutlined />}
                        onClick={() => setTabIndex(0)}
                        style={{ borderRadius: 8 }}
                    >
                        Вход
                    </Button>
                    <Button
                        type={tabIndex === 1 ? "primary" : "default"}
                        icon={<UserAddOutlined />}
                        onClick={() => setTabIndex(1)}
                        style={{ borderRadius: 8 }}
                    >
                        Регистрация
                    </Button>
                </Space>

                {tabIndex === 0 && (
                    <Card style={{ borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Input
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ borderRadius: 8 }}
                            />
                            <Input.Password
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ borderRadius: 8 }}
                            />
                            <Button type="primary" onClick={handleLogin} style={{ borderRadius: 8 }}>
                                Войти
                            </Button>
                        </Space>
                    </Card>
                )}

                {tabIndex === 1 && (
                    <Card style={{ borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Input
                                placeholder="Имя"
                                value={registerData.name}
                                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                style={{ borderRadius: 8 }}
                            />
                            <Input
                                placeholder="Email"
                                value={registerData.email}
                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                style={{ borderRadius: 8 }}
                            />
                            <Input
                                placeholder="Телефон"
                                value={registerData.phone}
                                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                style={{ borderRadius: 8 }}
                            />
                            <Input.Password
                                placeholder="Пароль"
                                value={registerData.password}
                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                style={{ borderRadius: 8 }}
                            />
                            <Button type="primary" onClick={handleRegister} style={{ borderRadius: 8 }}>
                                Зарегистрироваться
                            </Button>
                        </Space>
                    </Card>
                )}
            </Col>
        </Row>
    );
};

export default MainPage;