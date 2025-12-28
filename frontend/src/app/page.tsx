//landing page component rendering homepage UI + providing nav to browse fundraisers or log in 

"use client"

import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Calendar, Heart, MapPin } from 'lucide-react'
import { useAuth } from "@/contexts/AuthContext"
import Navigation from "@/components/Navigation"
import styles from './page.module.css'
import Image from "next/image"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleCreateFundraiser = () => {
    if (isAuthenticated) {
      router.push("/dashboard/create")
    } else {
      router.push("/login")
    }
  }
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"  style={{ backgroundImage: "url('/.jpg')" }}>
        <div className={styles.container}>
          <Navigation />

          {/* hero section */}
          <main className={styles.main}>
            <section className={styles.hero}>
              <div className={styles.heroContent}>
                 {/*  
                <div className={styles.badge}>
                  <span className={styles.heroMiniText}>Supporting UC Davis Clubs</span>
                </div>
                */}
                
                <h1 className={styles.heroTitle}>
                  Support Local Fundraisers While Shopping Downtown
                </h1>
                
                <p className={styles.heroDescription}>
                  {'All of your favorite UC Davis club fundraisers in one place.'}
                </p>

                <div className={styles.heroButtons}>
                  <Link href="/fundraisers">
                    <button className={styles.primaryButton}>Start Supporting</button>
                  </Link>
                  <button 
                    onClick={handleCreateFundraiser}
                    className={styles.secondaryButton}
                  >
                    Create Fundraiser
                  </button>
                </div>

                <div className={styles.heroImageWrapper}>
                  <Image
                    src="/hero-preview1.png"  
                    alt="Aggie fundraisers preview"
                    
                    width={300}
                    height={400}
              
                    priority
                    className={styles.heroImage}
                  />
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
              <p>© 2025 Aggie Fundraisers.</p>
            </div>
          </footer>
        </div>
      </div>
  )
}
