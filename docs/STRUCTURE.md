# Project structure

```text
README.md               Project overview and how to run and deploy the app
LICENSE                 Legal terms for use and distribution of the software
index.html              Main HTML page 
src/                    Application source code
src/main.js             App entry point and controller/coordinator
src/dom.js              Central lookup for DOM reference elements
src/settings.js         Global configuration constants such as animation timings amd UI behaviour setting
src/services/           Service classes for scanner and products
src/state/              Application state management modules (e.g. cart store)
src/styles/             Global CSS stylesheets organised by purpose (base, layout, components)
src/styles/components/  CSS styles for distinct blocks and reusable UI elements
src/ui/                 View/UI classes that update the page
src/utils/              Small helper functions
assets/data/            Static data files, such as products.json
assets/images/          Product images and other static images
docs/                   Extra documentation notes and images
```
