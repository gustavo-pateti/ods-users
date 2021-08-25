import admin from 'firebase-admin'

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT)

let initialized = false

/**
 * Initialize firebase-admin app.
 */
const init = () => {
  try {
    console.log('Init firebase-admin [START]')
    if (!initialized) {
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

      initialized = true
      console.log('Init firebase-admin [DONE]\n')
    } else {
      console.log('Init firebase-admin [Already initialized] [DONE]\n')
    }
  } catch (err) {
    console.log('Init firebase-admin [ERROR]')
    throw err
  }
}

/**
 * Get firebase auth object.
 */
const getAuth = () => admin.auth()

/**
 * Get firebase firestore object.
 */
const getFirestore = () => admin.firestore()

export const firebase = {
  init,
  getAuth,
  getFirestore,
}
