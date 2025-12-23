import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import { createYoga } from 'graphql-yoga'

import { env } from './env'
import { schema } from './graphql/schema'
import { buildContext } from './graphql/context'
import { toGraphQLError } from './shared/errors/toGraphQLError'

const app = fastify({ logger: true })

const yoga = createYoga<{
  req: FastifyRequest
  reply: FastifyReply
}>({
  schema,
  graphqlEndpoint: '/graphql',
  context: buildContext,

  maskedErrors: {
    maskError(error) {
      return toGraphQLError(error)
    },
  },

  logging: {
    debug: (...args) => args.forEach((a) => app.log.debug(a)),
    info: (...args) => args.forEach((a) => app.log.info(a)),
    warn: (...args) => args.forEach((a) => app.log.warn(a)),
    error: (...args) => args.forEach((a) => app.log.error(a)),
  },
})

app.register(cors, {
  origin: true,
  credentials: true,
})

app.route({
  url: yoga.graphqlEndpoint,
  method: ['GET', 'POST', 'OPTIONS'],
  handler: (req, reply) =>
    yoga.handleNodeRequestAndResponse(req, reply, { req, reply }),
})

app
  .listen({ port: env.PORT, host: '0.0.0.0' })
  .then(() => {
    app.log.info(
      `🚀 GraphQL ready at http://localhost:${env.PORT}${yoga.graphqlEndpoint}`
    )
  })
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
