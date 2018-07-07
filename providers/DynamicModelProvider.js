const { ServiceProvider } = require('@adonisjs/fold')

module.exports = class DynamicModelProvider extends ServiceProvider {
  register () {
    this._registerDynamicModels()
  }

  boot () {

  }

  _registerDynamicModels () {
    const Config = this.app.use('Adonis/Src/Config')
    const config = Config.get('dynamic-model')
    const BaseModel = this.app.use('Model')

    for (let [name, options] of Object.entries(config.models)) {
      this.app.bind(`${config.namespace}/${name}`, () => {
        return class Model extends BaseModel {
          static get fields () {
            return options.fields
          }
          static boot () {
            super.boot()
            for (let [eventName, callback] of Object.entries(options.hooks)) {
              this.addHook(eventName, callback)
            }
          }
        }
      })
    }
  }
}
