import { CometChat } from '@cometchat-pro/chat'
import { setGlobalState } from './store'

const CONSTANTS = {
  APP_ID: process.env.REACT_APP_COMET_CHAT_APP_ID,
  REGION: process.env.REACT_APP_COMET_CHAT_REGION,
  Auth_Key: process.env.REACT_APP_COMET_CHAT_AUTH_KEY,
}

const initCometChat = async () => {
  try {
    const appID = CONSTANTS.APP_ID
    const region = CONSTANTS.REGION

    const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build()

    await CometChat.init(appID, appSetting).then(() =>
      console.log('Initialization completed successfully')
    )
  } catch (error) {
    console.log(error)
  }
}

const loginWithCometChat = async (UID) => {
  try {
    const authKey = CONSTANTS.Auth_Key
    await CometChat.login(UID, authKey).then((user) =>
      setGlobalState('currentUser', user)
    )
    return true
  } catch (error) {
    console.log(error)
  }
}

const signInWithCometChat = async (UID, name) => {
  try {
    let authKey = CONSTANTS.Auth_Key
    const user = new CometChat.User(UID)
    user.setName(name)

    return await CometChat.createUser(user, authKey).then((user) => user)
  } catch (error) {
    console.log(error)
  }
}

const logOutWithCometChat = async () => {
  try {
    await CometChat.logout().then(() => console.log('Logged Out Successfully'))
  } catch (error) {
    console.log(error)
  }
}

const isUserLoggedIn = async () => {
    await CometChat.getLoggedinUser()
    .then((user) => setGlobalState('currentUser', user))
    .catch((error) => console.log('error getting details:', { error }))

    return true
}

const getMessages = async (UID) => {
  try {
    const limit = 30
    const messagesRequest = await new CometChat.MessagesRequestBuilder()
      .setUID(UID)
      .setLimit(limit)
      .build()

    return await messagesRequest.fetchPrevious().then((messages) => messages)
  } catch (error) {
    console.log(error)
  }
}

const sendMessage = async (receiverID, messageText) => {
  try {
    const receiverType = CometChat.RECEIVER_TYPE.USER
    const textMessage = await new CometChat.TextMessage(
      receiverID,
      messageText,
      receiverType
    )

    return await CometChat.sendMessage(textMessage).then((message) => message)
  } catch (error) {
    console.log(error)
  }
}

const getConversations = async () => {
  try {
    const limit = 30
    const conversationsRequest = new CometChat.ConversationsRequestBuilder()
      .setLimit(limit)
      .build()

    return await conversationsRequest
      .fetchNext()
      .then((conversationList) => conversationList)
  } catch (error) {
    console.log(error)
  }
}

export {
  initCometChat,
  loginWithCometChat,
  signInWithCometChat,
  logOutWithCometChat,
  getMessages,
  sendMessage,
  getConversations,
  isUserLoggedIn
}
