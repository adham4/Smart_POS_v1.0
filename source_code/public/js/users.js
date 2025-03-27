// js/users
(async () => {
    const response = await fetch('/api/users');
    const users = await response.json();
    const usersList = document.getElementById('users-list');

    users.forEach(user => {
        const item = document.createElement('div');
        item.textContent = `Username: ${user.username}`;
        usersList.appendChild(item);
    });
})();
