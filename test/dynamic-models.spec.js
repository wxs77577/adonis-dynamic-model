const test = require('japa')
const { ioc, registrar } = require('@adonisjs/fold')
const { setupResolver, Config } = require('@adonisjs/sink')
const path = require('path')

test.group('test', group => {
  group.before(async () => {
    setupResolver()
    ioc.bind('Adonis/Src/Config', () => {
      const config = new Config()
      config.set('dynamic-model', require('../config/dynamic-model'))
      return config
    })
    ioc.bind('Model', () => {
      return class Model { }
    })
  })

  test('config', async (assert) => {
    const config = ioc.use('Adonis/Src/Config').get('dynamic-model')
    assert.equal(config.namespace, 'App/Models')
    assert.nestedInclude(config, { 'models.News.fields.body.type': 'html' })
  })
  test('provider', async (assert) => {
    await registrar.providers([
      path.join(__dirname, '../providers/DynamicModelProvider')
    ]).registerAndBoot()
    const News = ioc.use('App/Models/News')
    assert.isDefined(News)
    assert.nestedInclude(News, { 'fields.body.type': 'html' })
  })
})
