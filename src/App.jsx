import { lazy, Suspense, useEffect, useRef } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import { useScroll } from './lib/hooks.js'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Gallery from './pages/Gallery.jsx'
import Home from './pages/Home.jsx'
import News from './pages/News.jsx'
import NotFound from './pages/NotFound.jsx'
import County from './pages/County.jsx'
import Delivery from './pages/Delivery.jsx'
import Events, { EventDetail } from './pages/Events.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Projects from './pages/Projects.jsx'
import AdminBar from './components/AdminBar.jsx'
import AdminProvider from './components/AdminProvider.jsx'

// The dashboard (and Firebase Auth) is only downloaded when someone opens /admin.
const AdminApp = lazy(() => import('./pages/admin/AdminApp.jsx'))

const TITLES = {
  '/about': 'About',
  '/delivery': 'The Governor’s office',
  '/county': 'Homa Bay County',
  '/projects': 'Projects',
  '/events': 'Events',
  '/news': 'News',
  '/gallery': 'Gallery',
  '/contact': 'Contact',
}

/** Old /engagements/:id links now live under Events. */
function EngagementRedirect() {
  const { id } = useParams()
  return <Navigate to={`/events/${id}`} replace />
}

function Layout() {
  const { pathname, hash } = useLocation()
  const bar = useRef(null)

  // Links like /about#positions land on that section once the page has rendered.
  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    return () => clearTimeout(t)
  }, [pathname, hash])

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
    const section = TITLES[pathname] || (pathname.startsWith('/projects/') ? 'Project' : pathname.startsWith('/events/') ? 'Event' : '')
    document.title = section
      ? `${section} | Gladys Wanga, Governor of Homa Bay County`
      : 'Gladys Wanga | Governor of Homa Bay County'
  }, [pathname])

  useScroll((y) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    bar.current?.style.setProperty('--p', max > 0 ? Math.min(1, y / max) : 0)
  })

  return (
    <AdminProvider>
      <a href="#content" className="skip">Skip to content</a>
      <div className="scroll-progress" ref={bar} aria-hidden="true" />
      <Navbar />
      <main id="content" key={pathname} className="page">
        <Outlet />
      </main>
      <Footer />
      <AdminBar />
    </AdminProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="delivery" element={<Delivery />} />
        <Route path="county" element={<County />} />
        <Route path="positions" element={<Navigate to="/about#positions" replace />} />
        <Route path="engagements" element={<Navigate to="/events" replace />} />
        <Route path="engagements/:id" element={<EngagementRedirect />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetail />} />
        <Route path="news" element={<News />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route
        path="admin/*"
        element={
          <Suspense fallback={<p style={{ padding: 40 }}>Loading the dashboard…</p>}>
            <AdminApp />
          </Suspense>
        }
      />
    </Routes>
  )
}
