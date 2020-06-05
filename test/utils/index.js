'use strict'

const chai = require('chai')
const chaiHttp = require('chai-http')

const utils = require('fvi-node-utils')

chai.use(chaiHttp)
chai.should()

const verifyResponseStatusEquals = (res, status) => {
    chai.assert.equal(status, res.status, `response.status != ${status}`)
}

const verifyResponseStatusDiff = (res, status) => {
    chai.assert.notEqual(status, res.status, `response.status == ${status}`)
}

const verifyResponseBodyEquals = (res, equalsBody) => {
    verifyResponseStatusEquals(res, 200)
    chai.assert.deepEqual(
        equalsBody,
        res.body,
        `response.body != ${utils.objects.inspect(equalsBody)}`
    )
}

module.exports = {
    verifyResponseBodyEquals,
    verifyResponseStatusDiff,
    verifyResponseStatusEquals,
}
