function FavoriteItem({item}){


 return (

  <div className="favorite-item">


    {
      item.type === "BUS" &&
      (
        <>

          <span>🚌</span>

          <strong>
            {item.title}
          </strong>

        </>
      )
    }



    {
      item.type === "ROUTE" &&
      (
        <>

          <span>🧭</span>


          <strong>
            출발지 : {item.start}
          </strong>


          <span>
            →
          </span>


          <strong>
            도착지 : {item.destination}
          </strong>


        </>
      )
    }



    {
      item.type === "STATION" &&
      (
        <>

          <span>🚏</span>

          <strong>
            {item.title}
          </strong>

        </>
      )
    }



  </div>

 )

}


export default FavoriteItem;