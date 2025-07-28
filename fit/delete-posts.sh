#!/bin/bash

# Blog Post Management Script
# Usage: ./delete-posts.sh [list|delete|login]

BASE_URL="https://localhost:8443/api/v1"
TOKEN_FILE=".auth_token"

# Function to login and store token
login() {
    echo "Logging in..."
    response=$(curl -k -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email": "commenttester@example.com", "password": "password123"}')
    
    token=$(echo $response | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$token" ]; then
        echo $token > $TOKEN_FILE
        echo "✅ Login successful! Token saved."
    else
        echo "❌ Login failed!"
        exit 1
    fi
}

# Function to list all posts
list_posts() {
    echo "📝 Fetching all posts..."
    curl -k -s -X GET "$BASE_URL/posts" | python3 -c "
import json, sys
try:
    posts = json.load(sys.stdin)
    for post in posts:
        print(f'🔹 ID: {post[\"id\"]}')
        print(f'   📝 Title: {post[\"title\"]}')
        print(f'   👤 Author: {post[\"author\"][\"name\"]}')
        print()
except:
    print('❌ Failed to parse posts')
"
}

# Function to delete a post by ID
delete_post() {
    if [ -z "$1" ]; then
        echo "❌ Please provide a post ID"
        echo "Usage: $0 delete <post-id>"
        exit 1
    fi
    
    POST_ID="$1"
    
    if [ ! -f "$TOKEN_FILE" ]; then
        echo "🔐 No auth token found. Logging in first..."
        login
    fi
    
    TOKEN=$(cat $TOKEN_FILE)
    
    echo "🗑️  Deleting post: $POST_ID"
    response=$(curl -k -s -w "%{http_code}" -X DELETE "$BASE_URL/posts/$POST_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    if [[ "$response" == *"204"* ]]; then
        echo "✅ Post deleted successfully!"
    elif [[ "$response" == *"401"* ]]; then
        echo "🔐 Authentication expired. Logging in again..."
        login
        TOKEN=$(cat $TOKEN_FILE)
        response=$(curl -k -s -w "%{http_code}" -X DELETE "$BASE_URL/posts/$POST_ID" \
            -H "Authorization: Bearer $TOKEN")
        if [[ "$response" == *"204"* ]]; then
            echo "✅ Post deleted successfully!"
        else
            echo "❌ Failed to delete post. Response: $response"
        fi
    else
        echo "❌ Failed to delete post. Response: $response"
    fi
}

# Main script logic
case "$1" in
    "login")
        login
        ;;
    "list")
        list_posts
        ;;
    "delete")
        delete_post "$2"
        ;;
    *)
        echo "📖 Blog Post Management Script"
        echo ""
        echo "Usage:"
        echo "  $0 login          - Login and save authentication token"
        echo "  $0 list           - List all posts with IDs"
        echo "  $0 delete <id>    - Delete a specific post by ID"
        echo ""
        echo "Examples:"
        echo "  $0 list"
        echo "  $0 delete 2d4373e7-21a5-4b79-8bad-2607e8ea7cbe"
        ;;
esac
