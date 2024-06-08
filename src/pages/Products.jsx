import React, { useState, useEffect } from 'react'
import { app } from '../firebase'
import { collection, getDocs, getFirestore, query } from 'firebase/firestore'
import Slider from '../components/Slider'

const Products = () => {
  const [items, setItems] = useState([])
  const db = getFirestore(app)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const q = query(collection(db, `data`))
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }))
        // console.log(data)
        setItems(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error('Error fetching items:', error)
      }
    }

    fetchItems()
  }, [db])
  if (loading) {
    return (
      <div className='py-16 text-center'>
        <p className='loading'></p>
      </div>
    )
  }
  return (
    <div className='max-w-7xl mx-auto px-8 h-screen flex flex-col'>
      <div className='py-6'>
        <div className='images-container grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {items.map((item, index) => {
            const images = [item.mainImageURL, ...item.subImageURLs]
            return <Slider key={item.id} images={images} {...item} />
          })}
        </div>
      </div>
    </div>
  )
}

export default Products
