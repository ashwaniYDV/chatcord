const express = require('express');
const router = express.Router();

const { getRooms } = require('./utils/users');

router.get('/', (req, res) => {
    const rooms = getRooms();
    console.log(rooms);
    res.render('index', { currentRooms: rooms });
})

router.post('/chat', (req, res) => {
    const { username, room, currentRoom } = req.body;
    console.log(username, room, currentRoom);
    if (currentRoom) {
        res.render('chat', {username, room, currentRoom});
    } else {
        res.render('chat', {username, room, currentRoom: undefined});
    }
})

module.exports = router;