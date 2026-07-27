#!/bin/bash

echo "========================================="
echo " Creating Express MVC Backend"
echo "========================================="

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
    echo "Usage:"
    echo "./init-backend.sh project-name"
    exit 1
fi

mkdir $PROJECT_NAME
cd $PROJECT_NAME

echo "Initializing npm..."
npm init -y

echo "Installing dependencies..."

npm install express sequelize pg pg-hstore dotenv bcrypt jsonwebtoken cors helmet morgan

echo "Installing dev dependencies..."

npm install -D nodemon

echo "Creating folders..."

mkdir src

mkdir src/config
mkdir src/controllers
mkdir src/models
mkdir src/routes
mkdir src/middlewares
mkdir src/services
mkdir src/utils

touch src/app.js
touch src/server.js

touch src/config/database.js

touch src/controllers/auth.controller.js

touch src/models/index.js
touch src/models/user.model.js

touch src/routes/auth.routes.js

touch src/middlewares/logger.js
touch src/middlewares/authenticate.js
touch src/middlewares/errorHandler.js
touch src/middlewares/validateRegister.js
touch src/middlewares/validateLogin.js

touch .env
touch .env.example
touch README.md
touch .gitignore

echo "Creating .gitignore..."

cat > .gitignore <<EOF
node_modules
.env
EOF

echo "Creating .env.example..."

cat > .env.example <<EOF
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=marhba
DB_USER=postgres
DB_PASSWORD=password

JWT_SECRET=your_secret
EOF

echo "Updating package.json..."

node - <<'EOF'
const fs=require('fs')

const pkg=JSON.parse(fs.readFileSync('package.json'))

pkg.type="module"

pkg.scripts={
    dev:"nodemon src/server.js",
    start:"node src/server.js"
}

fs.writeFileSync("package.json",JSON.stringify(pkg,null,2))
EOF

echo ""
echo "========================================="
echo " Project Created Successfully!"
echo "========================================="

tree -a