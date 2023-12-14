import 'dotenv/config'

import app from './app'

const port = process.env.PORT || 3000
app.listen(port, '::', (err) => {
  if (err) {
    app.log.error(err)
  }
})
