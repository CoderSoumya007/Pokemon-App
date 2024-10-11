PokeDex
============
A simple and interactive Pokémon application that allows users to explore a list of Pokémon, search for specific ones, and view details in a visually appealing way.

![Chat Preview](http://i.imgur.com/lgRe8z4.png)

---

## Features
- Pokémon Listing: Displays a list of Pokémon fetched from the PokéAPI.
- Infinite Scrolling: Automatically loads more Pokémon as the user scrolls down.
- Search Functionality: Users can search for Pokémon by name, dynamically filtering the displayed list.
- Error Handling: Displays error messages if the Pokémon data cannot be fetched.
- Loading Indicator: Shows a loading message while new Pokémon data is being fetched.
- Responsive Design: Optimized for different screen sizes with a mobile-friendly interface.

#### Technical Features:
- **React:** The application is built using React for a smooth and responsive user experience.
- **React Hooks:** Utilizes hooks like useState, useEffect, and useCallback for state management and lifecycle methods.
- **Fetch API:** Uses the Fetch API to get data from the PokéAPI for Pokémon information.
- **Intersection Observer API::** Implements the Intersection Observer API for infinite scrolling, detecting when the user has scrolled to the bottom of the page to load more Pokémon.
- **JavaScript ES6:** Makes use of modern JavaScript features such as arrow functions, async/await, and destructuring.
- **CSS Framework:** Styled using Tailwind CSS for quick and responsive UI development.

---

## Setup
1. Clone the repository:git clone https://github.com/yourusername/pokemon-app.git  
2. Navigate into the project directory:cd front-end  
3. Install the dependencies:npm install  
4. Start the development server:npm run dev  

---

## Usage
1. Upon loading the app, you will see a list of Pokémon.  
2. Use the search bar to filter Pokémon by name.  
3. Scroll down to load more Pokémon automatically.  
4. Enjoy exploring the Pokémon universe!  
---

Contributing
Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request.
