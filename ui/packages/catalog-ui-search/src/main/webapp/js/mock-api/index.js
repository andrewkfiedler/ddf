const mockDataMap = {
  './internal/metacardtype': require('./metacardtype.json'),
  './internal/config': require('./config.json'),
  './internal/platform/config/ui': require('./metacardtype.json'),
  './internal/enumerations/attribute/datatype': require('./datatype.json'),
}

module.exports = url => {
  const data = mockDataMap[url]
  if (data === undefined) {
    throw new Error(`Unknown url '${url}' for mock api.`)
  }
  return data
<<<<<<< HEAD
}
=======
}
>>>>>>> 6cbb6a2d9c6db8c4d0411ff5ddfceb47394ff4ad
