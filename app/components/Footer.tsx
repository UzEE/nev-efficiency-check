export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} NEV Efficiency Check.</p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://github.com/UzEE/nev-efficiency-check"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
          <span>Built with TanStack Start + Bun</span>
        </div>
      </div>
    </footer>
  )
}
