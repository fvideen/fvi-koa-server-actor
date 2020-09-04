'use strict'

const chai = require('chai')

const actors = require('fvi-actor-system')
const nodeUtils = require('fvi-node-utils')

const index = require('../src')
const utils = require('./utils')

const config = nodeUtils.config({
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

describe('Testing API /support', () => {
    let sys = null
    let root = null
    let app = null
    let server = null

    before(async () => {
        sys = actors()
        root = await sys.rootActor()

        app = await index(root, config)

        server = await app.start()
    })

    after(() => {
        sys.destroy()
    })

    it('Testing Echo "testing"', done => {
        chai.request(server.instance)
            .get(`/support/echo/testing`)
            .then(res => {
                utils.verifyResponseStatusEquals(res, 200)
                utils.verifyResponseBodyEquals(res, { result: 'testing' })
                done()
            })
            .catch(done)
    })

    it('Testing Ping/Pong', done => {
        chai.request(server.instance)
            .get(`/support/ping`)
            .then(res => {
                utils.verifyResponseStatusEquals(res, 200)
                utils.verifyResponseBodyEquals(res, { result: 'pong' })
                done()
            })
            .catch(done)
    })

    it('Testing Health', done => {
        chai.request(server.instance)

            .get(`/support/health`)
            .then(res => {
                utils.verifyResponseStatusEquals(res, 200)
                chai.assert.exists(res.body.process, 'Not exists res.process!')
                chai.assert.exists(res.body.server, 'Not exists res.server!')
                done()
            })
            .catch(done)
    })
})
