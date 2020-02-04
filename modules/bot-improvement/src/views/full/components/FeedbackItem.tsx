import { Button, Card, Elevation, HTMLSelect, Label, Divider } from '@blueprintjs/core'
import _ from 'lodash'
import React, { FC } from 'react'
import moment from 'moment'

import { FeedbackItem, FeedbackItemState, Goal, QnAItem } from '../../../backend/typings'
import style from '../style.scss'

const FeedbackItemComponent: FC<{
  feedbackItem: FeedbackItem
  correctedActionType: string
  correctedObjectId: string
  onItemClicked: () => void
  contentLang: string
  qnaItems: QnAItem[]
  goals: Goal[]
  handleCorrectedActionTypeChange: (correctedActionType: string) => void
  handleCorrectedActionObjectIdChange: (correctedActionObjectId: string) => void
  markAsSolved: () => void
  markAsPending: () => void
  state: FeedbackItemState
  current: boolean
}> = props => {
  const {
    feedbackItem,
    correctedActionType,
    correctedObjectId,
    contentLang,
    onItemClicked,
    qnaItems,
    goals,
    handleCorrectedActionTypeChange,
    handleCorrectedActionObjectIdChange,
    markAsSolved,
    markAsPending,
    state,
    current
  } = props

  const getId = (prefix: string) => {
    return `${prefix}-${feedbackItem.eventId}`
  }

  const selectTypeId = getId('select-type')
  const objectId = getId('object')

  return (
    <Card
      interactive={true}
      elevation={current ? Elevation.THREE : Elevation.ZERO}
      className={`${style.feedbackItem} ` + (current ? style.current : '')}
      onClick={e => onItemClicked()}
    >
      <div style={{ marginRight: '5%' }}>
        <h4>Details</h4>
        <div>Event Id: {feedbackItem.eventId}</div>
        <div>Session ID: {feedbackItem.sessionId}</div>
        <div>Timestamp: {moment(feedbackItem.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</div>
        <div>
          <h4>Detected Intent</h4>
          Type: {feedbackItem.source.type === 'qna' ? 'Q&A' : 'Start Goal'}
          {feedbackItem.source.type === 'qna' && (
            <div>Question: {feedbackItem.source.qnaItem.data.questions[contentLang][0]}</div>
          )}
          {feedbackItem.source.type === 'goal' && <div>Start Goal:</div>}
        </div>
      </div>
      <Divider style={{ marginRight: '3%' }} />
      <div className={style.intentCorrectionForm}>
        <h4>Intent shoud have been:</h4>

        <Label>
          Type
          <HTMLSelect
            id={selectTypeId}
            onClick={e => e.stopPropagation()}
            onChange={e => handleCorrectedActionTypeChange(e.target.value)}
          >
            <option selected={correctedActionType === 'qna'} value="qna">
              Q&A
            </option>
            <option selected={correctedActionType === 'start_goal'} value="start_goal">
              Start Goal
            </option>
          </HTMLSelect>
        </Label>

        <Label>
          {correctedActionType === 'qna' ? 'Question' : 'Goal'}
          <HTMLSelect
            id={objectId}
            onClick={e => e.stopPropagation()}
            onChange={e => handleCorrectedActionObjectIdChange(e.target.value)}
          >
            {correctedActionType === 'qna' &&
              qnaItems.map((i, idx) => (
                <option key={`qnaItem-${idx}`} selected={correctedObjectId === i.id} value={i.id}>
                  {i.data.questions[contentLang][0]}
                </option>
              ))}
            {correctedActionType === 'start_goal' &&
              goals.map((i, idx) => (
                <option key={`goal-${idx}`} selected={correctedObjectId === i.id} value={i.id}>
                  {i.id}
                </option>
              ))}
          </HTMLSelect>
        </Label>

        {state === 'pending' && (
          <Button icon="tick" onClick={e => markAsSolved()}>
            Mark as solved
          </Button>
        )}
        {state === 'solved' && (
          <Button icon="issue" onClick={e => markAsPending()}>
            Mark as pending
          </Button>
        )}
      </div>
    </Card>
  )
}

export default FeedbackItemComponent