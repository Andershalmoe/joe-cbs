import express from "express";

const router = express.Router();

const menu = {
    sandwiches: [
        {
            id: 1,
            name: "AVOCADO",
            price: 75,
            image: "https://res.cloudinary.com/dl6hyiozv/image/upload/v1733133009/Avocado-x1_r4of6a.jpg",
            description: "Joes Classic Bread, Vegan Pesto, Tomato, Avocado, Mozzarella"
        },
        {
            id: 2,
            name: "TURKEY",
            price: 75,
            image: "https://res.cloudinary.com/dl6hyiozv/image/upload/v1733133040/Turkey-x1_crqjn8.jpg",
            description: "Joes Classic Bread, Vegan Pesto, Turkey, Mozzarella, Tomato"
        },
        {
            id: 3,
            name: 'TUNACADO',
            price: 75,
            image: 'https://res.cloudinary.com/dl6hyiozv/image/upload/v1733133040/Tunacado-x1_jhs2m1.jpg',
            description: 'Joes Classic Bread, Vegan Pesto, Tuna, Avocado, Mozzarella, Tomato'
        },    
        {
            id: 4,
            name: 'SPICY TUNA',
            price: 75,
            image: 'https://res.cloudinary.com/dl6hyiozv/image/upload/v1733133034/Spicy_Tuna-x1_n5zy25.jpg',
            description: 'Joes Classic Bread, Vegan Pesto, Tuna Mousse, Jalapeños'
          },
          {
            id: 5,
            name: 'SERRANO',
            price: 75,
            image: 'https://res.cloudinary.com/dl6hyiozv/image/upload/v1733133029/Serrano-x1_yygtgp.jpg',
            description: 'Joes Classic Bread, Vegan Pesto, Serrano ham, Mozzarella, Avocado'
          },
          {
            id: 6,
            name: 'JOEs CLUB',
            price: 84,
            image: 'https://res.cloudinary.com/dl6hyiozv/image/upload/v1733132966/JOEs_Club-x1_xdvopt.jpg',
            description: 'Joes Classic Bread, Vegan Pesto, Tomato, Chicken, Avocado'
          },
          {
            id: 7,
            name: 'VAVO (Vegan Avocado Sandwich)',
            price: 75,
            image: 'https://res.cloudinary.com/dl6hyiozv/image/upload/v1733133021/App_Product-x1_dg6kig.jpg',
            description: 'Joes Classic Bread, Vegan Pesto, Avocado, Spinach, Tomato'
          },        
    ],

    shakes: [
        {
            id: 1,
            name: "POWER SHAKE",
            price: 65,
            image: "https://res.cloudinary.com/dl6hyiozv/image/upload/v1733247520/Power_Shake-x1_af7mbr.jpg",
            description: "Vanilla Milk, Strawberries, Banana, Ice"
        },
        {
            id: 2,
            name: 'AVO SHAKE',
            price: 65,
            image: 'https://res.cloudinary.com/dl6hyiozv/image/upload/v1733247519/Avo_Shake-x1_h9kedv.jpg',
            description: 'Vanilla Milk, Avocado, Banana, Ice'
          },
    ],

    shots: [
        {
            id: 1,
            name: "GINGER SHOT",
            price: 25,
            image: "https://res.cloudinary.com/dl6hyiozv/image/upload/v1733247520/Ginger_Shot-x1_xr0fdk.jpg",
            description: "Apple, Ginger, Ice"
        },
        {
            id: 2,
            name: 'TUMERIC SHOT',
            price: 25,
            image: 'https://res.cloudinary.com/dl6hyiozv/image/upload/v1733247521/Tumeric_Shot-x1_cko1ua.jpg',
            description: 'Black Pepper, Apple, Lemon, Tumeric, Ice'
          },
    ],
};

router.get("/:category", (req, res) => {
    const { category } = req.params;
    const categoryData = menu[category];

    if (!categoryData) {
        return res.status(404).json({ message: "Category not found" });
    }

    res.json(categoryData);
});

export default router;