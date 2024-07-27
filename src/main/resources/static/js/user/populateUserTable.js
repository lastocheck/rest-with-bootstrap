$.get('http://localhost:8080/api/v1/user', (user) => {
    console.log(`GET /user in populateUser to populate user table`);
    $('#userMainHeading').text(`User ${user.username}`);

    $('#idCell').text(user.id);
    $('#usernameCell').text(user.username);
    $('#emailCell').text(user.email);
    $('#phoneCell').text(user.phone);
    $('#rolesCell').text(user.roles);
});