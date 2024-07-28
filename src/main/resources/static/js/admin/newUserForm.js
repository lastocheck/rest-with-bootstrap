import { capitalizeFirstLetter, objectifyForm } from './utils.js';
import { createUser } from './api.js';

export const createNewUserForm = (user, updateUserListCallback) => {
    const form = $(`<form class="col-4" id="newUserForm"></form>`);
    const roles = ["ADMIN", "USER"]; // TODO: Fetch roles from server

    Object.entries(user).forEach(([key, value]) => {
        if (key !== 'id') {
            const formGroup = $(`<div class="form-group mb-3"></div>`);
            formGroup.append(`<label for="newUser${capitalizeFirstLetter(key)}" class="form-label fw-bold">${capitalizeFirstLetter(key)}</label>`);

            let input;
            if (key === 'roles') {
                input = createRolesSelect('newUser', roles);
            } else {
                input = $(`<input type="text" class="form-control" id="newUser${capitalizeFirstLetter(key)}" value="" name="${key}"/>`);
            }
            formGroup.append(input);
            form.append(formGroup);
        }
    });

    form.append($(`<button class="btn btn-success" type="submit">Add user</button>`));

    form.on('submit', event => {
        event.preventDefault();
        handleNewUser(form, updateUserListCallback);
    });

    $(`#addUserFormContainer`).empty().append(form);
};

const createRolesSelect = (prefix, roles) => {
    const select = $(`<select class="form-select" size="${roles.length}" multiple aria-label="roles" name="roles[]" id="${prefix}Roles"></select>`);
    roles.forEach(role => {
        const option = $(`<option value="${role}">${role}</option>`);
        select.append(option);
    });
    return select;
};

const handleNewUser = (form, updateUserListCallback) => {
    createUser(objectifyForm(form.serializeArray()))
        .done(result => {
            console.log("POST success");
            updateUserListCallback(result);
            $(`#nav-users-tab`).trigger('click');
            form[0].reset();
        })
        .fail((request, msg, error) => {
            console.log(request, msg, error);
        });
};