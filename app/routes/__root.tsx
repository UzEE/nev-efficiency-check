import {
  HeadContent,
  Outlet,
  Scripts,
  ScrollRestoration,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import globalStyles from '../styles/globals.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'NEV Efficiency Check',
      },
      {
        name: 'description',
        content:
          'Interactive Total Cost of Ownership simulator for ICE, HEV, PHEV, and BEV drivetrains in Pakistan.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: globalStyles,
      },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-slate-950 text-slate-50 antialiased">
        <Header />
        <div id="app-shell" className="min-h-[calc(100vh-160px)] flex flex-col">
          <Outlet />
        </div>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <Devtools />
      </body>
    </html>
  )
}

function Devtools() {
  if (!import.meta.env.DEV) {
    return null
  }

  return (
    <TanStackDevtools
      config={{
        position: 'bottom-left',
      }}
      plugins={[
        {
          name: 'TanStack Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  )
}

function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12 text-center">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-slate-400">404</p>
        <h1 className="text-3xl font-semibold">Route not found</h1>
        <p className="text-base text-slate-300">
          The page you are looking for does not exist. Use the navigation to head back to the
          simulator.
        </p>
      </div>
    </div>
  )
}
