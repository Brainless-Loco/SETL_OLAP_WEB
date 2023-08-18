import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './firebaseConfig'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const firebaseApp = initializeApp(firebaseConfig)
const storageRef = getStorage(firebaseApp)
const fireStoreRef = getFirestore(firebaseApp)
const rtdbRef = getDatabase(firebaseApp)
const authRef = getAuth(firebaseApp)

export default firebaseApp
export {
    storageRef,
    fireStoreRef,
    rtdbRef,
    authRef,
}