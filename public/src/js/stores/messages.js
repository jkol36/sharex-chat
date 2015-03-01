var UserStore = require('../stores/user');

var Dispatcher = require('../dispatchers/app');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var messages = {
    2: {
        user: {
            profilePicture: 'https://avatars0.githubusercontent.com/u/2565155?v=3&s=460',
            id: 2,
            name: 'Jon Kolman',
            status: 'online'
        },
        lastAccess: {
            recipient: 1424469794050,
            currentUser: 1424469794080
        },
        messages: [
            {
                contents: 'Hey!',
                from: 2,
                timestamp: 1424469793023
            },
            {
                contents: 'Hey, what\'s up?',
                from: 1,
                timestamp: 1424469794000
            }
        ]
    },
    3: {
        user: {
            read: true,
            profilePicture: 'https://avatars3.githubusercontent.com/u/2955483?v=3&s=460',
            name: 'Jilles Soeters',
            id: 3,
            status: 'online'
        },
        lastAccess: {
            recipient: 1424352522000,
            currentUser: 1424352522080
        },
        messages: [
            {
                contents: 'Want a game of ping pong?',
                from: 3,
                timestamp: 1424352522000
            }
        ]
    },
    4: {
        user: {
            name: 'Martin Røed',
            id: 4,
            profilePicture: '',
            status: 'online'
        },
        lastAccess: {
            recipient: 1424423579000,
            currentUser: 1424423574000
        },
        messages: [
            {
                contents: 'ShareX for the win',
                timestamp: 1424423579000,
                from: 4
            }
        ]
    }
};

var openChatID = parseInt(Object.keys(messages)[0], 10);

var messagesStore = assign({}, EventEmitter.prototype, {
    addChangeListener: function (callback) {
        this.on('change', callback);
    },
    removeChangeListener: function (callback) {
        this.off('change', callback);
    },
    getOpenChatUserID: function () {
        return openChatID;
    },
    getChatByUserID: function (id) {
        return messages[id];
    },
    getAllChats: function () {
        return messages;
    }
});

messagesStore.dispatchToken = Dispatcher.register(function (payload) {
    var actions = {
        updateOpenChatID: function (payload) {
            openChatID = payload.action.userID;
            messages[openChatID].lastAccess.currentUser = +new Date();

            messagesStore.emit('change');
        },
        sendMessage: function (payload) {
            var userID = payload.action.userID;

            messages[userID].messages.push({
                contents: payload.action.message,
                timestamp: payload.action.timestamp,
                from: UserStore.user.id
            });
            messages[userID].lastAccess.currentUser = +new Date();

            messagesStore.emit('change');
        }
    };

    actions[payload.action.type] && actions[payload.action.type](payload);
});

module.exports = messagesStore;