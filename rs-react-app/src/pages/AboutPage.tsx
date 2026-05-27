const AboutPage = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>About This App</h1>
      <p>Author: dariapusovskaya</p>
      <p>
        Course:{' '}
        <a 
          href="https://rs.school/courses/reactjs" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          RS School React Course
        </a>
      </p>
      <p>This app allows you to search products using DummyJSON API.</p>
    </div>
  )
}


export default AboutPage;