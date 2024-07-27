$.get('http://localhost:8080/api/v1/user', (user) => {
    console.log(`GET /user in populateLayout to populate header and sidebar`)
    $('#headerUsername').text(user.username);
    $('#headerRoles').text(user.roles);

    const path = $(location).attr("pathname");

    const userLink = $('<a href="/user" class="nav-link">User</a>');
    const adminLink = $('<a href="/admin" class="nav-link">Admin</a>');

    for (const link of [userLink, adminLink]) {
        if (path.includes(link.attr('href'))) {
            link.addClass('active');
        }
    }

    $('#sidebarNav').append(userLink);

    if (user.roles.includes('ADMIN')) {
        $('#sidebarNav').append(adminLink);
    }
});
