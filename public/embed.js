/**
 * Live Chat Widget Embed Script
 * This script can be included on any website to embed the chat widget
 */

(function() {
  // Configuration
  const CONFIG = {
    // In a production environment, this would be configurable
    serverUrl: window.location.origin,
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    zIndex: 10000
  };

  // Create the chat container
  function createChatWidget() {
    // Create iframe for the chat widget
    const iframe = document.createElement('iframe');
    iframe.id = 'live-chat-widget';
    iframe.src = CONFIG.serverUrl + '/widget.html';
    iframe.frameBorder = '0';
    iframe.style.position = 'fixed';
    iframe.style.width = '350px';
    iframe.style.height = '500px';
    iframe.style.zIndex = CONFIG.zIndex;
    iframe.style.border = 'none';
    iframe.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    iframe.style.borderRadius = '10px';
    
    // Position the widget
    switch(CONFIG.position) {
      case 'bottom-right':
        iframe.style.bottom = '20px';
        iframe.style.right = '20px';
        break;
      case 'bottom-left':
        iframe.style.bottom = '20px';
        iframe.style.left = '20px';
        break;
      case 'top-right':
        iframe.style.top = '20px';
        iframe.style.right = '20px';
        break;
      case 'top-left':
        iframe.style.top = '20px';
        iframe.style.left = '20px';
        break;
    }
    
    // Hide initially
    iframe.style.display = 'none';
    
    // Append to body
    document.body.appendChild(iframe);
    
    // Create chat bubble button
    const chatBubble = document.createElement('div');
    chatBubble.id = 'chat-bubble-button';
    chatBubble.innerHTML = '💬';
    chatBubble.style.position = 'fixed';
    chatBubble.style.zIndex = CONFIG.zIndex + 1;
    chatBubble.style.width = '60px';
    chatBubble.style.height = '60px';
    chatBubble.style.backgroundColor = '#4CAF50';
    chatBubble.style.borderRadius = '50%';
    chatBubble.style.cursor = 'pointer';
    chatBubble.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    chatBubble.style.display = 'flex';
    chatBubble.style.alignItems = 'center';
    chatBubble.style.justifyContent = 'center';
    chatBubble.style.fontSize = '24px';
    chatBubble.style.color = 'white';
    chatBubble.style.transition = 'transform 0.2s';
    
    // Position the bubble
    switch(CONFIG.position) {
      case 'bottom-right':
        chatBubble.style.bottom = '20px';
        chatBubble.style.right = '20px';
        break;
      case 'bottom-left':
        chatBubble.style.bottom = '20px';
        chatBubble.style.left = '20px';
        break;
      case 'top-right':
        chatBubble.style.top = '20px';
        chatBubble.style.right = '20px';
        break;
      case 'top-left':
        chatBubble.style.top = '20px';
        chatBubble.style.left = '20px';
        break;
    }
    
    // Add hover effect
    chatBubble.addEventListener('mouseenter', () => {
      chatBubble.style.transform = 'scale(1.1)';
    });
    
    chatBubble.addEventListener('mouseleave', () => {
      chatBubble.style.transform = 'scale(1)';
    });
    
    // Toggle chat visibility
    chatBubble.addEventListener('click', () => {
      if (iframe.style.display === 'none') {
        iframe.style.display = 'block';
      } else {
        iframe.style.display = 'none';
      }
    });
    
    // Append bubble to body
    document.body.appendChild(chatBubble);
  }

  // Initialize the widget when the DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatWidget);
  } else {
    createChatWidget();
  }
})();
