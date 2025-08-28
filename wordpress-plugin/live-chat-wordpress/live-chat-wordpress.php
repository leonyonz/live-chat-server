<?php
/**
 * Plugin Name: Live Chat Widget
 * Plugin URI: https://github.com/leonyonz/live-chat-server
 * Description: Embed a live chat widget on your WordPress site that connects to your self-hosted chat server.
 * Version: 1.0.0
 * Author: Live Chat Team
 * License: MIT
 * Text Domain: live-chat-wp
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class Live_Chat_WordPress {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'settings_init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_footer', array($this, 'embed_chat_widget'));
        add_shortcode('live_chat', array($this, 'chat_shortcode'));
    }
    
    /**
     * Add admin menu for plugin settings
     */
    public function add_admin_menu() {
        add_options_page(
            'Live Chat Settings', 
            'Live Chat', 
            'manage_options', 
            'live-chat-settings', 
            array($this, 'options_page')
        );
    }
    
    /**
     * Initialize settings
     */
    public function settings_init() {
        register_setting('liveChatSettings', 'live_chat_settings');
        
        add_settings_section(
            'liveChatSettings_section', 
            __('Chat Widget Settings', 'live-chat-wp'), 
            array($this, 'settings_section_callback'), 
            'liveChatSettings'
        );
        
        add_settings_field(
            'live_chat_server_url', 
            __('Chat Server URL', 'live-chat-wp'), 
            array($this, 'server_url_render'), 
            'liveChatSettings', 
            'liveChatSettings_section'
        );
        
        add_settings_field(
            'live_chat_position', 
            __('Widget Position', 'live-chat-wp'), 
            array($this, 'position_render'), 
            'liveChatSettings', 
            'liveChatSettings_section'
        );
        
        add_settings_field(
            'live_chat_z_index', 
            __('Z-Index', 'live-chat-wp'), 
            array($this, 'z_index_render'), 
            'liveChatSettings', 
            'liveChatSettings_section'
        );
    }
    
    /**
     * Render server URL field
     */
    public function server_url_render() {
        $options = get_option('live_chat_settings');
        ?>
        <input type='text' name='live_chat_settings[live_chat_server_url]' 
               value='<?php echo esc_attr($options['live_chat_server_url']); ?>' 
               placeholder='https://your-chat-server.com'>
        <p class="description"><?php _e('Enter the full URL to your chat server (without trailing slash)', 'live-chat-wp'); ?></p>
        <?php
    }
    
    /**
     * Render position field
     */
    public function position_render() {
        $options = get_option('live_chat_settings');
        $position = isset($options['live_chat_position']) ? $options['live_chat_position'] : 'bottom-right';
        ?>
        <select name='live_chat_settings[live_chat_position]'>
            <option value='bottom-right' <?php selected($position, 'bottom-right'); ?>>Bottom Right</option>
            <option value='bottom-left' <?php selected($position, 'bottom-left'); ?>>Bottom Left</option>
            <option value='top-right' <?php selected($position, 'top-right'); ?>>Top Right</option>
            <option value='top-left' <?php selected($position, 'top-left'); ?>>Top Left</option>
        </select>
        <?php
    }
    
    /**
     * Render z-index field
     */
    public function z_index_render() {
        $options = get_option('live_chat_settings');
        $z_index = isset($options['live_chat_z_index']) ? $options['live_chat_z_index'] : '10000';
        ?>
        <input type='number' name='live_chat_settings[live_chat_z_index]' 
               value='<?php echo esc_attr($z_index); ?>' min='1' max='999999'>
        <p class="description"><?php _e('Adjust if the widget appears behind other elements', 'live-chat-wp'); ?></p>
        <?php
    }
    
    /**
     * Settings section callback
     */
    public function settings_section_callback() {
        echo __('Configure the live chat widget settings below.', 'live-chat-wp');
    }
    
    /**
     * Options page
     */
    public function options_page() {
        ?>
        <div class="wrap">
            <h1><?php echo __('Live Chat Settings', 'live-chat-wp'); ?></h1>
            <form action='options.php' method='post'>
                <?php
                settings_fields('liveChatSettings');
                do_settings_sections('liveChatSettings');
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }
    
    /**
     * Enqueue scripts
     */
    public function enqueue_scripts() {
        // We'll load our embed script in the footer instead
    }
    
    /**
     * Embed chat widget
     */
    public function embed_chat_widget() {
        $options = get_option('live_chat_settings');
        $server_url = isset($options['live_chat_server_url']) ? rtrim($options['live_chat_server_url'], '/') : '';
        $position = isset($options['live_chat_position']) ? $options['live_chat_position'] : 'bottom-right';
        $z_index = isset($options['live_chat_z_index']) ? intval($options['live_chat_z_index']) : 10000;
        
        // Don't embed if server URL is not set
        if (empty($server_url)) {
            return;
        }
        
        // Output the configuration and script
        ?>
        <script>
        (function() {
            // Configuration
            var CONFIG = {
                serverUrl: '<?php echo esc_js($server_url); ?>',
                position: '<?php echo esc_js($position); ?>',
                zIndex: <?php echo intval($z_index); ?>
            };

            // Create the chat container
            function createChatWidget() {
                // Create iframe for the chat widget
                var iframe = document.createElement('iframe');
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
                var chatBubble = document.createElement('div');
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
                chatBubble.addEventListener('mouseenter', function() {
                    chatBubble.style.transform = 'scale(1.1)';
                });
                
                chatBubble.addEventListener('mouseleave', function() {
                    chatBubble.style.transform = 'scale(1)';
                });
                
                // Toggle chat visibility
                chatBubble.addEventListener('click', function() {
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
        </script>
        <?php
    }
    
    /**
     * Shortcode for embedding chat in posts/pages
     */
    public function chat_shortcode($atts) {
        $atts = shortcode_atts(array(
            'height' => '500px',
            'width' => '100%',
        ), $atts, 'live_chat');
        
        $options = get_option('live_chat_settings');
        $server_url = isset($options['live_chat_server_url']) ? rtrim($options['live_chat_server_url'], '/') : '';
        
        if (empty($server_url)) {
            return '<p>' . __('Chat server URL not configured.', 'live-chat-wp') . '</p>';
        }
        
        return '<iframe src="' . esc_url($server_url . '/widget.html') . '" width="' . esc_attr($atts['width']) . '" height="' . esc_attr($atts['height']) . '" frameborder="0"></iframe>';
    }
}

// Initialize the plugin
new Live_Chat_WordPress();
