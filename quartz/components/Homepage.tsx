import { QuartzComponentConstructor } from "./types"
// import { classNames } from "../util"
import homeStyles from "./styles/homepagestyle.scss"

export default (() => {
  // const opts = { ...userOpts, ...defaultOpts}
  function HomepageComponent() {
    return (
      <div className="homepage-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="profile-section">
            <div className="profile-photo">
              IC
            </div>
            <div className="social-links">
              <a href="mailto:rigodlab@gmail.com" className="social-link" title="Email">
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
              
              <a href="https://linkedin.com/in/ignacio-calderon-de-la-barca" className="social-link" target="_blank" title="LinkedIn">
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              
              <a href="https://github.com/Igodlab" className="social-link" target="_blank" title="GitHub">
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                </svg>
              </a>
              
              <a href="https://twitter.com/igodlab" className="social-link" target="_blank" title="Twitter">
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="bio-content">
            <h1>Ignacio Calderon de la Barca</h1>
            <div className="tagline">Blockchain Developer Relations • ML/Data Science • Lifelong Learner</div>
            <p>
              Three years of experience in Blockchain Developer Relations, maximizing value from bridging communities and engineering teams. Experienced programmer on ML/Data Science and Physical modeling with a record of academic journal publications.
            </p>
            <p>
              Currently Content Strategist at Wolfram Blockchain Labs, where I lead the UTXO Alliance and author educational resources that break down complex blockchain concepts. Previously Developer Relations at Input Output Global, working on Cardano Smart Contracts and developer experience.
            </p>
            <p>
              My background spans from Complex Systems and Neural Networks to Molecular Physics and Biophysics, with published research in scientific journals. I'm passionate about making cutting-edge technology accessible and building bridges between technical communities.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="timeline">
          <div className="timeline-item work">
            <div className="timeline-years">2024 - present</div>
            <div className="timeline-logo">WBL</div>
            <div className="timeline-content">
              <h3>Content Strategist</h3>
              <div className="organization">Wolfram Blockchain Labs</div>
              <div className="location">Remote</div>
              <p>Led and managed the UTXO Alliance, a dynamic collaboration of layer-1 blockchain foundations aimed at enhancing UTXO model scalability, interoperability and education. Authored the UTXO Models Handbook and established governance processes that expanded Alliance membership from three to ten organizations.</p>
            </div>
          </div>

          <div className="timeline-item work">
            <div className="timeline-years">2022 - 2024</div>
            <div className="timeline-logo">IOG</div>
            <div className="timeline-content">
              <h3>Developer Relations</h3>
              <div className="organization">Input Output Global</div>
              <div className="location">Remote</div>
              <p>Developed a Developer Relations program focused on enhancing Cardano Smart Contracts through Cardano Improvement Proposals (CIPs), primarily targeting compiler modifications for internal stakeholders and leading Cardano dApps. Analyzed GitHub, Stack Overflow, and Discord metrics to synthesize community needs and drive product development.</p>
            </div>
          </div>

          <div className="timeline-item education">
            <div className="timeline-years">2020 - 2022</div>
            <div className="timeline-logo">LC</div>
            <div className="timeline-content">
              <h3>Post-Degree Diploma, Data Science</h3>
              <div className="organization">Langara College</div>
              <div className="location">Vancouver, BC, Canada</div>
              <p>Specialized in machine learning, statistical analysis, and data visualization techniques with hands-on experience in Python, R, and various ML frameworks.</p>
            </div>
          </div>

          <div className="timeline-item work">
            <div className="timeline-years">2021 - 2021</div>
            <div className="timeline-logo">IOG</div>
            <div className="timeline-content">
              <h3>Software Test Engineer</h3>
              <div className="organization">Input Output Global</div>
              <div className="location">Remote</div>
              <p>Implemented and tested smart contracts on the Cardano blockchain throughout testnet and hard fork phases. Onboarded open-source developers and established testing benchmarks for identifying vulnerabilities in initial smart contracts.</p>
            </div>
          </div>

          <div className="timeline-item education">
            <div className="timeline-years">2018 - 2020</div>
            <div className="timeline-logo">SFU</div>
            <div className="timeline-content">
              <h3>MSc., Physics</h3>
              <div className="organization">Simon Fraser University</div>
              <div className="location">Burnaby, BC, Canada</div>
              <p>Molecular physics, Biophysics, Scientific computing. Published research on "Substrate stiffness tunes the dynamics of polyvalent rolling motors" in Soft Matter journal.</p>
            </div>
          </div>

          <div className="timeline-item education">
            <div className="timeline-years">2012 - 2016</div>
            <div className="timeline-logo">UMSA</div>
            <div className="timeline-content">
              <h3>B.S., Physics</h3>
              <div className="organization">Universidad Mayor de San Andrés</div>
              <div className="location">La Paz, Bolivia</div>
              <p>Complex Systems, Neural Networks. Published research on "Synchronization of map modeled neurons and characterized by periodicities" in Revista Boliviana de Física.</p>
            </div>
          </div>
        </section>
      </div>
    )  
  }

  HomepageComponent.css = homeStyles
  return HomepageComponent
}) satisfies QuartzComponentConstructor
