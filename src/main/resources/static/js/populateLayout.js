$.get('http://localhost:8080/api/v1/user', (user) => {
    $('#headerUsername').text(user.username);
    $('#headerRoles').text(user.roles);
});
