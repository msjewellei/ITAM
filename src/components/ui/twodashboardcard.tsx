function TwoCards(){
    return(
        <>
        <div className="w-full h-1/3 flex flex-row justify-around items-start gap-8 pl-4 pr-4 pt-0 pb-2">
          <div className="bg-white h-full rounded-xl w-3/4 shadow-lg"></div>
          <div className="bg-white h-full rounded-xl w-1/4 shadow-lg"></div>
        </div>
        </>
    )
}

export default TwoCards;