'use strict'

const path = require('path')

const serve = require('koa-static')
const mount = require('koa-mount')
const favicon = require('koa-favicon')
const Router = require('koa-router')

const STATIC_DIR = path.join(path.resolve(), 'static')

const setFavicon = server => server.use(favicon(path.join(STATIC_DIR, '/favicon.ico')))
const setApiDoc = server => server.use(mount('/api-doc', serve(path.join(STATIC_DIR, 'api-doc'))))

const actor = async (parentActor, config) => {
    // Init with '//' get absolute path to instantiate actor
    const actorPath = `//${path.join(__dirname, '/actors/server-actor')}`
    const actor = await parentActor.createChild(actorPath, { mode: 'in-memory' })

    return {
        STATIC_DIR,
        Router,
        mount,
        favicon,
        serve,
        start: async () => {
            const server = await actor.sendAndReceive('start', config)
            return setApiDoc(setFavicon(server))
        },
    }
}

module.exports = actor
