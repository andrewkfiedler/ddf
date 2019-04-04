import Entry from './js/Entry'
import Navigator from './extension-points/navigator'
import FilterActions from './extension-points/filter-actions'

// don't forget to remove these, this is only for testing downstream
Entry({
  navigator: Navigator,
  filterActions: FilterActions,
})
