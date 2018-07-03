this._compilation.compiler.options.mode === 'development' ? ({
    style: {
        patterns: ['dev(/)'],
        component: 'dev/component/dev/dev.view',
        menu: {
          text: 'Style Guide',
          classes: 'is-bold'
        }
    }
}) : ({})