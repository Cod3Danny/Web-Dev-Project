import './Masthead.css'
const Masthead = (prop) => {
    return (
        <>
            <section className="hero">
                <h1>{prop.title}</h1>
                <p>{prop.description}</p>
            </section>
        </>
    )
}

export default Masthead; 