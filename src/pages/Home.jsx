import { addDoc, collection, getFirestore } from 'firebase/firestore'
import { app } from '../firebase'
import { useState } from 'react'
import { nanoid } from 'nanoid'
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage'
import imageCompression from 'browser-image-compression' // Import image compression library
import InputOptions from '../components/InputOptions'
import { toast } from 'react-toastify'
import { Outlet, redirect } from 'react-router-dom'

const continents = ['Europe', 'Asia', 'Africa', 'North America']
const categories = [
  'Islands',
  'Vip',
  'Farms',
  'Earth homes',
  'Beachfront',
  'Amazing pools',
  'Castles',
]

const Home = () => {
  const db = getFirestore(app)
  const storage = getStorage(app)
  const [continent, setContinent] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [mainImage, setMainImage] = useState(null)
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [subImages, setSubImages] = useState([null, null, null])
  const [price, setPrice] = useState('')

  // Function to handle image compression
  const compressImage = async (image) => {
    const options = {
      maxSizeMB: 1, // Max file size in MB
      maxWidthOrHeight: 800, // Max width/height in pixels
      useWebWorker: true,
    }

    try {
      const compressedFile = await imageCompression(image, options)
      return compressedFile
    } catch (error) {
      console.error('Error compressing image:', error)
      return image // Return the original image if compression fails
    }
  }

  const handleImageUpload = async (image, path) => {
    const compressedImage = await compressImage(image) // Compress the image before uploading
    const imageRef = ref(storage, path)
    await uploadBytes(imageRef, compressedImage)
    return getDownloadURL(imageRef)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      continent.trim() === '' ||
      category.trim() === '' ||
      description.trim() === '' ||
      !mainImage ||
      subImages.includes(null) ||
      price.trim() === '' ||
      name.trim() === '' ||
      country.trim() === ''
    ) {
      alert('Please fill in all fields')
      return
    }

    try {
      const mainImagePath = `items/main_${Date.now()}`
      const mainURL = await handleImageUpload(mainImage, mainImagePath)

      const subURLs = await Promise.all(
        subImages.map(async (image, index) => {
          if (image) {
            const subImagePath = `items/sub_${index}_${Date.now()}`
            return await handleImageUpload(image, subImagePath)
          }
          return null
        })
      )

      const data = await addDoc(collection(db, `data`), {
        id: nanoid(),
        name: name,
        continent,
        country: country,
        price: price,
        description,
        category,
        mainImageURL: mainURL,
        subImageURLs: subURLs.filter((url) => url !== null),
      })

      if (data) {
        toast.success('successfully added')
        setContinent('')
        setPrice('')
        setName('')
        setCountry('')
        setCategory('')
        setDescription('')
        setSubImages([null, null, null])
        setMainImage(null)
        setTimeout(() => {
          location.reload()
        }, 2000)
      }
    } catch (e) {
      console.error('Error adding document: ', e)
      alert('An error occurred while adding the item. Please try again.')
      toast.error(e.message || 'An error occurred')
    }
  }

  return (
    <div className='max-w-7xl mx-auto px-8 h-screen flex items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='w-[90vw] card bg-base-100 shadow-xl sm:max-w-[600px]'
      >
        <div className='card-body'>
          <h2 className='card-title text-center'>Add New Item</h2>
          <select
            className='input-md bg-base-300'
            onChange={(e) => setContinent(e.target.value)}
            value={continent}
          >
            <option value='' disabled>
              Select Continent
            </option>
            {continents.map((continent, index) => {
              return <InputOptions key={index} value={continent} />
            })}
          </select>
          <select
            className='input-md bg-base-300'
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <option value='' disabled>
              Select Category
            </option>
            {categories.map((category, index) => {
              return <InputOptions key={index} value={category} />
            })}
          </select>
          <input
            type='file'
            onChange={(e) => setMainImage(e.target.files[0])}
          />
          {subImages.map((_, index) => (
            <input
              key={index}
              type='file'
              onChange={(e) => {
                const newSubImages = [...subImages]
                newSubImages[index] = e.target.files[0]
                setSubImages(newSubImages)
              }}
            />
          ))}
          <input
            type='text'
            placeholder='Name'
            className='py-2 input bg-base-300'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type='text'
            placeholder='Country'
            className='py-2 input bg-base-300'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <input
            type='text'
            placeholder='Price'
            className='py-2 input bg-base-300'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <textarea
            className='input bg-base-200 h-24'
            placeholder='Describe your place here'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type='submit' className='btn btn-primary'>
            Add Item
          </button>
        </div>
      </form>
    </div>
  )
}

export default Home
