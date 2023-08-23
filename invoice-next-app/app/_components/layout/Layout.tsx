 
// Layout is a Server Component by default
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
      </nav>
      <main>
        {children}
      </main>
    </>
  )
}
