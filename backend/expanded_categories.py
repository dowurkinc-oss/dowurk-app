"""
Expanded business categories for Louisiana Business Directory
Based on comprehensive categorization system
"""

BUSINESS_CATEGORIES = {
    "art_photo_music": {
        "name": "Art/Photo/Music",
        "subcategories": ["Art", "Photography", "Video Production", "Music"]
    },
    "beauty": {
        "name": "Beauty",
        "subcategories": ["Bath & Body", "Beauty Products", "Beauty Supply", "Cosmetics", 
                         "Cosmetology", "Fragrances", "Spa and Wellness"]
    },
    "books_media": {
        "name": "Books/Media",
        "subcategories": ["Books", "Magazines", "News", "Television", "Videos/Movies"]
    },
    "business": {
        "name": "Business Services",
        "subcategories": ["Advertising", "Business Consultant", "Business-to-Business", 
                         "Marketing", "Office", "Productivity Tools", "Travel"]
    },
    "cards_gifts": {
        "name": "Cards & Gifts",
        "subcategories": ["Gifts", "Cards", "Party Supplies"]
    },
    "charity": {
        "name": "Charity/Fundraiser",
        "subcategories": ["Nonprofit", "Fundraising", "Community Service"]
    },
    "clothing": {
        "name": "Clothing/Apparel",
        "subcategories": ["Accessories", "Childrens", "Clothing Boutique", "Clothing Design", 
                         "Jewelry", "Lingerie", "Men's", "Retail", "Swimwear", "Women's"]
    },
    "computers_electronics": {
        "name": "Computer & Electronics",
        "subcategories": ["Computer Support", "Computer Software", "Consumer Electronics", "Videogames"]
    },
    "construction": {
        "name": "Construction",
        "subcategories": ["General Contracting", "Renovation", "Coastal Restoration"]
    },
    "design": {
        "name": "Design Services",
        "subcategories": ["Graphic Design", "Web Design", "Interior Design"]
    },
    "education": {
        "name": "Education",
        "subcategories": ["K-12", "Higher Education", "Training", "Tutoring"]
    },
    "entertainment": {
        "name": "Entertainment",
        "subcategories": ["Bar", "Cinema", "Events", "Guides", "Lounge", "Memorabilia", 
                         "Mobile Entertainment", "Music", "Party Goods"]
    },
    "financial": {
        "name": "Financial Services",
        "subcategories": ["Accounting", "Banking/Trading", "Credit Cards", "Credit Reporting", 
                         "Insurance", "Investment", "Mortgage Loans", "Personal Loans", 
                         "Real Estate Services", "Tax Services"]
    },
    "food_drink": {
        "name": "Food & Drink",
        "subcategories": ["Bakery", "Catering", "Groceries", "Restaurants", "Wine & Spirits"]
    },
    "hair": {
        "name": "Hair Services",
        "subcategories": ["Barber Shop", "Salon"]
    },
    "health_wellness": {
        "name": "Health and Wellness",
        "subcategories": ["Alternative Medicine", "Fitness", "Health Foods", 
                         "Nutritional Supplements", "Self Help", "Weight Loss", "Wellness"]
    },
    "home_decor": {
        "name": "Home Decor",
        "subcategories": ["Furniture", "Decor", "Home Improvement"]
    },
    "jewelry": {
        "name": "Jewelry",
        "subcategories": ["Fine Jewelry", "Costume Jewelry", "Custom Design"]
    },
    "online_media": {
        "name": "Online Media",
        "subcategories": ["Blogs", "Social Media", "Content Creation"]
    },
    "performing_arts": {
        "name": "Performing Arts",
        "subcategories": ["Acting", "Dance", "Modeling", "Music", "Theater"]
    },
    "religion": {
        "name": "Religion",
        "subcategories": ["Churches", "Ministry", "Spiritual Services"]
    },
    "sports": {
        "name": "Sports",
        "subcategories": ["Training", "Equipment", "Leagues"]
    },
    "travel": {
        "name": "Travel",
        "subcategories": ["Hotel", "Motel", "Travel Agency", "Tours"]
    }
}

# Louisiana parishes for realistic distribution
LOUISIANA_PARISHES = [
    "Acadia", "Allen", "Ascension", "Assumption", "Avoyelles",
    "Beauregard", "Bienville", "Bossier", "Caddo", "Calcasieu",
    "Caldwell", "Cameron", "Catahoula", "Claiborne", "Concordia",
    "De Soto", "East Baton Rouge", "East Carroll", "East Feliciana",
    "Evangeline", "Franklin", "Grant", "Iberia", "Iberville",
    "Jackson", "Jefferson", "Jefferson Davis", "Lafayette", "Lafourche",
    "La Salle", "Lincoln", "Livingston", "Madison", "Morehouse",
    "Natchitoches", "Orleans", "Ouachita", "Plaquemines", "Pointe Coupee",
    "Rapides", "Red River", "Richland", "Sabine", "St. Bernard",
    "St. Charles", "St. Helena", "St. James", "St. John the Baptist",
    "St. Landry", "St. Martin", "St. Mary", "St. Tammany", "Tangipahoa",
    "Tensas", "Terrebonne", "Union", "Vermilion", "Vernon",
    "Washington", "Webster", "West Baton Rouge", "West Carroll",
    "West Feliciana", "Winn"
]

# Major Louisiana cities
MAJOR_CITIES = {
    "New Orleans": "Orleans",
    "Baton Rouge": "East Baton Rouge",
    "Shreveport": "Caddo",
    "Lafayette": "Lafayette",
    "Lake Charles": "Calcasieu",
    "Kenner": "Jefferson",
    "Bossier City": "Bossier",
    "Monroe": "Ouachita",
    "Alexandria": "Rapides",
    "Houma": "Terrebonne",
    "Slidell": "St. Tammany",
    "Hammond": "Tangipahoa",
    "Thibodaux": "Lafourche",
    "Ruston": "Lincoln",
    "Zachary": "East Baton Rouge"
}
