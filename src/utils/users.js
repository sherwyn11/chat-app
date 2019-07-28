const users = []

const addUser = ({id,username,room}) =>{

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return {
            error: 'Username or room not specified'
        }
    }

    const existing = users.find((user) => {
        return user.room == room && username == user.username
    })

    if(existing){
        return{
            error: 'Username is already taken'
        }
    }

    const user = {id,username,room}
    users.push(user)
    return {
        user
    }
}

const removeUser = (id) =>{
    const index = users.findIndex((user) => {
        return user.id == id
    })
    
    if(index != -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    return  users.find((user)=>user.id==id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room == room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}