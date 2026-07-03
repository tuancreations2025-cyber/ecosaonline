import React from 'react'
import ProjectsSection from '../components/ProjectsSection'

export default function Projects(){
  return (
    <div>
      <div className="card">
        <h3>Projects</h3>
        <p>Featured and active ECOSA initiatives. Use the buttons below to contribute or donate.</p>
      </div>
      <ProjectsSection />
    </div>
  )
}
