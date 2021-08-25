import { firebase } from './firebase.service'
import cuid from 'cuid'

const verifyToken = async (token = null) => {
  try {
    console.log('Verify token [START]')

    console.log('TOKEN:')
    console.log(token)

    const auth = firebase.getAuth()

    const results = await auth.verifyIdToken(token)

    console.log('VERIFY RESULTS:')
    console.log(results)

    console.log('Verify token [END]')

    return results
  } catch (err) {
    console.log('Verify token [ERROR]')
    console.log(err)
    return {}
  }
}

const signup = async (signupData = null) => {
  try {
    console.log('Signup [START]')

    const auth = firebase.getAuth()
    const firestore = firebase.getFirestore()

    const { userName, email, password } = signupData

    const userData = {
      uid: cuid(),
      displayName: userName,
      email,
      password,
    }

    // Create firebase user
    const user = await auth.createUser(userData)

    // Add user custom claims
    await auth.setCustomUserClaims(user.uid, { dataId: user.uid, role: 'root' })

    const batch = firestore.batch()

    const dataPath = `data/${user.uid}`

    // Batch root data document creation
    const dataRef = firestore.doc(dataPath)

    batch.set(dataRef, {
      dataId: user.uid,
      name: signupData.userName,
      customerId: cuid(),
      subscriptionId: cuid(),
      planId: cuid(),
      active: true,
      settings: {
        tempDir: '',
      },
      queuePassword: cuid(),
    })

    // Batch user profile creation
    const userProfileRef = firestore.doc(`${dataPath}/users/${user.uid}`)

    batch.set(userProfileRef, {
      dataId: user.uid,
      name: signupData.userName,
      email: signupData.email,
      password: signupData.password,
      role: 'root',
    })

    // Batch initial gateway creation
    const gatewayId = `${user.uid}-${cuid()}`
    const gatewayRef = firestore.doc(`${dataPath}/gateway/${gatewayId}`)

    batch.set(gatewayRef, {
      stateOn: false,
    })

    // Create data document and user profile
    await batch.commit()

    console.log('Signup [DONE]')
    return user
  } catch (err) {
    console.log('Signup [ERROR]')
    return null
  }
}

const update = async (token, userId, userData) => {
  try {
    console.log('Update user [START]')
    const claims = await verifyToken(token)

    const { name, email, password } = userData || {}

    const newAuthData = {}

    if (name) newAuthData.displayName = name
    if (email) newAuthData.email = email
    if (password) newAuthData.password = password

    const auth = firebase.getAuth()

    if (Object.keys(newAuthData).length > 0) {
      console.log(`update ${userId} with:`)
      console.log(newAuthData)
      await auth.updateUser(userId, newAuthData)
    }

    const firestore = firebase.getFirestore()
    const path = `data/${claims.dataId}/users/${userId}`

    console.log(`update ${path} with:`)
    console.log(userData)

    const ref = firestore.doc(`data/${claims.dataId}/users/${userId}`)

    await ref.update(userData)

    console.log('Update user [END]')
    return true
  } catch (err) {
    console.log('Update user [ERROR]')
    console.log(err)
    return false
  }
}

const add = async (token, userData) => {
  try {
    console.log('Add user [START]')
    const claims = await verifyToken(token)

    const { name: displayName, email, password } = userData || {}

    const uid = cuid()

    const newAuthData = {
      uid,
      displayName,
      email,
      password,
    }

    const auth = firebase.getAuth()

    const newUser = await auth.createUser(newAuthData)

    await auth.setCustomUserClaims(newUser.uid, {
      dataId: claims.dataId,
      role: 'none',
    })

    if (!newUser) {
      return false
    }

    const firestore = firebase.getFirestore()
    const path = `data/${claims.dataId}/users/${uid}`

    const ref = firestore.doc(path)

    await ref.set({
      ...userData,
      dataId: claims.dataId,
      role: '',
    })

    console.log('Add user [END]')
    return true
  } catch (err) {
    console.log('Add user [ERROR]')
    console.log(err)
    return false
  }
}

const remove = async (token, userId) => {
  try {
    console.log('Remove user [START]')

    const claims = await verifyToken(token)

    const auth = firebase.getAuth()

    console.log(`userId: ${userId}`)

    await auth.deleteUser(userId)

    const firestore = firebase.getFirestore()
    const path = `data/${claims.dataId}/users/${userId}`

    console.log(`remove ${path}`)

    const ref = firestore.doc(`data/${claims.dataId}/users/${userId}`)

    await ref.delete()

    console.log('Remove user [END]')
    return true
  } catch (err) {
    console.log('Remove user [ERROR]')
    console.log(err)
    return false
  }
}

export const auth = {
  verifyToken,
  signup,
  update,
  add,
  remove,
}
