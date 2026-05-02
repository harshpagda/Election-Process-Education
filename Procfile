git:
  depth: false

deploy:
  main:
    command: npm run build
    - npm run start

env:
  - key: NODE_ENV
    value: production
  - key: MONGODB_URI
    value: ${{ secrets.MONGODB_URI }}
  - key: JWT_SECRET
    value: ${{ secrets.JWT_SECRET }}
  - key: OPENAI_API_KEY
    value: ${{ secrets.OPENAI_API_KEY }}
  - key: CLIENT_URL
    value: ${{ secrets.CLIENT_URL }}

buildpacks:
  - url: heroku/nodejs
