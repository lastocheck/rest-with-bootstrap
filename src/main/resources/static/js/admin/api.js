const API_BASE_URL = 'http://localhost:8080/api/v1';

export const fetchUsers = () => $.get(`${API_BASE_URL}/users`);

export const updateUser = (userData) =>
    $.ajax(`${API_BASE_URL}/users`, {
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(userData),
        dataType: 'json'
    });

export const deleteUser = (userId) =>
    $.ajax(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE'
    });

export const createUser = (userData) =>
    $.ajax(`${API_BASE_URL}/users`, {
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(userData),
        dataType: 'json'
    });