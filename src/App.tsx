import { useEffect, useState } from 'react'

const WINDOW_W = window.innerWidth
const WINDOW_H = window.innerHeight
const IS_PC = WINDOW_W > 1024
const DANGO_R = IS_PC ? 32 : 16

const Sanbou = () => {
  return (
    <div className='absolute bottom-5 lg:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center'>
      <div className='w-60 border-b-60 lg:w-120 lg:border-b-120 border-b-[#E4D7C6] border-l-50 border-l-transparent border-r-50 border-r-transparent z-10' />
      <div className='w-60 h-6 lg:w-120 lg:h-12 bg-[#D4C7B6] z-10 -mb-10 shadow-lg' />
      <div className='flex relative'>
        <div className='w-6 h-40 lg:w-12 lg:h-80 skew-y-45 bg-[#E4D7C6]' />
        <div className='absolute w-8 h-8 lg:w-16 lg:h-16 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#230E04]' />
        <div className='mt-3 w-30 h-40 lg:mt-6 lg:w-60 lg:h-80 bg-[#D4C7B6]' />
        <div className='w-6 h-40 lg:w-12 lg:h-80 -skew-y-45 bg-[#C4B7A6]' />
      </div>
    </div>
  )
}

const Cloud = ({
  w,
  x,
  y,
  z,
}: {
  w: number
  x: number
  y: number
  z: number
}) => {
  return (
    <div
      className='absolute bg-gradient-to-br bg-gradient-from-white bg-gradient-via-gray-100 bg-gradient-to-gray-400'
      style={{
        width: `${w}px`,
        height: `${w * 0.6}px`,
        left: `${x}px`,
        top: `${y}px`,
        zIndex: z,
        maskImage: 'url(/cloud.svg)',
        maskSize: '100% 100%',
      }}
    />
  )
}

const Dango = ({ x, y, color }: { x: number; y: number; color: string }) => {
  return (
    <div
      className={
        'absolute bottom-110 rounded-full shadow-md bg-gradient-to-tl ' + color
      }
      style={{
        left: `${x}px`,
        bottom: `${y}px`,
        width: `${DANGO_R * 2}px`,
        height: `${DANGO_R * 2}px`,
      }}
    />
  )
}

type DangoType = {
  id: number
  x: number
  y: number
  color: string
}

type CloudType = {
  id: number
  w: number
  x: number
  y: number
  z: number
  v: number
}

const COLORS = [
  'bg-gradient-from-[#B48B67] bg-gradient-via-[#E2CFBB] bg-gradient-to-[#EFEEE7]',
  'bg-gradient-from-yellow-500 bg-gradient-via-yellow-200 bg-gradient-to-white',
  'bg-gradient-from-green-500 bg-gradient-via-green-300 bg-gradient-to-white',
  'bg-gradient-from-red-500 bg-gradient-via-red-300 bg-gradient-to-white',
  'bg-gradient-from-purple-500 bg-gradient-via-purple-300 bg-gradient-to-white',
  'bg-gradient-from-black bg-gradient-via-dark bg-gradient-to-white',
]

const randomColor = (rand: number) => {
  switch (true) {
    case rand < 0.9:
      return COLORS[0]
    case rand < 0.96:
      return COLORS[1]
    case rand < 0.97:
      return COLORS[2]
    case rand < 0.98:
      return COLORS[3]
    case rand < 0.99:
      return COLORS[4]
    default:
      return COLORS[5]
  }
}

const App = () => {
  const [dangos, setDangos] = useState<DangoType[]>([])
  const [clouds, setClouds] = useState<CloudType[]>([])

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.1) {
        const w = 50 + Math.random() * 50
        const v = IS_PC ? 0.5 + Math.random() * 0.5 : 0.2 + Math.random() * 0.5
        setClouds((prev) => [
          ...prev,
          {
            id: new Date().getTime(),
            w,
            x: 0 - w,
            y: Math.random() * 200,
            z: Math.random() < 0.5 ? 0 : 1,
            v,
          },
        ])
      }
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(function loop() {
      setClouds((prev) =>
        prev
          .map((cloud) => ({
            ...cloud,
            x: cloud.x + cloud.v,
          }))
          .filter((cloud) => cloud.x < WINDOW_W)
      )
      requestAnimationFrame(loop)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <main
      className='h-[100dvh] bg-gradient-to-t bg-gradient-from-blue-900 bg-gradient-via-dark bg-gradient-to-black overflow-hidden'
      onClick={(e) => {
        setDangos([
          ...dangos,
          {
            id: dangos.length,
            x: e.clientX - DANGO_R,
            y: WINDOW_H - e.clientY - DANGO_R,
            color: randomColor(Math.random()),
          },
        ])
      }}
    >
      {clouds.map((cloud) => (
        <Cloud key={cloud.id} w={cloud.w} x={cloud.x} y={cloud.y} z={cloud.z} />
      ))}
      <Sanbou />
      <div
        className='absolute top-10 left-10 w-20 h-20 lg:top-20 lg:left-20 lg:w-30 lg:h-30 bg-gradient-to-tl bg-gradient-from-yellow-400 bg-gradient-via-yellow-500 bg-gradient-to-yellow-800 rounded-full'
        style={{
          boxShadow: '0 0 100px 10px #FFF, 0 0 50px 2px #FF0',
        }}
      />
      {dangos.map((dango) => (
        <Dango key={dango.id} x={dango.x} y={dango.y} color={dango.color} />
      ))}
    </main>
  )
}

export default App
