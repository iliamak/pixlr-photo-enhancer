import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <h1 className="text-4xl font-bold text-center">Улучшение качества фотографий</h1>
      <p className="text-xl text-center max-w-2xl">
        Простой инструмент для быстрого повышения качества ваших изображений с помощью профессиональных инструментов Pixlr
      </p>
      
      <div className="flex gap-4 mt-8">
        <Link href="/enhance" className="btn">
          Начать улучшение
        </Link>
      </div>
    </div>
  )
}