import Link from "next/link"
import { Heart, Calendar, MapPin } from 'lucide-react'
import styles from './page.module.css'

export default function HomePage() {
  return (
    <div className={styles.container}>
      {/* header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Heart className={styles.logoIcon} />
            <span className={styles.logoText}>Aggie Fundraisers</span>
          </div>
          <nav className={styles.nav}>
            <Link href="/fundraisers">
              <button className={styles.navButton}>Browse</button>
            </Link>
            <Link href="/login">
              <button className={`${styles.navButton} ${styles.navButtonOutline}`}>Login</button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero section */}
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span className={styles.heroMiniText}>Supporting UC Davis Clubs</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Support Local Fundraisers While Shopping Downtown
            </h1>
            
            <p className={styles.heroDescription}>
              {'Discover fundraising events from UC Davis clubs and support your community while enjoying downtown Davis!'}
            </p>

            <div className={styles.heroButtons}>
              <Link href="/fundraisers">
                <button className={styles.primaryButton}>Start Supporting</button>
              </Link>
              <Link href="/create">
                <button className={styles.secondaryButton}>Create Fundraiser</button>
              </Link>
            </div>
          </div>
        </section>


        {/* advertising section */}
        <section className={styles.features}>
          <div className={styles.featuresContent}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Heart />
              </div>
              <h3 className={styles.featureTitle}>Support Local Clubs</h3>
              <p className={styles.featureDescription}>
                Help UC Davis student organizations raise funds for their activities and events.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Calendar />
              </div>
              <h3 className={styles.featureTitle}>Find Events</h3>
              <p className={styles.featureDescription}>
                Discover fundraising events happening around downtown Davis in one convenient place.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <MapPin />
              </div>
              <h3 className={styles.featureTitle}>Shop & Support</h3>
              <p className={styles.featureDescription}>
                Support fundraisers while shopping at your favorite downtown Davis locations.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2025 #include</p>
        </div>
      </footer>
    </div>
  )
}
