Library Management System
A web-based application for managing a library, allowing users to browse, borrow, and manage books, and librarians to monitor borrowing activities and view statistics.
Features

User Dashboard:
Login and signup for user accounts.
Browse books by title, author, genre, or availability.
Borrow available books with a 7-day due date.
Add books to a personal wishlist.
View borrowing history and return books.
Export borrowing history as a CSV file.


Librarian Dashboard:
Login with dedicated credentials.
View statistics: total books, total borrowed, total available, and most borrowed book.
Display a pie chart of book genre distribution.
Monitor all user borrowing activities (book title, username, due date).
Reset local storage to clear data.


General:
Dark mode toggle with persistent theme preference.
Responsive design using Bootstrap.
Data persistence using localStorage.



Technologies Used

HTML5: Structure of the web application.
JavaScript (ES6): Core functionality, including DOM manipulation and event handling.
Bootstrap 5: Responsive UI and modal dialogs.
Chart.js: Pie chart for genre distribution in the librarian dashboard.
localStorage: Persistent storage for books, users, and borrowing data.
JSON: Book data loaded from data.json.

Setup Instructions

Clone or Download the Repository:
Clone the repository: git clone <repository-url> or download the project files.


File Structure:library-management-system/
├── index.html        # Main HTML file
├── script.js         # JavaScript logic
└── data.json         # Book data


Prepare data.json:
Ensure data.json is in the project root with the following structure:{
  "books": [
    {
      "id": 1,
      "title": "Book Title",
      "author": "Author Name",
      "genre": "Fiction",
      "availability": "Available",
      "cover_image": "path/to/image.jpg",
      "borrowCount": 0
    },
    ...
  ]
}


Update image paths or use placeholder URLs if needed.


Serve the Application:
Option 1: Open index.html directly in a browser (may require a local server for data.json fetch).
Option 2: Use a local server (e.g., python -m http.server 8000 or VS Code Live Server) to serve the project folder.
Access the app at http://localhost:8000 (port may vary).


Dependencies:
No installation required; all dependencies (Bootstrap, Chart.js, Font Awesome) are loaded via CDNs in index.html.



Usage Instructions

Access the Landing Page:
Open the application in a browser to see the landing page with “User Login” and “Librarian Login” buttons.


User Actions:
Signup: Click “User Login”, enter a username and password, and click “Register”.
Login: Use the same credentials to log in and access the user dashboard.
Browse Books: View books in the catalog, filter by search, genre, or availability.
Borrow: Go to the “Borrow” tab, select an available book, and submit to borrow.
Wishlist: Add books to your wishlist from the catalog.
History: View borrowed books and return them in the “History” tab.
Export: Export borrowing history as a CSV from the “History” tab.


Librarian Actions:
Login: Click “Librarian Login” and use username librarian, password admin123.
Dashboard: View total books, borrowed, available, most borrowed book, genre chart, and user activities.
Reset Data: Click “Reset Storage” to clear localStorage and reload book data.


Toggle Theme:
Click the theme toggle button (moon/sun icon) to switch between light and dark modes.











General Errors:
Open Developer Tools (F12 > Console) to view error messages.
Ensure all CDN scripts in index.html (Bootstrap, Chart.js, Font Awesome) load correctly.



The challenges i faced was so much but thank God  overcome everything thanks to all supporting colleagues and to my amiable instrutors .Thanks to you All!! 
License
Quadri Yusuff
