import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'

const Carousel = ({ slides }) => {
  const [curr, setCurr] = useState(0)
  const [active, setActive] = useState(false)

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1))
  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1))

  return (
    <div
      className='overflow-hidden relative transition-all duration-150'
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div
        className='flex transition-transform ease-out duration-500'
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides.map((img, index) => (
          <img
            key={index}
            src={img}
            alt=''
            className='h-[16rem] w-full object-cover rounded-md flex-shrink-0'
          />
        ))}
      </div>
      <div className='absolute inset-0 flex items-center justify-between p-4'>
        <button
          onClick={prev}
          className={`p-1 rounded-full shadow bg-white/80 text-gray-500 hover:bg-white ${
            active ? '' : 'hidden'
          }`}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className={`p-1 rounded-full shadow bg-white/80 text-gray-500 hover:bg-white ${
            active ? '' : 'hidden'
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className='absolute bottom-4 right-0 left-0'>
        <div className='flex items-center justify-center gap-2'>
          {slides.map((_, i) => (
            <div
              key={i}
              className={`transition-all w-2 h-2 bg-white rounded-full ${
                curr === i ? 'p-2' : 'bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Carousel
