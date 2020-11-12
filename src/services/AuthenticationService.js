export const isAuthenticated = () => localStorage.getItem('userToken') !== null;

export const login = (token) => localStorage.setItem('userToken', token);

export const getToken = () => localStorage.getItem('userToken');

export const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('usuario');
}