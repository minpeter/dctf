import 'dotenv/config'
import path from 'path'
import fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import { promises as fs } from 'fs'
import mustache from 'mustache'
import { clientConfig } from './config/client'

const serveIndex = async (fastify, opts) => {
  const indexTemplate = (await fs.readFile(opts.indexPath)).toString()

  const rendered = mustache.render(indexTemplate, {
    jsonConfig: JSON.stringify(clientConfig),
    config: {
      ...clientConfig,
      renderGoogleAnalytics: clientConfig.globalSiteTag !== undefined
    }
  })

  const routeHandler = async (req, reply) => {
    void reply.type('text/html; charset=UTF-8')
    void reply.send(rendered)
  }

  fastify.get('/', routeHandler)
  fastify.get('/index.html', async (req, reply) => reply.redirect(301, '/'))
  fastify.get('//*', async (req, reply) => reply.redirect(302, '/'))
  fastify.setNotFoundHandler(routeHandler)
}

const app = fastify()

const staticPath = path.join(__dirname, '../build')

app.register(serveIndex, {
  indexPath: path.join(staticPath, 'index.html')
})

app.register(fastifyStatic, {
  root: staticPath,
  setHeaders: (res, path) => {
    if (/\.[0-9a-f]{5}\.((esm\.)?js|css)$/.test(path)) {
      res.setHeader('Cache-Control', 'public, immutable, max-age=31536000')
    }
  }
})

const port = process.env.PORT || 4000
app.listen(port, '::', (err) => {
  if (err) {
    app.log.error(err)
  }
})
