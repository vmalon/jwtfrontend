//Jwtfrontend - vmalon

import { React, useState } from 'react'
import { Form } from 'semantic-ui-react'
import apiLogin from '../../../services/ApiLogin'
import { Button, Spinner, Alert, Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { isAuthenticated, login, logout, getToken } from '../../../services/AuthenticationService'

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [alertIsVisible, setAlertIsVisible] = useState(false);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [variant, setVariant] = useState('');
    const [alertText, setAlertText] = useState('');
    const [nome, setNome] = useState('');
    const [horario, setHorario] = useState('');
    const [valido, setValido] = useState(false);

    async function handleSubmit() {
        if (verificaForms()) {
            setLoading(true);
            await apiLogin.request('login/login', {
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST',
                data: {
                    "Username": username,
                    "Password": password
                }
            }).then(function (response) {
                localStorage.setItem('usuario', JSON.stringify([{ nome: response.data.user }]));
                setTimeout(() => {
                    clearTimeout();
                    displayAlert('success', 'Usuário logado com sucesso');
                    setLoading(false);
                }, 2100);
                login(response.data.token);
            }).catch(function (error) {
                logout();
                switch (error) {
                    case 'Request failed with status code 404':
                        displayAlert('warning', `Usuário ou senha inválidos`);
                        break

                    default:
                        displayAlert('danger', `Ops... ocorreu um erro inesperado: ${error}`);
                }
                setLoading(false)
            });
        }
    }

    const usernameHandleChange = (event) => {
        setUsername(event.target.value);
    }

    const passwordHandleChange = (event) => {
        setPassword(event.target.value);
    }

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    }

    const displayAlert = (variant, text) => {
        window.scrollTo(0, 0);
        setAlertIsVisible(true);
        setVariant(variant);
        setAlertText(text);
        setTimeout(() => {
            clearTimeout();
            setAlertIsVisible(false);
        }, 2500);
    }

    const verificaForms = () => {
        if (!username || !password) {
            setAlertIsVisible(true);
            displayAlert('warning', 'Preencha os campos corretamente');
            return false;
        }
        return true;
    }

    async function validaAutenticacao() {
        if (isAuthenticated()) {
            setLoading(true);
            displayAlert('success', `Usuário autenticado. Token Jwt é válido`);

            await apiLogin.request('user/userInfo', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${getToken()}`,
                },
            }).then(function (response) {
                setNome(response.data.nome);
                setHorario(response.data.horario);
                setValido(response.data.validado);
                console.log(valido)
            }).catch(function (error) {
                displayAlert('danger', `Ocorreu um erro: ${error}`);
            });
            setLoading(false);
        } else {
            displayAlert('danger', `Usuário não autenticado.`);
        }
    }

    function handlelogout() {
        setValido(false);
        setNome('');
        setHorario('');
        logout();
        isAuthenticated();
        displayAlert('warning', 'Usuário deslogado');
    }

    return (
        <div className="container center">
            {alertIsVisible &&
                <Alert variant={variant}>
                    <strong>{alertText}</strong>
                </Alert>
            }

            {!isAuthenticated() &&
                <Form onSubmit={handleSubmit}>
                    <br />
                    <img
                        src="https://i2.wp.com/blog.logrocket.com/wp-content/uploads/2019/07/Screen-Shot-2018-10-11-at-1.40.06-PM.png?w=1016&ssl=1"
                        alt="Logo oficial do Jwt"
                        width="124px"
                        height="124px"
                    />
                    <h3>Jwt WebApi .NET</h3>
                    <div>
                        {loading && <Spinner animation="grow" variant="primary" />}
                    </div>
                    <Form.Input
                        disabled={loading}
                        focus
                        icon='user'
                        iconPosition='left'
                        name='Username'
                        label='Usuário'
                        onChange={usernameHandleChange}
                        onKeyPress={handleKeyPress}
                        placeholder='Seu usuário'
                    />
                    <Form.Input
                        disabled={loading}
                        icon='lock'
                        iconPosition='left'
                        name='password'
                        label='Senha'
                        type='Password'
                        onChange={passwordHandleChange}
                        onKeyPress={handleKeyPress}
                        placeholder='Sua senha'
                    />
                    <br />
                    <Button disabled={loading} type='submit'>Entrar</Button>
                </Form>
            }
            <br />
            {isAuthenticated() &&
                <Card style={{}}>
                    <br />
                    <div className="center">
                        <img variant="top" width="124" height="124px" src="https://i2.wp.com/blog.logrocket.com/wp-content/uploads/2019/07/Screen-Shot-2018-10-11-at-1.40.06-PM.png?w=1016&ssl=1" />
                    </div>
                    <Card.Body>
                        <Card.Title>Credenciais</Card.Title>
                        {valido &&
                            <Card.Text>
                                <p><strong>Nome: {nome}</strong></p>
                                <p><strong>Autenticado pelo servidor de origem em {horario}</strong></p>
                                <p><strong>Token Jwt: </strong>{getToken()}</p>
                                <span><strong>Agora, com é possível realizar requisições na WebApi, usando
                                    o token Jwt na sua autenticação e autorização. </strong></span>
                            </Card.Text>
                        }
                        <p>
                            <Button onClick={validaAutenticacao}>Validar autenticação</Button>
                        </p>
                        <p>
                            <Button className="danger" onClick={handlelogout}>Deslogar</Button>
                        </p>
                    </Card.Body>
                </Card>
            }
        </div>
    )
}