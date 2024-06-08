import Carousel from './Carousel'

import { deleteDoc, doc, getFirestore } from 'firebase/firestore'
import { getStorage, ref, deleteObject } from 'firebase/storage'
import { app } from '../firebase'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const Slider = ({ images, id, price, name, country, docId }) => {
  const db = getFirestore(app)
  const storage = getStorage(app)

  const deleteItem = async (id, images) => {
    try {
      // Delete images from Firebase Storage
      const deletePromises = images.map((image) => {
        const imageRef = ref(storage, image)
        return deleteObject(imageRef)
      })
      await Promise.all(deletePromises)

      // Delete document from Firestore
      await deleteDoc(doc(db, 'data', id))

      toast.success('Successfully deleted')
      location.reload()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className='w-full bg-base-200 pb-2 rounded-b-lg'>
      <Carousel key={id} slides={images} />

      <div className='p-2'>
        <h2 className='font-bold'>${price}</h2>
        <h3>
          {name}, {country}
        </h3>
        <article className='flex gap-2 py-2'>
          <button
            className='btn btn-secondary btn-sm'
            onClick={() => deleteItem(docId, images)}
          >
            delete
          </button>
          <Link to={`/products/${docId}`} className='btn btn-primary btn-sm'>
            Update
          </Link>
        </article>
      </div>
    </div>
  )
}

export default Slider
