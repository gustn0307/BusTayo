import FavoriteItem from "./FavoriteItem";


function FavoriteGroup({group}){


  return (

    <div className="favorite-group">


      <h2>
        {group.groupName}
      </h2>



      {
        group.items.map(item => (

          <FavoriteItem
            key={item.favoriteId}
            item={item}
          />

        ))
      }



    </div>

  );

}


export default FavoriteGroup;