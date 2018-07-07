module.exports = {
  namespace: 'App/Models',
  models: {
    News: {
      fields: {
        _id: {},
        title: {},
        body: { type: 'html', listable: false }
      },
      hooks: {
        beforeCreate (model) {
          model.is_approved = false
        }
      }
    }
  }
}
