export const PAGE_SLUG_CREATION_STAGE_LIST = [
  {
    $addFields: {
      slugEn: {
        $toLower: {
          $reduce: {
            input: {
              $filter: {
                input: [
                  { $ifNull: ["$translations.en.title", ""] },
                ],
                as: "part",
                cond: { $ne: ["$$part", ""] }
              }
            },
            initialValue: "",
            in: {
              $cond: [
                { $eq: ["$$value", ""] },
                "$$this",
                { $concat: ["$$value", "_", "$$this"] }
              ]
            }
          }
        }
      }
    }
  },
  {
    $addFields: {
      slugAr: {
        $toLower: {
          $reduce: {
            input: {
              $filter: {
                input: [
                  { $ifNull: ["$translations.ar.title", ""] },
                ],
                as: "part",
                cond: { $ne: ["$$part", ""] }
              }
            },
            initialValue: "",
            in: {
              $cond: [
                { $eq: ["$$value", ""] },
                "$$this",
                { $concat: ["$$value", "_", "$$this"] }
              ]
            }
          }
        }
      }
    }
  }
]