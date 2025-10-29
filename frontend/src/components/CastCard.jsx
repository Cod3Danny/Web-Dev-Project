const CastCard = ({name, imgSrc, character}) => {
    return (
        <>
            <div className="cast-card">
                <h4>{name}</h4>
                <img className='cast-img' src={imgSrc} alt={name}></img>
                <p className="characer-name">{character}</p>
            </div>
        </>
    )
}

export default CastCard; 