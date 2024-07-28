import { fetchUsers } from './api.js';
import { populateUserTable } from './userTable.js';
import { createNewUserForm } from './newUserForm.js';
import { createUserModal } from './userModal.js';

let userList = [];

const updateUserList = (user, isDelete = false) => {
    if (isDelete) {
        userList = userList.filter(u => u.id !== user.id);
    } else {
        const index = userList.findIndex(u => u.id === user.id);
        if (index !== -1) {
            userList[index] = user;
        } else {
            userList.push(user);
        }
    }
    populateUserTable(userList, openUserModal);
};

const openUserModal = createUserModal(updateUserList);

$(document).ready(() => {
    fetchUsers()
        .done(users => {
            console.log(`GET /users in populateAdmin to populate users table`);
            userList = users;
            populateUserTable(users, openUserModal);
            createNewUserForm(users[0], updateUserList);
        })
        .fail((request, msg, error) => {
            console.log(request, msg, error);
        });

    $('#editModal').on('hidden.bs.modal', function () {
        $('#editModalForm').remove();
    });

    window.openEditModal = (user) => openUserModal(user, "edit");
    window.openDeleteModal = (user) => openUserModal(user, "delete");
});