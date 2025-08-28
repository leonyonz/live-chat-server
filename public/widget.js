// Socket.IO connection
console.log('Attempting to connect to Socket.IO server');
const socket = io();
console.log('Socket object created:', socket);

// Add connection event listeners
socket.on('connect', () => {
  console.log('Socket connected successfully, socket ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected, reason:', reason);
});

// DOM Elements
const chatBubble = document.getElementById('chat-bubble');
const chatContainer = document.getElementById('chat-container');
const closeChat = document.getElementById('close-chat');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const gifButton = document.getElementById('gif-button');
const sendButton = document.getElementById('send-button');
const loginModal = document.getElementById('login-modal');
const usernameInput = document.getElementById('username-input');
const guestLogin = document.getElementById('guest-login');
const googleLogin = document.getElementById('google-login');
const facebookLogin = document.getElementById('facebook-login');
const gifPicker = document.getElementById('gif-picker');
const gifSearchInput = document.getElementById('gif-search-input');
const gifResults = document.getElementById('gif-results');

// User state
let currentUser = null;
let currentRoom = 'general';

// Event Listeners
chatBubble.addEventListener('click', () => {
  if (currentUser) {
    chatContainer.classList.remove('hidden');
  } else {
    loginModal.classList.remove('hidden');
  }
});

closeChat.addEventListener('click', () => {
  chatContainer.classList.add('hidden');
});

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

guestLogin.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    loginAsGuest(username);
  }
});

googleLogin.addEventListener('click', () => {
  // Redirect to Google OAuth
  window.location.href = '/api/auth/google';
});

facebookLogin.addEventListener('click', () => {
  // Redirect to Facebook OAuth
  window.location.href = '/api/auth/facebook';
});

// GIF Picker Event Listeners
gifButton.addEventListener('click', () => {
  gifPicker.classList.toggle('show');
  if (gifPicker.classList.contains('show')) {
    gifSearchInput.focus();
    // Load trending GIFs when opening the picker
    loadTrendingGifs();
  }
});

gifSearchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = gifSearchInput.value.trim();
    if (query) {
      searchGifs(query);
    }
  }
});

// Close GIF picker when clicking outside
document.addEventListener('click', (e) => {
  if (gifPicker.classList.contains('show') && 
      !gifPicker.contains(e.target) && 
      e.target !== gifButton) {
    gifPicker.classList.remove('show');
  }
});

// Functions
function loginAsGuest(username) {
  fetch('/api/auth/guest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      currentUser = data.user;
      loginModal.classList.add('hidden');
      chatContainer.classList.remove('hidden');
      
      // Join the general chat room
      socket.emit('join-room', currentRoom, currentUser.username, currentUser.id);
      
      // Load existing messages for the room
      loadExistingMessages();
      
      // Display welcome message
      addMessageToChat('System', `Welcome, ${currentUser.username}!`);
      
      // Note: We're relying on real-time socket events instead of polling
      // Start message synchronization for cross-device support is not needed
      // as socket events handle real-time updates
    } else {
      alert('Login failed: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Login failed. Please try again.');
  });
}

function loadExistingMessages() {
  // Clear existing messages
  chatMessages.innerHTML = '';
  
  // Fetch messages from the server
  fetch(`/api/messages/room/general`)
    .then(response => response.json())
    .then(data => {
      if (data.success && data.data.length > 0) {
        data.data.forEach(msg => {
          const isOwn = msg.userId && msg.userId._id ? msg.userId._id === currentUser?.id : msg.userId === currentUser?.id;
          if (msg.messageType === 'gif') {
            // Handle GIF messages
            const gifElement = document.createElement('img');
            gifElement.src = msg.gifUrl;
            gifElement.style.maxWidth = '200px';
            gifElement.style.borderRadius = '10px';
            
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.classList.add(isOwn ? 'own' : 'other');
            
            const messageInfo = document.createElement('div');
            messageInfo.classList.add('message-info');
            const timestamp = new Date(msg.createdAt).toLocaleTimeString();
            messageInfo.textContent = `${msg.username} - ${timestamp}`;
            
            messageElement.appendChild(messageInfo);
            messageElement.appendChild(gifElement);
            
            chatMessages.appendChild(messageElement);
          } else {
            // Handle text messages
            addMessageToChat(msg.username, msg.content, isOwn);
          }
        });
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    })
    .catch(error => {
      console.error('Error loading messages:', error);
    });
}

// Store the ID of the last received message to avoid duplicates
// let lastMessageId = null;

// // Periodically check for new messages to handle cross-device sync
// function startMessageSync() {
//   setInterval(() => {
//     if (currentRoom && currentUser) {
//       // Build query parameters
//       let url = `/api/messages/room/general`;
//       if (lastMessageId) {
//         // Only fetch messages newer than the last received message
//         url += `?since=${lastMessageId}`;
//       }
//       
//       fetch(url)
//         .then(response => response.json())
//         .then(data => {
//           if (data.success && data.data.length > 0) {
//             // Process messages in chronological order (they come in reverse order from API)
//             const messages = data.data.reverse();
//             
//             messages.forEach(msg => {
//               // Skip if we've already processed this message
//               if (lastMessageId && msg._id <= lastMessageId) {
//                 return;
//               }
//               
//               // Update lastMessageId to the newest message we've seen
//               if (!lastMessageId || msg._id > lastMessageId) {
//                 lastMessageId = msg._id;
//               }
//               
//               const isOwn = msg.userId && msg.userId._id ? msg.userId._id === currentUser?.id : msg.userId === currentUser?.id;
//               if (msg.messageType === 'gif') {
//                 // Handle GIF messages
//                 const gifElement = document.createElement('img');
//                 gifElement.src = msg.gifUrl;
//                 gifElement.style.maxWidth = '200px';
//                 gifElement.style.borderRadius = '10px';
//                 
//                 const messageElement = document.createElement('div');
//                 messageElement.classList.add('message');
//                 messageElement.classList.add(isOwn ? 'own' : 'other');
//                 
//                 const messageInfo = document.createElement('div');
//                 messageInfo.classList.add('message-info');
//                 const timestamp = new Date(msg.createdAt).toLocaleTimeString();
//                 messageInfo.textContent = `${msg.username} - ${timestamp}`;
//                 
//                 messageElement.appendChild(messageInfo);
//                 messageElement.appendChild(gifElement);
//                 
//                 chatMessages.appendChild(messageElement);
//               } else {
//                 // Handle text messages
//                 addMessageToChat(msg.username, msg.content, isOwn);
//               }
//             });
//           }
//         })
//         .catch(error => {
//           console.error('Error syncing messages:', error);
//         });
//     }
//   }, 3000); // Check every 3 seconds
// }

function sendMessage() {
  const message = messageInput.value.trim();
  if (message && currentUser) {
    // Emit message to server
    socket.emit('send-message', {
      roomName: currentRoom,
      message: message,
      userName: currentUser.username,
      userId: currentUser.id
    });
    
    // Also add the message to the chat immediately for better UX
    addMessageToChat(currentUser.username, message, true);
    
    // Clear input
    messageInput.value = '';
  }
}

function addMessageToChat(username, message, isOwn = false) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(isOwn ? 'own' : 'other');
  
  const messageInfo = document.createElement('div');
  messageInfo.classList.add('message-info');
  messageInfo.textContent = `${username} - ${new Date().toLocaleTimeString()}`;
  
  const messageContent = document.createElement('div');
  messageContent.textContent = message;
  
  messageElement.appendChild(messageInfo);
  messageElement.appendChild(messageContent);
  
  chatMessages.appendChild(messageElement);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Socket.IO event handlers
socket.on('user-joined', (username) => {
  addMessageToChat('System', `${username} joined the chat`);
});

socket.on('receive-message', (data) => {
  console.log('Received message data:', data);
  console.log('Current user:', currentUser);
  
  // Check if currentUser is set
  if (!currentUser) {
    console.log('Warning: currentUser is not set yet');
    addMessageToChat(data.userName, data.message, false);
    return;
  }
  
  const isOwn = data.userId && typeof data.userId === 'object' ? data.userId._id === currentUser.id : data.userId === currentUser.id;
  console.log('Is own message:', isOwn, 'Data userId:', data.userId, 'Current user id:', currentUser.id);
  addMessageToChat(data.userName, data.message, isOwn);
});

socket.on('receive-gif', (data) => {
  console.log('Received GIF data:', data);
  console.log('Current user:', currentUser);
  
  // Check if currentUser is set
  if (!currentUser) {
    console.log('Warning: currentUser is not set yet');
    const gifElement = document.createElement('img');
    gifElement.src = data.gifUrl;
    gifElement.style.maxWidth = '200px';
    gifElement.style.borderRadius = '10px';
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add('other');
    
    const messageInfo = document.createElement('div');
    messageInfo.classList.add('message-info');
    messageInfo.textContent = `${data.userName} - ${new Date().toLocaleTimeString()}`;
    
    messageElement.appendChild(messageInfo);
    messageElement.appendChild(gifElement);
    
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return;
  }
  
  const isOwn = data.userId && typeof data.userId === 'object' ? data.userId._id === currentUser.id : data.userId === currentUser.id;
  console.log('Is own GIF:', isOwn, 'Data userId:', data.userId, 'Current user id:', currentUser.id);
  
  const gifElement = document.createElement('img');
  gifElement.src = data.gifUrl;
  gifElement.style.maxWidth = '200px';
  gifElement.style.borderRadius = '10px';
  
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(isOwn ? 'own' : 'other');
  
  const messageInfo = document.createElement('div');
  messageInfo.classList.add('message-info');
  messageInfo.textContent = `${data.userName} - ${new Date().toLocaleTimeString()}`;
  
  messageElement.appendChild(messageInfo);
  messageElement.appendChild(gifElement);
  
  chatMessages.appendChild(messageElement);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// GIF Functions
function loadTrendingGifs() {
  fetch('/api/giphy/trending')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        displayGifs(data.data.data);
      }
    })
    .catch(error => {
      console.error('Error loading trending GIFs:', error);
    });
}

function searchGifs(query) {
  fetch(`/api/giphy/search/${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        displayGifs(data.data.data);
      }
    })
    .catch(error => {
      console.error('Error searching GIFs:', error);
    });
}

function displayGifs(gifs) {
  // Clear previous results
  gifResults.innerHTML = '';
  
  // Display new GIFs
  gifs.forEach(gif => {
    const gifItem = document.createElement('img');
    gifItem.src = gif.images.fixed_height_small.url;
    gifItem.alt = gif.title;
    gifItem.classList.add('gif-item');
    gifItem.addEventListener('click', () => {
      sendGif(gif.images.original.url);
    });
    
    gifResults.appendChild(gifItem);
  });
}

function sendGif(gifUrl) {
  if (currentUser) {
    // Emit GIF to server
    socket.emit('send-gif', {
      roomName: currentRoom,
      gifUrl: gifUrl,
      userName: currentUser.username,
      userId: currentUser.id
    });
    
    // Close the GIF picker
    gifPicker.classList.remove('show');
    gifSearchInput.value = '';
  }
}

// Check for token in URL (for OAuth callbacks)
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
if (token) {
  // In a real implementation, you would validate the token
  // For now, we'll just hide the login modal
  loginModal.classList.add('hidden');
  chatContainer.classList.remove('hidden');
  
  // Remove token from URL
  window.history.replaceState({}, document.title, "/");
}
