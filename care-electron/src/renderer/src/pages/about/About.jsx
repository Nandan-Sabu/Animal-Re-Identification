import './about.css';
import stoatImage from '../../assets/stoat_photo.jpg'

function About(){
  return (
    <section className="about-main">
      <div className="container">
        <div className="left-section">
          <h3 className="h3">About CARE</h3>
          <p className="p">CARE is a web-based application for conservationists in New Zealand, using AI to identify stoats and
            reidentify individuals in bulk image uploads.</p>
          <p className="p">Researchers can upload images from motion-activated camera traps, which are automatically organised by
            upload date. Users can browse their images and select some for analysis with the Detection Model. Once
            processed, they can view results and run chosen images through the Re-Identification Model. This second
            step groups images for easier review, greatly reducing the time and effort needed for manual
            verification. Access is limited to verified researchers and conservationists. Our goal is to equip
            conservationists, researchers, and organisations with tools to collect, share, and collaborate on data
            and findings, fostering stronger knowledge sharing within the wildlife conservation community.</p>

          <h3 className="h3">Team Credits</h3>
            <p className="p">Doctoral students Di and Justin developed the AI models for the CARE web platform under the guidance
              of Dr Yun Sing, while the UoA capstone team, “BinaryBuilders,” was responsible for creating the CARE
              application as a web platform suite. Later, Chris Pearce refactored the web application suite to be
              an Electron application to simplify distribution to users.</p>
        </div>
        <div className="right-section">
          <div className="stoat_image">
            <img className="img" src={stoatImage} alt="Stoat" />
          </div>
          <div className="credits">


            <h3 className="h3">Case Study: Stoat Re-Identification</h3>
          <p className="p">Stoats pose a serious threat to New Zealand's native bird species. Identifying and tracking specific
            stoat populations is essential for controlling them. By analyzing their patterns, scientists can
            potentially curb their spread. On Waiheke Island, there are currently four known breeding pairs of
            stoats. By utilizing CARE, researchers are now able to re-identify individual stoat pairs, streamlining
            the process of closely tracking which stoats are roaming a certain area. This was done in collaboration
            with Te Korowai o Waiheke, a nonprofit organization committed to creating a predator-free Waiheke
            Island.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About