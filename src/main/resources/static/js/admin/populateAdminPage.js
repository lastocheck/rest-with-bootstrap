const capitalizeFirstLetter = str => str.toString()[0].toUpperCase() + str.substring(1);

window.openEditModal = (user) => {

    const form = $(`<form class="col-4" id="editModalForm">`)

    //iterating through the user object to build the form
    Object.entries(user).forEach(([key, value]) => {
        const formGroup = $(`<div class="form-group mb-3" ></div>`);
        form.append(formGroup);
        formGroup.append(`<label for="edit${capitalizeFirstLetter(key)}" class="form-label fw-bold">${capitalizeFirstLetter(key)}</label>`)

        //todo: change to roles from the server
        const roles = ["ADMIN", "USER"]

        let input = null;
        if (key === 'roles') {
            input = $(`<select class="form-select" size="${roles.length}" multiple aria-label="roles" name="roleIds" id="editRoles">`);
            for (const role of roles) {
                const option = $(`<option value="${role}">${role}</option>`);
                if (value.includes(role)) option.attr("selected", true);

                input.append(option);
            }
        } else {
            input = $(`<input type="text" class="form-control" id="edit${capitalizeFirstLetter(key)}" value="${value}" name="id"/>`);
            if (key === "id") input.prop("disabled", true);
        }
        formGroup.append(input);
    })

    form.on('submit', event => {
        event.preventDefault();

        $.ajax('http://localhost:8080/api/v1/users', {
            method: 'PUT',
            contentType: 'application/json',
            success: result => {
                console.log("PUT success");
                $('#editModal').modal().hide();
            },
            error: (request,msg,error) => {
                console.log(request);
                console.log(msg);
                console.log(error);
            }
        })
    })

    $('#editModalFormDiv').append(form);

    $('#editModal').modal('show');
};

window.openDeleteModal = (user) => {

}

$.get('http://localhost:8080/api/v1/users', (users) => {
    for (const user of users) {
        const row = $('#adminUsersTable tbody').append('<tr></tr>')

        const columns = [];
        Object.values(user).forEach(value => columns.push($('<td></td>').text(value)))

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
    }
});

$('#editModal').on('hidden.bs.modal', function () {
    $('#editModalForm').remove();
})
