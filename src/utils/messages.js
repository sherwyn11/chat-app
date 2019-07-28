const generateMessage = (username,text) =>{
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocation = (username,urlLoc) =>{
    return {
        username,
        urlLoc,
        createdAt: new Date().getTime()
    }
}


module.exports = {generateMessage,generateLocation}