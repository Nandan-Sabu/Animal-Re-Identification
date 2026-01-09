import { Heading } from '../../components/Heading.jsx'
import { ImageBanner } from '../../components/ImageBanner.jsx'
import './UserGuide.css'


import birdImg from './guide-img/bird_resized.jpg'
import catImg from './guide-img/cat_resized.jpg'
import kiwiImg from './guide-img/kiwi_resized.jpg'
import possumImg from './guide-img/possum_with_babies_resized.jpg'
import stoatImg from './guide-img/stoat_resized.jpg'
import tuiImg from './guide-img/tui_resized.jpg'

export default function UserGuide() {

  const scrollToSection = (id) => (e) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <section className="guide-page">
      <ImageBanner />
      <main>
        {/* Table of Contents */}
        <h1 className="toc-title">Table of Contents</h1>
        <section className="toc">

          <div className="toc-grid">
            <div>
              <h3>Toolkit Guide</h3>
              <a href="#upload"  onClick={scrollToSection('upload')}>Upload Files</a>
              <a href="#gallery" onClick={scrollToSection('gallery')}>Gallery View</a>
              <a href="#detect"  onClick={scrollToSection('detect')}>Detect Images</a>
              <a href="#reid"    onClick={scrollToSection('reid')}>ReID Images</a>
            </div>
            <div>
              <h3>Utility Guide</h3>
              <a href="#nav"   onClick={scrollToSection('nav')}>Navigation</a>
              <a href="#theme" onClick={scrollToSection('theme')}>Theme Customise</a>
            </div>
          </div>
        </section>

        {/* Upload */}
        <section id="upload">
          <article className="ug-card">
            <div className="ug-card__media">
              <img className="ug-card__img" src={kiwiImg} alt="Kiwi example" />
            </div>
            <div className="ug-card__body">
              <span className="ug-eyebrow">Getting Started</span>
              <h2>How to Upload Files?</h2>
              <p>
                Click the <strong>Upload</strong> button or drag and drop files into the upload area.
                You can add whole folders, and the system will automatically organise your images.
              </p>
            </div>
          </article>
        </section>

        {/* Gallery */}
        <section id="gallery">
          <article className="ug-card">
            <div className="ug-card__media">
              <img className="ug-card__img" src={stoatImg} alt="Stoat example" />
            </div>
            <div className="ug-card__body">
              <span className="ug-eyebrow">Browsing</span>
              <h2>Gallery View</h2>
              <p>
                Browse all uploaded images as thumbnails. Use the sidebar to select folders,
                and click any image for a larger preview.
              </p>
            </div>
          </article>
        </section>

        {/* Detect */}
        <section id="detect">
          <article className="ug-card">
            <div className="ug-card__media">
              <img className="ug-card__img" src={catImg} alt="Cat example" />
            </div>
            <div className="ug-card__body">
              <span className="ug-eyebrow">Analysis</span>
              <h2>Detect Images</h2>
              <p>
                Choose images and run the <strong>Detection</strong> tool to identify species.
                Progress is shown in the status bar, and results are saved automatically.
              </p>
            </div>
          </article>
        </section>

        {/* ReID */}
        <section id="reid">
          <article className="ug-card">
            <div className="ug-card__media">
              <img className="ug-card__img" src={possumImg} alt="Possum family example" />
            </div>
            <div className="ug-card__body">
              <span className="ug-eyebrow">Analysis</span>
              <h2>ReID Images</h2>
              <p>
                Use the <strong>Re-Identification (ReID)</strong> feature to match the same animal
                across different photos. Results are grouped and time-stamped for easy tracking.
              </p>
            </div>
          </article>
        </section>

        {/* Navigation */}
        <section id="nav">
          <article className="ug-card">
            <div className="ug-card__media">
              <img className="ug-card__img" src={birdImg} alt="Bird example" />
            </div>
            <div className="ug-card__body">
              <span className="ug-eyebrow">Tips</span>
              <h2>Navigation</h2>
              <p>
                Use the sidebar and top navigation bar to move between pages like Home, Guide, and Toolkit.
                This helps you quickly find features without losing your place.
              </p>
            </div>
          </article>
        </section>

        {/* Theme */}
        <section id="theme">
          <article className="ug-card">
            <div className="ug-card__media">
              <img className="ug-card__img" src={tuiImg} alt="Tui example" />
            </div>
            <div className="ug-card__body">
              <span className="ug-eyebrow">Personalise</span>
              <h2>Theme Customise</h2>
              <p>
                Change colours, fonts, and layouts under <strong>Preferences → Appearance</strong>.
                Adjust the look and feel of the app to your own style.
              </p>
            </div>
          </article>
        </section>
      </main>
    </section>
  )
}
