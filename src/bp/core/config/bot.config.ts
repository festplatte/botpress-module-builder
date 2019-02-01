export interface LogsConfig {
  /**
   * Logs will be kept in the database for this period of time
   * @default 1 week
   */
  expiration: string
}

export interface DialogConfig {
  /**
   * @default 5m
   */
  timeoutInterval: string
  /**
   * @default 30m
   */
  sessionTimeoutInterval: string
  /** The content element to send to the end-user when an unexpected error occur in a flow */
  error?: {
    /** The content type of the element */
    contentType: string
    /**
     * The form data of the element
     * @example {"text": "Whoops! An error occurred. Please try something else.", "typing": true},
     */
    args
  }
}

export type BotConfig = {
  $schema?: string
  /** An identifier for the bot, represents the folder name on the file system. It is also used in the URL */
  id: string
  /** The name of the bot, used for display purpose only */
  name: string
  description?: string
  author?: string
  /**
   * @default 1.0.0
   */
  version: string
  imports: {
    /** An array of content types that will be available using this bot */
    contentTypes: string[]
  }
  dialog?: DialogConfig
  logs?: LogsConfig
}

export const BOT_DIRECTORIES = ['actions', 'flows', 'entities', 'content-elements', 'intents', 'qna']