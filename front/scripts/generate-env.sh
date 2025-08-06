#!/bin/sh
echo "Generating environment files..."

mkdir -p src/environments

cat <<EOF > src/environments/environment.ts
export const environment = {
  production: false,
  GOOGLE_CLIENT_ID: "${GOOGLE_CLIENT_ID}",
  GOOGLE_MAP_API: "${GOOGLE_MAP_API}"
};
EOF

cat <<EOF > src/environments/environment.prod.ts
export const environment = {
  production: true,
  GOOGLE_CLIENT_ID: "${GOOGLE_CLIENT_ID}",
  GOOGLE_MAP_API: "${GOOGLE_MAP_API}"
};
EOF
