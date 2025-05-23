import { CareerMatcher } from "../../../components/career-matcher";

export default function CareerMatcherPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl mb-2">
            Career Match
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover the perfect career path based on your unique skills and expertise
          </p>
        </header>
        <CareerMatcher />
      </div>
    </main>
  )
}
