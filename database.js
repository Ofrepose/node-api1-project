let users = [
    { id: "1", name: "Jane Doe", bio:"" },
    { id: "2", name: "John Doe", bio:"" },
    { id: "3", name: "Jack Doe", bio:"" },
]

function getUsers() {
    return users
}

function getUserById(id) {
    return users.find(u => u.id === id)
}

function createUser(data) {
    const payload = {
        id: String(users.length + 1),
        ...data,
    }

    users.push(payload)
    return payload
}

function updateUser(id, data) {
    const index = users.findIndex(u => u.id === id)
    users[index] = {
        ...users[index],
        ...data,
    }

    return users[index]
}

function deleteUser(id) {
    users = users.filter(u => u.id != id)
    return getUserById(id);

}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}