import { capitalizeFirstLetter, objectifyForm } from './utils.js';
import { updateUser, deleteUser } from './api.js';

export const createUserModal = (updateUserListCallback) => {
    const openUserModal = (user, mode) => {
        const modalId = mode === 'edit' ? 'editModal' : 'deleteModal';
        const modalTitle = mode === 'edit' ? 'Edit User' : 'Delete User';
        const isDisabled = mode === 'delete';

        $(`#${modalId} .modal-title`).text(modalTitle);
        $(`#${modalId}`).modal().show();
        $('.modal-backdrop').show();

        const form = createUserForm(user, modalId, isDisabled);

        form.on('submit', event => {
            event.preventDefault();
            if (mode === 'edit') {
                handleEditUser(form, modalId, updateUserListCallback);
            } else if (mode === 'delete') {
                handleDeleteUser(user, modalId, updateUserListCallback);
            }
        });

        $(`#${modalId}FormDiv`).empty().append(form);
        $(`#${modalId}`).modal('show');
    };

    return openUserModal;
};

const createUserForm = (user, modalId, isDisabled) => {
    const form = $(`<form class="col-4" id="${modalId}Form"></form>`);
    const roles = ["ADMIN", "USER"]; // TODO: Fetch roles from server

    Object.entries(user).forEach(([key, value]) => {
        const formGroup = $(`<div class="form-group mb-3"></div>`);
        form.append(formGroup);
        formGroup.append(`<label for="${modalId}${capitalizeFirstLetter(key)}" class="form-label fw-bold">${capitalizeFirstLetter(key)}</label>`);

        let input;
        if (key === 'roles') {
            input = createRolesSelect(modalId, roles, value, isDisabled);
        } else {
            input = createTextInput(modalId, key, value, isDisabled);
        }
        formGroup.append(input);
    });

    return form;
};

const createRolesSelect = (modalId, roles, value, isDisabled) => {
    const select = $(`<select class="form-select" size="${roles.length}" multiple aria-label="roles" name="roles[]" id="${modalId}Roles" ${isDisabled ? 'disabled' : ''}></select>`);
    roles.forEach(role => {
        const option = $(`<option value="${role}">${role}</option>`);
        if (value.includes(role)) option.attr("selected", true);
        select.append(option);
    });
    return select;
};

const createTextInput = (modalId, key, value, isDisabled) => {
    const input = $(`<input type="text" class="form-control" id="${modalId}${capitalizeFirstLetter(key)}" value="${(key !== 'password') ? value : ''}" name="${key}" ${isDisabled ? 'disabled' : ''}/>`);
    if (key === "id") input.prop("readonly", true);
    return input;
};

const handleEditUser = (form, modalId, updateUserListCallback) => {
    updateUser(objectifyForm(form.serializeArray()))
        .done(result => {
            console.log("PUT success");
            closeModal(modalId);
            updateUserListCallback(result);
        })
        .fail((request, msg, error) => {
            console.log(request, msg, error);
        });
};

const handleDeleteUser = (user, modalId, updateUserListCallback) => {
    deleteUser(user.id)
        .done(() => {
            console.log("DELETE success");
            closeModal(modalId);
            updateUserListCallback(user, true);
        })
        .fail((request, msg, error) => {
            console.log(request, msg, error);
        });
};

const closeModal = (modalId) => {
    $(`#${modalId}`).modal('hide');
    $('.modal-backdrop').hide();
    $(`#${modalId}Form`).remove();
};