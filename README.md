# TapCart - A mobile-first self-scan shopping system prototype

A browser-based self-scan shopping cart prototype. Users can open the website on a phone, allow camera access, scan product QR codes, add products to a local cart, view product details, and generate a checkout QR code.

## Features

- Camera-based QR scanning for product codes
- Manual product adding for testing
- Cart stored in `localStorage`
- Quantity controls and item removal
- Product detail popup
- Scan-success animation
- Special gift-product celebration
- Checkout dialog with generated QR code
- Responsive mobile-first layout

## Technologies

- HTML
- CSS
- JavaScript

## External libraries

This project uses and thanks the following open-source libraries:

- [`html5-qrcode`](https://github.com/mebjas/html5-qrcode) for browser-based QR code scanning.
- [`qrcodejs`](https://github.com/davidshimjs/qrcodejs) for browser-based QR code generation.
- [`fireworks-js`](https://github.com/crashmax-dev/fireworks-js) for celebration effects.

Before publishing or distributing this project, check the license files of each dependency and keep required copyright/license notices.

## Generative AI disclosure

Generative AI, specifically ChatGPT, was consulted during code creation and for image generation.

## Data

### QR code format

The QR code should contain the product ID exactly as it appears in `products.json`.

Example QR contents:

```text
banana-001
```

Matching product:

```json
{
  "id": "banana-001",
  "name": "Banana",
  "category": "Fruit",
  "price": 0.45
}
```

### Checkout QR payload



## Deployment


