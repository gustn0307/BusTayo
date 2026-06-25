const favoriteData = {

  ungrouped: [

    {
      id: 1,
      type: "station",
      name: "아주대 정문",
      description: "정류장"
    },

    {
      id: 2,
      type: "route",
      name: "집 → 학교",
      description: "길찾기"
    },

    {
      id: 3,
      type: "place",
      name: "스타벅스 아주대점",
      description: "카페"
    }

  ],


  groups: [

    {
      id: 1,
      name: "학교",

      items: [

        {
          id: 4,
          type: "station",
          name: "아주대학교",
          description: "정류장"
        },

        {
          id: 5,
          type: "place",
          name: "GS25 아주대점",
          description: "편의시설"
        }

      ]

    },


    {
      id: 2,
      name: "출퇴근",

      items: [

        {
          id: 6,
          type: "route",
          name: "집 → 회사",
          description: "길찾기"
        },

        {
          id: 7,
          type: "station",
          name: "강남역",
          description: "정류장"
        }

      ]

    }


  ]

};


export default favoriteData;