const capitalizeFirstLetter = str => str.toString()[0].toUpperCase() + str.substring(1);

//get a json that corresponds to UserDTO
function objectifyForm(inp){
    var rObject = {};
    for (var i = 0; i < inp.length; i++){
        if(inp[i]['name'].substring(inp[i]['name'].length - 2) == "[]"){
            var tmp = inp[i]['name'].substr(0, inp[i]['name'].length-2);
            if(Array.isArray(rObject[tmp])){
                rObject[tmp].push(inp[i]['value']);
            } else{
                rObject[tmp] = [];
                rObject[tmp].push(inp[i]['value']);
            }
        } else{
            rObject[inp[i]['name']] = inp[i]['value'];
        }
    }
    return rObject;
}

let userList = [];

const openUserModal = (user, mode) => {
    //get user from userList so that when modal is opened again after updating, it displays correct data in inputs
    user = userList.find(u => u.id === user.id);

    const modalId = mode === 'edit' ? 'editModal' : 'deleteModal';
    const modalTitle = mode === 'edit' ? 'Edit User' : 'Delete User';
    const isDisabled = mode === 'delete';

    $(`#${modalId} .modal-title`).text(modalTitle);
    $(`#${modalId}`).modal().show();
    $('.modal-backdrop').show();

    const form = $(`<form class="col-4" id="${modalId}Form"></form>`);

    //iterating through the user object to build the form
    Object.entries(user).forEach(([key, value]) => {
        const formGroup = $(`<div class="form-group mb-3"></div>`);
        form.append(formGroup);
        formGroup.append(`<label for="${modalId}${capitalizeFirstLetter(key)}" class="form-label fw-bold">${capitalizeFirstLetter(key)}</label>`);

        //todo: change to roles from the server
        const roles = ["ADMIN", "USER"];

        let input = null;
        if (key === 'roles') {
            input = $(`<select class="form-select" size="${roles.length}" multiple aria-label="roles" name="roles[]" id="${modalId}Roles" ${isDisabled ? 'disabled' : ''}></select>`);
            for (const role of roles) {
                const option = $(`<option value="${role}">${role}</option>`);
                if (value.includes(role)) option.attr("selected", true);

                input.append(option);
            }
        } else {
            input = $(`<input type="text" class="form-control" id="${modalId}${capitalizeFirstLetter(key)}" value="${(key !== 'password') ? value : ''}" name="${key}" ${isDisabled ? 'disabled' : ''}/>`);
            if (key === "id") input.prop("readonly", true);
        }
        formGroup.append(input);
    });

    form.on('submit', event => {
        event.preventDefault();

        if (mode === 'edit') {
            $.ajax('http://localhost:8080/api/v1/users', {
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(objectifyForm(form.serializeArray())),
                dataType: 'json',
                success: result => {
                    console.log("PUT success");

                    //close the modal
                    $(`#${modalId}`).modal('hide');
                    $('.modal-backdrop').hide();
                    form.remove();

                    //update the changed user row
                    const row = $(`#adminUsersTable tbody tr[data-id="${result.id}"]`);
                    let colIndex = 0;
                    Object.entries(result).forEach(([key, value]) => {
                        if (key !== 'password') {
                            const cell = row.children().eq(colIndex);
                            if (key === 'roles') {
                                cell.text(value.join(", "));
                            } else {
                                cell.text(value);
                            }
                            colIndex++;
                        }
                    });

                    //update user in userList
                    const index = userList.findIndex(u => u.id === result.id);
                    if (index !== -1) {
                        userList[index] = result;
                    }
                },
                error: (request, msg, error) => {
                    console.log(request);
                    console.log(msg);
                    console.log(error);
                }
            });
        } else if (mode === 'delete') {
            $.ajax(`http://localhost:8080/api/v1/users/${user.id}`, {
                method: 'DELETE',
                success: result => {
                    console.log("DELETE success");

                    //close the modal
                    $(`#${modalId}`).modal('hide');
                    $('.modal-backdrop').hide();
                    form.remove();

                    //remove the user row from the table
                    $(`#adminUsersTable tbody tr[data-id="${user.id}"]`).remove();

                    //remove the user from userList
                    userList = userList.filter(u => u.id !== user.id);
                },
                error: (request, msg, error) => {
                    console.log(request);
                    console.log(msg);
                    console.log(error);
                }
            });
        }
    });

    $(`#${modalId}FormDiv`).empty().append(form);

    console.log(form);

    $(`#${modalId}`).modal('show');
}

window.openEditModal = (user) => openUserModal(user, "edit")
window.openDeleteModal = (user) => openUserModal(user, "delete")

$.get('http://localhost:8080/api/v1/users', (users) => {
    userList = users;
    for (const user of users) {
        const row = $(`<tr></tr>`).attr('data-id', user.id);

        const columns = [];
        Object.entries(user).forEach(([key, value]) =>  (key !== 'password') ? columns.push($('<td></td>').text(value)) : null);

        const editButton = $('<button type="button" class="btn btn-info">Edit</button>')
        columns.push($('<td></td>').append(editButton));
        editButton.on('click', function() {
            openEditModal(user);
        });

        const deleteButton = $('<button type="button" class="btn btn-danger">Delete</button>')
        columns.push($('<td></td>').append(deleteButton));
        deleteButton.on('click', function() {
            openDeleteModal(user);
        });

        row.append(columns);
        $('#adminUsersTable tbody').append(row);
    }
});

$('#editModal').on('hidden.bs.modal', function () {
    $('#editModalForm').remove();
})
