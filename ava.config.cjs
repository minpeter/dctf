require('dotenv').config()

module.exports = {
  environmentVariables: {
    API_ENDPOINT: '/api'
  },
  files: ['test/**/*.js'],
  timeout: '30000'
}
