#!/bin/bash

API="http://localhost:4741"
URL_PATH="/items"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "item": {
      "name": "'"${NAME}"'",
      "category": "'"${CATEGORY}"'",
      "storage": "'"${STORAGE}"'",
      "expiration": "'"${EXPIRATION}"'",
      "volume": "'"${VOLUME}"'",
      "unit": "'"${UNIT}"'"
    }
  }'

echo
