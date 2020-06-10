'use strict'

const server = require('fvi-koa-server')

module.exports = class ServerActor {
    destroy() {
        if (this.server) {
            this.server.instance.close()
        }
    }

    async start(config) {
        this.server = await server(config)
        return this.server
    }
}
