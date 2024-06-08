import { useState, useEffect } from 'react'
import { doc, getFirestore, onSnapshot, updateDoc } from 'firebase/firestore'
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { useNavigate, useParams } from 'react-router-dom'
import { app } from '../firebase'
import { toast } from 'react-toastify'

const UpdateProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [isImgSet, setIsImgSet] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [country, setCountry] = useState('')
  const [mainImg, setMainImg] = useState(null)
  const [subImg, setSubImg] = useState([null, null, null])
  const [loading, setLoading] = useState(false)
  const db = getFirestore(app)
  const storage = getStorage(app)

  useEffect(() => {
    const docRef = doc(db, 'data', id)
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        setProduct(data)
        setName(data.name)
        setPrice(data.price)
        setCountry(data.country)
        setSubImg([null, null, null]) // Reset subImg state
      } else {
        console.log('No such document!')
      }
    })

    return () => unsubscribe()
  }, [db, id])

  const deleteImg = async (images) => {
    const deletePromises = images.map((image) => {
      const imageRef = ref(storage, image)
      return deleteObject(imageRef).catch((error) =>
        console.error('Failed to delete image:', error)
      )
    })
    await Promise.all(deletePromises)
  }

  const handleImageUpload = async (file, storagePath) => {
    if (!file) return null
    const storageRef = ref(storage, storagePath)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let mainImgURL = product.mainImageURL
      let subImgURLs = [...product.subImageURLs]

      if (isImgSet) {
        // Delete old main image if a new one is provided
        if (mainImg) {
          await deleteImg([product.mainImageURL])
          mainImgURL = await handleImageUpload(
            mainImg,
            `items/main_${Date.now()}`
          )
        }

        // Update sub-images if provided, otherwise retain the old URLs
        const updatedSubImgURLs = await Promise.all(
          subImg.map(async (file, index) => {
            if (file) {
              await deleteImg([product.subImageURLs[index]])
              return await handleImageUpload(
                file,
                `items/sub_${index}_${Date.now()}`
              )
            } else {
              return product.subImageURLs[index]
            }
          })
        )

        subImgURLs = updatedSubImgURLs
      }

      const updatedData = {
        name,
        price,
        country,
        mainImageURL: mainImgURL,
        subImageURLs: subImgURLs,
      }

      await updateDoc(doc(db, 'data', id), updatedData)
      setLoading(false)
      toast.success('Product updated successfully!')
      navigate('/products')
    } catch (error) {
      setLoading(false)
      console.error('Error updating document:', error)
      alert('Failed to update product')
    }
  }

  if (!product) {
    return (
      <div className='text-center'>
        <p className='loading'>Loading...</p>
      </div>
    )
  }

  return (
    <div className='max-w-7xl grid'>
      <h1>Update Product</h1>
      <div>
        <h3>Main Image:</h3>
        {product.mainImageURL && (
          <img
            src={product.mainImageURL}
            className='max-w-[650px] w-[80vw] rounded-lg h-[24rem]'
            alt='Main Image'
          />
        )}
        <label className='block mt-4'>
          Update Main Image:
          <input
            type='file'
            onChange={(e) => {
              setMainImg(e.target.files[0])
              setIsImgSet(true)
            }}
          />
        </label>
      </div>
      <div className='py-6'>
        <h3>Sub Images:</h3>

        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {product.subImageURLs.map((subImage, index) => (
            <div key={index}>
              {subImage && (
                <img
                  src={subImage}
                  alt={`Sub Image ${index}`}
                  className='w-full h-[10rem] object-cover rounded-md lg:h-[16rem]'
                />
              )}
              <label>
                Update Sub Image {index + 1}:
                <input
                  type='file'
                  onChange={(e) => {
                    const files = [...subImg]
                    files[index] = e.target.files[0]
                    setSubImg(files)
                    setIsImgSet(true)
                  }}
                />
              </label>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleUpdate}>
        <div className='flex items-center py-2'>
          <label className='gap-4 inline-flex '>
            Name:
            <input
              type='text'
              className='input input-sm input-bordered'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>
        <div className='flex items-center py-2'>
          <label className='gap-6 inline-flex '>
            Price:
            <input
              type='text'
              value={price}
              className='input input-sm input-bordered'
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
        </div>
        <div className='flex items-center py-2'>
          <label className='gap-1 inline-flex '>
            Country:
            <input
              type='text'
              value={country}
              className='input input-sm input-bordered'
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>
        </div>
        <button
          type='submit'
          disabled={loading}
          className='btn btn-primary btn-sm my-2'
        >
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  )
}

export default UpdateProduct
