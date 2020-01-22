import { combineReducers } from 'redux'

import bot from './bot'
import bots from './bots'
import content, { ContentReducer } from './content'
import flows, { FlowReducer } from './flows'
import hints from './hints'
import improvements from './improvements'
import language from './language'
import modules from './modules'
import ndu from './ndu'
import notifications from './notifications'
import skills from './skills'
import ui from './ui'
import user, { UserReducer } from './user'
export * from './selectors'

const bpApp = combineReducers({
  bots,
  content,
  flows,
  ui,
  user,
  bot,
  modules,
  notifications,
  improvements,
  skills,
  language,
  hints,
  ndu
})
export default bpApp

export interface RootReducer {
  flows: FlowReducer
  user: UserReducer
  content: ContentReducer
}
