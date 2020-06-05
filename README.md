# fvi-koa-server-actor

-   `npm run compile`: Executa a limpeza dos arquivos e diretorios.
-   `npm run debug-test`: Executa os testes unitários com o DEBUG ativo.
-   `npm run test`: Executa os testes unitários.
-   `npm run debug-dev`: Executa os testes unitários e espera por alterações com o DEBUG ativo.
-   `npm run dev`: Executa os testes unitários e espera por alterçãoes.
-   `npm run prod`: Executa o código com NODE_ENV=production.
-   `npm run coverage`: Executa os testes unitários e retorna a cobertura dos códigos através do [nyc](https://github.com/istanbuljs/nyc/)
-   `npm run release`: Inicia uma nova release de versão incrementando o **patch**, [git flow](https://github.com/nvie/gitflow/) release start.
-   `npm run release:minor`: Inicia uma nova release de versão incrementando o **minor**, [git flow](https://github.com/nvie/gitflow/) release start.
-   `npm run release:major`: Inicia uma nova release de versão incrementando o **major**, [git flow](https://github.com/nvie/gitflow/) release start.
-   `npm run release:finish`: Finaliza a release, ou seja, realiza o [git flow](https://github.com/nvie/gitflow/) release finish.

## FVI - Koa Server Actor

Ator que implementa um servidor http utilizando a lib [fvi-koa-server](https://console.aws.amazon.com/codesuite/codecommit/repositories/fvi-koa-server/browse?region=us-east-1). Esta biblioteca necessita como parâmetros iniciais um **ator pai** e um objeto de configuração que será detalhado abaixo. 

Esta biblioteca foi desenvolvida para ser utilizada em conjunto com a biblioteca [i-actor-system](https://console.aws.amazon.com/codesuite/codecommit/repositories/i-actor-system/browse?region=us-east-1) ou com a biblioteca [comedy.js](https://github.com/untu/comedy).

## Configuração

Esta biblioteca utiliza uma instância da biblioteca [node-convict.js](https://github.com/mozilla/node-convict), ou qualquer outra biblioteca que respeitar o contrato abaixo:

```javascript
config.get('prop1.prop2.prop3'): Object
config.has('prop1.prop2.prop3'): Boolean
config.getProperties(): Object
```

> Exemplo de outra biblioteca que pode ser utilizada é [node-config.js](https://github.com/lorenwest/node-config)

Existe um contrato para as propriedades em um arquivo de configuração para o funcionamento correto deste módulo, devemos configurar as informações como o exemplo, _convict_, abaixo:

```javascript
const config = convict({
    "server": {
        "name": {
            "doc": "Koa Server Name",
            "format": String,
            "default": "unknown-koa-server",
            "env": "KOA_SERVER_NAME",
            "arg": "koa-server-name"
        },
        "port": {
            "doc": "Koa Server Port",
            "format": "port",
            "default": 4000,
            "env": "KOA_SERVER_PORT",
            "arg": "koa-server-port"
        },
        "version": {
            "doc": "Koa Server Version",
            "format": String,
            "default": "1.0.0",
            "env": "KOA_SERVER_VERSION",
            "arg": "koa-server-version"
        }
    }
})
```

## Mode de Usar

```javascript
const actors = require('i-actor-system')
const utils  = require('fvi-node-utils')

const severActor = require('fvi-koa-server-actor')

const ctg = config({
    server: {
        name: {
            doc: "Koa Server Name",
            format: String,
            default: "unknown-koa-server",
            env: "KOA_SERVER_NAME",
            arg: "koa-server-name"
        },
        port: {
            doc: "Koa Server Port",
            format: "port",
            default: 4000,
            env: "KOA_SERVER_PORT",
            arg: "koa-server-port"
        },
        version: {
            doc: "Koa Server Version",
            format: String,
            default: "1.0.0",
            env: "KOA_SERVER_VERSION",
            arg: "koa-server-version"
        }
    }
})

const system = actors()

system.rootActor()
    .then(root => serverActor(root, cfg))
    .then(serverActor => serverActor.start())
    .then(server => console.log(server))
    .catch(error => console.error(error))
```

### `serverActor` Object

Este é o _Object_ que representa as funções que o ator **fvi-koa-server-actor** possui, somente encontraremos uma função `.start()` que inicia o servidor http. Esta biblioteca não disponibiliza uma função para destruir ou fechar o server porque temos a função `.destroy()` do próprio ator que vai fechar a conexão e destruir o servidor para nós.

A função `.start()` retorna uma `Promise<Server>`, onde podemos acessar o objeto explicado abaixo:

### `server` Object

-   `server.instance`: Aqui temos a instância do servidor HTTP. Podemos somente acessar a função `server.instance.close(): void` para fechar o servidor, ou melhor, fechar a conexão aberta.
-   `server.info`: Um _Object_ com informações do servidor, como `info.name` e `info.version`.
-   `server.env`: Um _Object_ com informações do ambiente do servidor, como `env.port`, etc.
