
const moment = require("moment")
//take the username and the message and wrap them into an object, return this object
function formatMessage(username, text){
    return {
        username,
        text,
        time: moment().format("h:mm a")
    }
}

module.exports = formatMessage