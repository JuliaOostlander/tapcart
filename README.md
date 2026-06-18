# TapCart 

![Example Product QR Image](./docs/images/TapCart-logo.png)

## About 

A browser-based self-scan shopping cart prototype. Users can open the website on a phone (or other device), scan product QR codes, view product details, and add products to a virtual shopping cart. The prototype also includes a checkout flow that generates a QR code representing the cart contents for payment at a terminal, as well as some fun mini games. Payment processing is not part of this prototype. 

## Features

- Camera-based QR scanning to add products
- Cart stored in `localStorage`
- Adjust cart quantities and/or remove items
- Popup displaying detailed product information
- User feedback and confirmations through popups
- Special effects for gift-products 
- Checkout dialog with generated QR code representing the cart
- Responsive layout for (mainly) phones, tables, and computers
- Manual product management page for testing
- Mini games (scan as much and as fast as possible within the given time) 

## Technologies

- HTML
- CSS
- JavaScript

## External libraries

This project uses and thanks the following open-source libraries:

- [`html5-qrcode`](https://github.com/mebjas/html5-qrcode) for QR code scanning; 
- [`qrcodejs`](https://github.com/davidshimjs/qrcodejs) for QR code generation;
- [`fireworks-js`](https://github.com/crashmax-dev/fireworks-js) for special effects.

Before publishing or distributing this project, check the license files of each dependency and keep required copyright/license notices.

## Usage

### QR code format

Product QR codes should contain the product IDs exactly as they appear in `.assets/data/products.json`.

#### Example product QR

QR image: 

![Example Product QR Image](docs/images/QR-apple-001.png)

QR contents:

```text
apple-001
```

Matching product:

```json
{
  "id": "apple-001",
  "name": "Crisp Red Apples",
  "price": 2.49,
  "category": "Fruit",
  "description": "A bag of crisp red apples with a naturally sweet flavor and refreshing crunch. Great for lunchboxes, baking, or a quick snack between meals.",
  "image": "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80",
  "specialEffect": "none",
  "allergens": [],
  "nutriScore": "A",
  "tags": [
    "vegan",
    "vegetarian",
    "fresh",
    "high-fiber"
  ],
  "countryOfOrigin": "Netherlands",
  "nutrition": {
    "energyKcal": 52,
    "fat": 0.2,
    "saturatedFat": 0.0,
    "carbohydrates": 14.0,
    "sugars": 10.0,
    "protein": 0.3,
    "salt": 0.0
  }
}
```

### Checkout QR payload

Checkout QR codes represent the current contents of the virtual cart and can be scanned by a checkout terminal to reconstruct the cart . 

### Example Checkout QR

```json
{
  "type": "SELF_SCAN_CHECKOUT",
  "createdAt": "2026-06-17T14:37:41.099Z",
  "products": [
    {
      "productId": "apple-001",
      "quantity": 1
    }
  ],
  "logs": []
}
```

## Deployment

This project is a static HTML, CSS, and JavaScript website that can be hosted on any static hosting platform or served locally using a web server. The application stores cart data and settings in the browser's localStorage, so no backend server or database is required. 

A live version is currently hosted using GitHub Pages, accessible through: https://juliaoostlander.github.io/tapcart/.

## Generative AI disclosure

Generative AI, specifically ChatGPT, was consulted for some simple brainstorming, starting points through initial class and file structures and task-specific code snippets/CSS generation, and debugging, and for the creation of the images/generation.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
