const CastCard = ({name, imgSrc}) => {
    return (
        <>
            <div className="cast-card">
                <h4>{name}</h4>
                <img className='cast-img' src={imgSrc} alt={name}></img>
            </div>
        </>
    )
}

export default CastCard; 