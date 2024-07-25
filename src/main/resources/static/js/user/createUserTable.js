async function getUser() {
    const url = 'http://localhost:8080/api/v1/user';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

async function populatePage() {
    const user = await getUser();

    $('#userMainHeading').text(`User ${user.username}`);

    $('#idCell').text(user.id);
    $('#usernameCell').text(user.username);
    $('#emailCell').text(user.contactInfo.email);
    $('#phoneCell').text(user.contactInfo.phone);
    $('#rolesCell').text(user.roles.map(role => role.name.substring(5))).toString();

}

populatePage();
