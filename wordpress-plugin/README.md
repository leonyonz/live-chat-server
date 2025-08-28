# WordPress Plugin for Live Chat Server

This directory contains the WordPress plugin that allows easy integration of the Live Chat Server with WordPress websites.

## Directory Structure

```
wordpress-plugin/
├── live-chat-wordpress/           # Main plugin directory
│   ├── live-chat-wordpress.php    # Main plugin file
│   └── readme.txt                 # Plugin documentation for WordPress
├── build-plugin.sh                # Script to package the plugin
└── README.md                      # This file
```

## Installation

1. Package the plugin by running the build script:
   ```bash
   cd wordpress-plugin
   ./build-plugin.sh
   ```

2. This will create a `live-chat-wordpress.zip` file that can be installed directly in WordPress.

3. Alternatively, you can manually copy the `live-chat-wordpress` directory to your WordPress plugins directory:
   ```bash
   cp -r live-chat-wordpress /path/to/your/wordpress/wp-content/plugins/
   ```

## Configuration

After activating the plugin in WordPress:

1. Go to Settings > Live Chat in the WordPress admin panel
2. Enter your chat server URL (e.g., https://your-chat-server.com)
3. Configure the widget position and z-index as needed
4. Save the settings

The chat widget will automatically appear on all pages of your WordPress site.

## Shortcode Usage

You can embed the chat widget in specific posts or pages using the shortcode:

```
[live_chat]
```

You can also specify dimensions:

```
[live_chat width="100%" height="600px"]
