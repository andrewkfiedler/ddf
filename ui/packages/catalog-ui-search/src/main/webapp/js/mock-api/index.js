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
}
