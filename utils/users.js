const users =[]

//join user to chat, here we create a new user as an object, add it to the users' array and return it
function joinUser(id, username, room){
    const user = {id, username, room}
    users.push(user)
    return user
}

function getCurrentUser(id){
    return users.find(user => user.id === id)
}

function userLeave(id){
    //find index of the user whos leaving, 
    const index = users.find(user => user.id === id)
    if(index != -1){
        //delete that user, at index, delete 1 element
        // console.log("out:",users.splice(index, 1)[0]);
        return users.splice(index, 1)[0]
    }
}
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}
module.exports = {
    joinUser,
    getCurrentUser,
    userLeave,
    getRoomUsers,
}