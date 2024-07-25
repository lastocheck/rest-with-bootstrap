window.openEditModal = (userId) => {
    console.log('Edit modal for user:', userId);
    $('#editModal').modal('show');
};

$.get('http://localhost:8080/api/v1/users', (users) => {
    for (const user of users) {
        const row = $('#adminUsersTable tbody').append('<tr></tr>')

        const columns = [];
        Object.values(user).forEach(value => columns.push($('<td></td>').text(value)))

        const editButton = $('<button type="button" class="btn btn-info">Edit</button>')
        columns.push($('<td></td>').append(editButton));
        editButton.on('click', function() {
            openEditModal(user.id);
        });

        row.append(columns);
    }
});
