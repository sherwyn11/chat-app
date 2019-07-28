// Client side JS
//on --> recieve
//emit --> send
const socket = io()
//elements
const $msgForm = document.querySelector('form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendlocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


//options
console.log("My sesrc",location.search)

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () =>{

    const $newMessage = $messages.lastElementChild
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    const visibleHeight = $messages.offsetHeight
    const containerHeight = $messages.scrollHeight
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }

}

socket.on('message',(message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('k:mm')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(url) => {
    console.log(url)
    const loc = Mustache.render(locationTemplate,{
        username: message.username,
        location: url.urlLoc,
        createdAt: moment(url.createdAt).format('k:mm')
    })
    $messages.insertAdjacentHTML('beforeend',loc)
    autoscroll()
})


$msgForm.addEventListener('submit',(e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')

    const msg = document.getElementById('inputMsg').value
    socket.emit('newMessage',msg,(message) =>{
        console.log("Client: The message was delivered")
        console.log("Server: Delivered")
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

    })
})

$sendlocationButton.addEventListener('click',() => {

    $sendlocationButton.setAttribute('disabled','disabled')

    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },(message)=>{
            console.log(message)
            $sendlocationButton.removeAttribute('disabled')
        })
    })

})

socket.on('roomData',({room,users}) => {
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.emit('join',{
    username,
    room
},(error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})