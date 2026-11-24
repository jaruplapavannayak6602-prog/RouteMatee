import { useState } from 'react'
import {
  ArrowRight, ArrowUpRight, MapPin, CalendarDays, Clock3, Users,
  ShieldCheck, Route, MessageCircle, Wallet, Menu, X, Leaf, CarFront,
  CheckCircle2, Navigation, ChevronDown
} from 'lucide-react'
import { searchJourneys } from './lib/api'

const journeyTypes = [
  { id: 'now', title: 'Travel now', desc: 'Find passengers travelling immediately.', icon: Navigation, tag: 'On-demand' },
  { id: 'scheduled', title: 'Schedule a ride', desc: 'Plan ahead and connect before you leave.', icon: CalendarDays, tag: 'Plan ahead' },
  { id: 'commute', title: 'Daily commute', desc: 'Find regular partners for work or college.', icon: Route, tag: 'Recurring' }
]

const steps = [
  ['01', 'Create your account', 'Sign up and set up a profile with the details you choose to share.'],
  ['02', 'Enter your journey', 'Add your pickup, destination, date and preferred departure time.'],
  ['03', 'Find compatible routes', 'Discover people whose journeys overlap with yours.'],
  ['04', 'Connect privately', 'Send or accept a request and discuss the details in chat.'],
  ['05', 'Agree on the journey', 'Confirm the plan together, with mutual consent.'],
  ['06', 'Split the expenses', 'Independently arrange your cab and agree how to share the cost.']
]

const features = [
  { icon: Route, title: 'Intelligent route matching', desc: 'Discover journeys with a shared direction, not just an identical destination.' },
  { icon: MapPin, title: 'Local and intercity', desc: 'Search for nearby trips, airport journeys and longer intercity routes.' },
  { icon: ShieldCheck, title: 'Trust-focused profiles', desc: 'Verification and reporting tools designed to support safer connections.' },
  { icon: MessageCircle, title: 'Private messaging', desc: 'Talk through pickup points, timing and plans before agreeing.' },
  { icon: Wallet, title: 'Fair cost sharing', desc: 'Discuss and agree on expenses directly with your travel partners.' },
  { icon: CalendarDays, title: 'Flexible journeys', desc: 'Look for immediate, scheduled or recurring commute partners.' }
]

function App() {
  const [type, setType] = useState('now')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [form, setForm] = useState({ pickup: '', destination: '', date: '', time: '', passengers: '1' })
  const [status, setStatus] = useState({ loading: false, message: '', error: false })

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  async function submit(e) {
    e.preventDefault()
    if (!form.pickup.trim() || !form.destination.trim()) {
      setStatus({ loading: false, message: 'Please enter both pickup and destination.', error: true }); return
    }
    if (form.pickup.trim().toLowerCase() === form.destination.trim().toLowerCase()) {
      setStatus({ loading: false, message: 'Pickup and destination must be different.', error: true }); return
    }
    setStatus({ loading: true, message: '', error: false })
    try {
      const result = await searchJourneys({ ...form, journeyType: type })
      setStatus({ loading: false, message: result.message || 'Your search has been received. Matching journeys will appear here when available.', error: false })
    } catch (err) {
      setStatus({ loading: false, message: `${err.message} Make sure the backend is running.`, error: true })
    }
  }

  const nav = <><a href="#home" onClick={() => setMobileOpen(false)}>Home</a><a href="#how" onClick={() => setMobileOpen(false)}>How it works</a><a href="#find" onClick={() => setMobileOpen(false)}>Find a ride</a><a href="#about" onClick={() => setMobileOpen(false)}>About</a></>
  return <div>
    <header className="header">
      <div className="nav-wrap">
        <a className="brand" href="#home" aria-label="RouteMatee home"><span className="brand-mark"><Route size={22}/></span><span>Route<span className="brand-light">Matee</span><small>TRAVEL TOGETHER</small></span></a>
        <nav className="desktop-nav">{nav}</nav>
        <div className="nav-actions"><a className="login" href="#signup">Log in</a><a className="btn btn-small" href="#signup">Sign up <ArrowUpRight size={15}/></a></div>
        <button className="menu-btn" aria-label="Toggle menu" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X/> : <Menu/>}</button>
      </div>
      {mobileOpen && <nav className="mobile-nav">{nav}<a href="#signup">Log in / Sign up</a></nav>}
    </header>

    <main>
      <section className="hero section" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse"></span> A smarter way to share your journey</div>
          <h1>Your destination,<br/><em>someone else’s too.</em></h1>
          <p className="hero-sub">Find people travelling your way, share a cab and split the cost. Travel smarter, together.</p>
          <div className="hero-buttons"><a className="btn" href="#find">Find travel partners <ArrowRight size={17}/></a><a className="text-link" href="#how">See how it works <ArrowUpRight size={16}/></a></div>
          <div className="hero-note"><ShieldCheck size={17}/> Connect first. Decide together. Travel on your terms.</div>
        </div>
        <div className="hero-art" aria-label="Illustration of two routes meeting on a map">
          <div className="art-top"><span><span className="live-dot"></span> YOUR ROUTE, CONNECTED</span><span className="art-menu">•••</span></div>
          <div className="map-art">
            <div className="map-grid"></div>
            <svg viewBox="0 0 520 340" role="img" aria-label="Illustrative route map with two paths meeting">
              <path d="M-10 270 C100 245 90 120 200 150 S330 260 530 55" fill="none" stroke="#dce6dd" strokeWidth="25" strokeLinecap="round"/>
              <path d="M-10 270 C100 245 90 120 200 150 S330 260 530 55" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="7 10"/>
              <path d="M55 300 C145 245 155 205 250 185 S370 145 450 5" fill="none" stroke="#b7e36a" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 10"/>
              <path d="M55 300 C145 245 155 205 250 185 S370 145 450 5" fill="none" stroke="#123d2a" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="55" cy="300" r="10" fill="#123d2a" stroke="#fff" strokeWidth="4"/><circle cx="450" cy="5" r="10" fill="#b7e36a" stroke="#123d2a" strokeWidth="4"/>
              <circle cx="250" cy="185" r="18" fill="#fff" stroke="#b7e36a" strokeWidth="5"/><path d="M244 185h12m-6-6v12" stroke="#123d2a" strokeWidth="2"/>
            </svg>
            <div className="map-label label-start"><span className="pin-dot"></span><b>Pickup point</b><small>Your starting place</small></div>
            <div className="map-label label-end"><span className="pin-dot lime"></span><b>Shared direction</b><small>Routes come together</small></div>
            <div className="map-chip"><CarFront size={16}/> One journey. Shared costs.</div>
          </div>
          <div className="art-bottom"><span><b>RouteMatee</b><small>Illustrative route preview</small></span><span className="mini-route"><i></i><i></i><i></i></span></div>
        </div>
      </section>

      <section className="search-section" id="find">
        <div className="search-heading"><div><div className="eyebrow">START YOUR JOURNEY</div><h2>Where are you headed?</h2><p>Tell us a little about your trip. We’ll help you find people going your way.</p></div><span className="search-badge"><Leaf size={15}/> Share the ride, not your privacy</span></div>
        <div className="journey-tabs">{journeyTypes.map(item => { const Icon = item.icon; return <button key={item.id} className={`journey-card ${type === item.id ? 'selected' : ''}`} onClick={() => setType(item.id)} aria-pressed={type === item.id}><span className="journey-icon"><Icon size={21}/></span><span className="journey-text"><b>{item.title}</b><small>{item.desc}</small></span><span className="journey-tag">{item.tag}</span></button> })}</div>
        <form className="search-form" onSubmit={submit}>
          <label className="field"><span>FROM</span><div><MapPin size={18}/><input value={form.pickup} onChange={update('pickup')} placeholder="Pickup location" required autoComplete="street-address"/></div></label>
          <span className="swap-line"><ArrowRight size={18}/></span>
          <label className="field"><span>TO</span><div><Navigation size={18}/><input value={form.destination} onChange={update('destination')} placeholder="Destination" required/></div></label>
          <label className="field"><span>DATE</span><div><CalendarDays size={18}/><input type="date" value={form.date} onChange={update('date')} min={new Date().toISOString().slice(0,10)} required/></div></label>
          <label className="field"><span>TIME</span><div><Clock3 size={18}/><input type="time" value={form.time} onChange={update('time')} required/></div></label>
          <label className="field passengers"><span>PASSENGERS</span><div><Users size={18}/><select value={form.passengers} onChange={update('passengers')}><option value="1">1 passenger</option><option value="2">2 passengers</option><option value="3">3 passengers</option><option value="4">4 passengers</option></select><ChevronDown className="select-chevron" size={15}/></div></label>
          <button className="btn search-submit" disabled={status.loading}>{status.loading ? 'Searching…' : 'Find travel partners'} <ArrowRight size={17}/></button>
        </form>
        {status.message && <div className={`form-message ${status.error ? 'error' : ''}`} role="status">{status.error ? '!' : <CheckCircle2 size={17}/>} {status.message}</div>}
        <div className="map-preview"><div className="map-preview-visual"><div className="preview-road road-one"></div><div className="preview-road road-two"></div><div className="preview-path"></div><span className="preview-pin p1"><MapPin size={19}/></span><span className="preview-pin p2"><MapPin size={19}/></span><span className="preview-meet">Route overlap</span></div><div className="map-preview-copy"><span className="eyebrow">ROUTE MATCHING</span><h3>Going in the same direction?</h3><p>
  RouteMatee is designed to find overlapping journeys,
  even when travellers have different final destinations.
</p><small>Map preview is illustrative and does not show live passenger locations.</small></div></div>
      </section>

      <section className="how-section section" id="how"><div className="section-heading"><div className="eyebrow">SIMPLE BY DESIGN</div><h2>Six steps. One shared journey.</h2><p>You stay in control at every step. Nothing is booked automatically.</p></div><div className="steps-grid">{steps.map(([n,t,d]) => <article className="step" key={n}><span className="step-number">{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>

      <section className="features-section"><div className="section section-inner"><div className="section-heading left"><div className="eyebrow">THE ROUTEMATEE DIFFERENCE</div><h2>More than sharing a cab.</h2><p>Thoughtful tools to make finding a compatible travel partner simpler.</p></div><div className="feature-grid">{features.map(({icon:Icon,title,desc})=><article className="feature" key={title}><span className="feature-icon"><Icon size={22}/></span><h3>{title}</h3><p>{desc}</p></article>)}</div></div></section>

      <section className="safety-section section" id="about"><div className="safety-card"><div className="safety-copy"><div className="eyebrow light">TRUST COMES FIRST</div><h2>Good journeys start with feeling safe.</h2><p>We’re building RouteMatee around informed choices, clear communication and mutual consent.</p><a className="btn btn-lime" href="#safety">Explore safety principles <ArrowRight size={17}/></a></div><div className="safety-list" id="safety"><div><ShieldCheck/><span><b>Mobile and email verification</b><small>Confirm control of contact details.</small></span></div><div><Users/><span><b>Ratings and reporting</b><small>Tools to share feedback and flag concerns.</small></span></div><div><MessageCircle/><span><b>Mutual consent</b><small>Connect only when both sides agree.</small></span></div><div><CheckCircle2/><span><b>Emergency guidance</b><small>Clear access to local emergency resources.</small></span></div></div></div></section>

      <section className="cta-section section" id="signup"><div><div className="eyebrow">YOUR NEXT JOURNEY STARTS HERE</div><h2>Same route. Better together.</h2><p>Create your RouteMatee account and make your next journey a shared one.</p></div><a className="btn" href="mailto:hello@routematee.in?subject=RouteMatee%20early%20access">Get early access <ArrowUpRight size={17}/></a></section>
    </main>
    <footer className="footer"><div className="footer-main"><a className="brand brand-footer" href="#home"><span className="brand-mark"><Route size={22}/></span><span>Route<span className="brand-light">Matee</span><small>SAME ROUTE. SAME RIDE. HALF THE FARE.</small></span></a><p>An independent passenger-matching platform. You connect with fellow travellers and arrange transport independently.</p><div className="footer-links"><div><b>Explore</b><a href="#home">Home</a><a href="#how">How it works</a><a href="#find">Find a ride</a></div><div><b>RouteMatee</b><a href="#about">About us</a><a href="mailto:hello@routematee.in">Contact</a><a href="#safety">Safety guidelines</a></div><div><b>Information</b><a href="#privacy">Privacy policy</a><a href="#terms">Terms & conditions</a><a href="#faqs">FAQs</a></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} RouteMatee. All rights reserved.</span><span>Made for journeys across India <span className="india-dot">●</span></span></div></footer>
  </div>
}
export default App
