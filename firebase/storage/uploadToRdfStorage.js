import { getStorage, ref, uploadBytes } from "firebase/storage"

const uploadToRdfStorage = async (file) => {
    const storage = getStorage()
    const storageRef = ref(storage, 'rdfsource/' + file.name)

    var snap = null

    uploadBytes(storageRef, file).then(snapshot => {
        console.log("Uploaded successfully!\nSnapshot:", snapshot)
    })
}

export default uploadToRdfStorage