# Blog Post Management - Quick Commands

## 1. Login and get token
```bash
curl -k -X POST "https://localhost:8443/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "commenttester@example.com", "password": "password123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4
```

## 2. List all posts (copy the token from step 1)
```bash
curl -k -X GET "https://localhost:8443/api/v1/posts" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  | python3 -m json.tool
```

## 3. Delete a specific post
```bash
curl -k -X DELETE "https://localhost:8443/api/v1/posts/POST_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Quick Examples:

### List posts with titles only:
```bash
curl -k -s -X GET "https://localhost:8443/api/v1/posts" | \
grep -o '"title":"[^"]*"' | cut -d'"' -f4
```

### List posts with IDs and titles:
```bash
curl -k -s -X GET "https://localhost:8443/api/v1/posts" | \
grep -E '"id"|"title"' | paste - - | \
sed 's/"id":"\([^"]*\)".*"title":"\([^"]*\)".*/\1 | \2/'
```

## Current Authentication Token:
Run this to get a fresh token:
```bash
TOKEN=$(curl -k -s -X POST "https://localhost:8443/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "commenttester@example.com", "password": "password123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"
```

Then use it for operations:
```bash
# List posts
curl -k -X GET "https://localhost:8443/api/v1/posts" -H "Authorization: Bearer $TOKEN"

# Delete a post
curl -k -X DELETE "https://localhost:8443/api/v1/posts/POST_ID" -H "Authorization: Bearer $TOKEN"
```
