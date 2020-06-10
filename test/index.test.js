'use strict'

const chai = require('chai')

const actors = require('fvi-actor-system')
const utils = require('fvi-node-utils')

const app = require('../app')

const config = utils.config({
    server: {
        name: {
            doc: 'Koa Server Name',
            format: String,
            default: 'unknown-koa-server',
            env: 'KOA_SERVER_NAME',
            arg: 'koa-server-name',
        },
        port: {
            doc: 'Koa Server Port',
            format: 'port',
            default: 4000,
            env: 'KOA_SERVER_PORT',
            arg: 'koa-server-port',
        },
        version: {
            doc: 'Koa Server Version',
            format: String,
            default: '1.0.0',
            env: 'KOA_SERVER_VERSION',
            arg: 'koa-server-version',
        },
    },
})

describe('Testing initialization', () => {
    let sys = null
    let root = null

    before(async () => {
        sys = actors()
        root = await sys.rootActor()
    })

    after(() => {
        sys.destroy()
    })

    it('Testing initialize - OK', done => {
        app(root, config)
            .then(serverActor => {
                chai.assert.exists(serverActor, 'Not exists serverActor!')
                done()
            })
            .catch(done)
    })

    it('Testing start - OK', done => {
        app(root, config)
            .then(serverActor => serverActor.start())
            .then(server => {
                chai.assert.exists(server, 'Not exists server!')
                done()
            })

            .catch(done)
    })
})
