
    document.addEventListener('DOMContentLoaded', () => {
        // Initial librarian credentials
        const initialLibrarian = { username: "librarian", password: "admin123" };
    
        function safeParse(item, fallback) {
            try {
                const value = localStorage.getItem(item);
                if (!value || value === "undefined") return fallback;
                return JSON.parse(value);
            } catch {
                return fallback;
            }
        }
        
        function loadStorage() {
            books = safeParse('books', []);
            borrowingHistory = safeParse('borrowingHistory', []);
            wishlist = safeParse('wishlist', []);
            users = safeParse('users', []); // Ensure users is always an array
            librarian = safeParse('librarian', initialLibrarian);
            console.log('Loaded users:', users); // Debug: Check users array
        }
    
        async function fetchBooks() {
            try {
                const response = await fetch('data.json');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                books = data.books.map(book => ({
                    ...book,
                    borrowCount: book.borrowCount || 0,
                    cover_image: book.cover_image,
                }));
                saveData();
            } catch (error) {
                console.error('Error fetching books:', error);
                alert('Failed to load books from server.');
                books = [];
            }
        }
        
        async function initializeBooks() {
            document.getElementById('loading-message').classList.remove('d-none');
            if (!books || books.length === 0) {
                await fetchBooks();
            }
            document.getElementById('loading-message').classList.add('d-none');
            populateGenreFilter();
        }
    
        function saveData() {
            try {
                localStorage.setItem('books', JSON.stringify(books));
                localStorage.setItem('borrowingHistory', JSON.stringify(borrowingHistory));
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('librarian', JSON.stringify(librarian));
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                alert('Failed to save data. Some changes may not persist.');
            }
        }
    
        function getCurrentUser() {
            return currentUser ? { ...currentUser } : null;
        }
    
        function populateGenreFilter() {
            const genreFilter = document.getElementById('genre-filter');
            const genres = books && books.length > 0 ? [...new Set(books.map(book => book.genre))].sort() : ['Fiction', 'Historical Fiction', 'Epistolary Novel', 'Autobiography', 'Magical Realism'];
            genreFilter.innerHTML = '<option value="">All Genres</option>';
            genres.forEach(genre => {
                genreFilter.innerHTML += `<option value="${genre}">${genre}</option>`;
            });
            console.log('Genre filter populated:', genres);
        }
    
        function loginUser(username, password) {
            console.log('Attempting user login:', { username, password }); // Debug
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                currentUser = user;
                showUserDashboard();
                const modal = bootstrap.Modal.getInstance(document.getElementById('user-login-modal'));
                if (modal) modal.hide();
                document.getElementById('user-login-message').innerHTML = '';
                console.log('User login successful:', user);
            } else {
                document.getElementById('user-login-message').innerHTML = '<div class="alert alert-danger">Invalid username or password!</div>';
                console.log('User login failed: Invalid credentials');
            }
        }
    
        function loginLibrarian(username, password) {
            console.log('Attempting librarian login:', { username, password }); // Debug
            if (librarian.username === username && librarian.password === password) {
                currentUser = { username: 'librarian', role: 'librarian' };
                showLibrarianDashboard();
                const modal = bootstrap.Modal.getInstance(document.getElementById('librarian-login-modal'));
                if (modal) modal.hide();
                document.getElementById('librarian-login-message').innerHTML = '';
                console.log('Librarian login successful');
            } else {
                document.getElementById('librarian-login-message').innerHTML = '<div class="alert alert-danger">Invalid username or password!</div>';
                console.log('Librarian login failed: Invalid credentials');
            }
        }
    
        function registerUser(username, password) {
            console.log('Attempting user registration:', { username, password }); // Debug
            if (!username || !password) {
                document.getElementById('user-login-message').innerHTML = '<div class="alert alert-danger">Please fill in both fields!</div>';
                console.log('Registration failed: Empty fields');
                return;
            }
            if (users.find(u => u.username === username)) {
                document.getElementById('user-login-message').innerHTML = '<div class="alert alert-danger">Username already exists!</div>';
                console.log('Registration failed: Username exists');
            } else {
                users.push({ username, password });
                saveData();
                document.getElementById('user-login-message').innerHTML = '<div class="alert alert-success">Registered successfully! Please login.</div>';
                document.getElementById('user-login-form').reset();
                console.log('Registration successful:', { username });
            }
        }
    
        function showUserDashboard() {
            document.getElementById('landing-page').classList.add('d-none');
            document.getElementById('main-app').classList.remove('d-none');
            document.getElementById('catalog').classList.remove('d-none');
            document.getElementById('borrow').classList.remove('d-none');
            document.getElementById('history').classList.remove('d-none');
            document.getElementById('wishlist').classList.remove('d-none');
            document.getElementById('dashboard').classList.add('d-none');
            document.getElementById('nav-dashboard').classList.add('d-none');
            fetchBooks();
            displayBooks();
            populateBookSelect();
            displayHistory();
            displayWishlist();
        }
    
        function showLibrarianDashboard() {
            document.getElementById('landing-page').classList.add('d-none');
            document.getElementById('main-app').classList.remove('d-none');
            document.getElementById('catalog').classList.add('d-none');
            document.getElementById('borrow').classList.add('d-none');
            document.getElementById('history').classList.add('d-none');
            document.getElementById('wishlist').classList.add('d-none');
            document.getElementById('dashboard').classList.remove('d-none');
            document.getElementById('nav-catalog').classList.add('d-none');
            document.getElementById('nav-borrow').classList.add('d-none');
            document.getElementById('nav-history').classList.add('d-none');
            document.getElementById('nav-wishlist').classList.add('d-none');
            fetchBooks();
            updateDashboard();
            displayActivities();
        }
    
        document.getElementById('user-login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('user-username').value.trim();
            const password = document.getElementById('user-password').value;
            console.log('User login form submitted'); // Debug
            loginUser(username, password);
        });
    
        document.getElementById('user-register-btn').addEventListener('click', () => {
            console.log('Register button clicked'); // Debug
            const username = document.getElementById('user-username').value.trim();
            const password = document.getElementById('user-password').value;
            registerUser(username, password);
        });
    
        document.getElementById('librarian-login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('librarian-username').value.trim();
            const password = document.getElementById('librarian-password').value;
            console.log('Librarian login form submitted'); // Debug
            loginLibrarian(username, password);
        });
    
        document.getElementById('logout-btn').addEventListener('click', () => {
            currentUser = null;
            document.getElementById('main-app').classList.add('d-none');
            document.getElementById('landing-page').classList.remove('d-none');
            document.getElementById('user-login-form').reset();
            document.getElementById('librarian-login-form').reset();
            document.getElementById('user-login-message').innerHTML = '';
            document.getElementById('librarian-login-message').innerHTML = '';
        });
    
        function displayBooks() {
            const catalog = document.getElementById('book-catalog');
            catalog.innerHTML = books.length === 0 ? '<p class="text-center">No books available.</p>' : '';
            const search = document.getElementById('search-input').value.toLowerCase();
            const genre = document.getElementById('genre-filter').value;
            const availability = document.getElementById('availability-filter').value;
    
            books.forEach(book => {
                if (
                    (book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search)) &&
                    (!genre || book.genre === genre) &&
                    (!availability || book.availability === availability)
                ) {
                    const card = `
                        <div class="col">
                            <div class="card book-card">
                                <img src="${book.cover_image}" class="card-img-top cover-img" alt="${book.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${book.title}</h5>
                                    <p class="card-text">Author: ${book.author}</p>
                                    <p class="card-text">Genre: ${book.genre}</p>
                                    <p class="card-text">Status: ${book.availability}</p>
                                    <button class="btn btn-sm btn-outline-primary wishlist-btn" data-id="${book.id}">
                                        <i class="fas fa-heart"></i> Add to Wishlist
                                    </button>
                                    <button class="btn btn-sm btn-outline-success borrow-btn" data-id="${book.id}" ${book.availability !== 'Available' || !currentUser ? 'disabled' : ''}>
                                        <i class="fas fa-book"></i> Borrow
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    catalog.innerHTML += card;
                }
            });
    
            catalog.addEventListener('click', (e) => {
                const wishlistBtn = e.target.closest('.wishlist-btn');
                const borrowBtn = e.target.closest('.borrow-btn');
    
                if (wishlistBtn) {
                    const bookId = parseInt(wishlistBtn.dataset.id);
                    const book = books.find(b => b.id === bookId);
                    if (!currentUser) {
                        alert('Please log in to add books to your wishlist!');
                        return;
                    }
                    if (!wishlist.find(w => w.id === bookId && w.username === currentUser.username)) {
                        wishlist.push({ ...book, username: currentUser.username });
                        saveData();
                        displayWishlist();
                        alert(`${book.title} added to wishlist!`);
                    } else {
                        alert(`${book.title} is already in your wishlist!`);
                    }
                } else if (borrowBtn) {
                    const bookId = parseInt(borrowBtn.dataset.id);
                    const book = books.find(b => b.id === bookId);
                    if (!currentUser) {
                        alert('Please log in to borrow books!');
                        return;
                    }
                    if (book.availability === 'Available') {
                        book.availability = 'Borrowed';
                        book.borrowCount += 1;
                        const dueDate = new Date();
                        dueDate.setDate(dueDate.getDate() + 7);
                        borrowingHistory.push({
                            bookId: book.id,
                            title: book.title,
                            username: currentUser.username,
                            dueDate: dueDate.toLocaleDateString(),
                            borrowTimestamp: Date.now()
                        });
                        saveData();
                        fetchBooks();
                        populateBookSelect();
                        displayBooks();
                        displayHistory();
                        alert(`Successfully borrowed ${book.title}! Due: ${dueDate.toLocaleDateString()}`);
                    } else {
                        alert(`${book.title} is not available for borrowing!`);
                    }
                }
            });
        }
    
        function displayWishlist() {
            const wishlistCatalog = document.getElementById('wishlist-catalog');
            const userWishlist = wishlist.filter(w => w.username === currentUser.username);
            wishlistCatalog.innerHTML = userWishlist.length === 0 ? '<p class="text-center">Your wishlist is empty.</p>' : '';
            userWishlist.forEach(book => {
                const card = `
                    <div class="col">
                        <div class="card book-card">
                            <img src="${book.cover_image}" class="card-img-top cover-img" alt="${book.title}">
                            <div class="card-body">
                                <h5 class="card-title">${book.title}</h5>
                                <p class="card-text">Author: ${book.author}</p>
                                <p class="card-text">Genre: ${book.genre}</p>
                                <button class="btn btn-sm btn-outline-danger remove-wishlist-btn" data-id="${book.id}">
                                    <i class="fas fa-trash"></i> Remove
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                wishlistCatalog.innerHTML += card;
            });
    
            wishlistCatalog.addEventListener('click', (e) => {
                if (e.target.closest('.remove-wishlist-btn')) {
                    const btn = e.target.closest('.remove-wishlist-btn');
                    const bookId = parseInt(btn.dataset.id);
                    wishlist = wishlist.filter(w => !(w.id === bookId && w.username === currentUser.username));
                    saveData();
                    displayWishlist();
                    alert('Book removed from wishlist!');
                }
            }, { once: true });
        }
    
        function populateBookSelect() {
            const select = document.getElementById('book-select');
            select.innerHTML = '<option value="">Select a book</option>';
            const availableBooks = books.filter(b => b.availability === 'Available');
            if (availableBooks.length === 0) {
                select.innerHTML += '<option value="" disabled>No available books</option>';
            } else {
                availableBooks.forEach(book => {
                    select.innerHTML += `<option value="${book.id}">${book.title}</option>`;
                });
            }
        }
    
        document.getElementById('borrow-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const bookId = parseInt(document.getElementById('book-select').value);
            const messageDiv = document.getElementById('borrow-message');
            
            if (!bookId) {
                messageDiv.innerHTML = '<div class="alert alert-danger">Please select a book!</div>';
                return;
            }
    
            const book = books.find(b => b.id === bookId);
            if (book.availability !== 'Available') {
                messageDiv.innerHTML = '<div class="alert alert-danger">This book is not available!</div>';
                return;
            }
    
            book.availability = 'Borrowed';
            book.borrowCount += 1;
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7);
            borrowingHistory.push({
                bookId: book.id,
                title: book.title,
                username: currentUser.username,
                dueDate: dueDate.toLocaleDateString(),
                borrowTimestamp: Date.now()
            });
            saveData();
            fetchBooks();
            populateBookSelect();
            displayBooks();
            displayHistory();
            messageDiv.innerHTML = `<div class="alert alert-success">Successfully borrowed ${book.title}! Due: ${dueDate.toLocaleDateString()}</div>`;
            e.target.reset();
        });
    
        function displayHistory() {
            const table = document.getElementById('history-table');
            const userHistory = borrowingHistory.filter(h => h.username === currentUser.username);
            table.innerHTML = userHistory.length === 0 ? '<tr><td colspan="3" class="text-center">No borrowing history.</td></tr>' : '';
            userHistory.forEach(record => {
                const row = `
                    <tr>
                        <td>${record.title}</td>
                        <td>${record.dueDate}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-success return-btn" data-id="${record.bookId}" data-timestamp="${record.borrowTimestamp}">
                                <i class="fas fa-undo"></i> Return
                            </button>
                        </td>
                    </tr>
                `;
                table.innerHTML += row;
            });
    
            table.addEventListener('click', (e) => {
                if (e.target.closest('.return-btn')) {
                    const btn = e.target.closest('.return-btn');
                    const bookId = parseInt(btn.dataset.id);
                    const timestamp = parseInt(btn.dataset.timestamp);
                    const book = books.find(b => b.id === bookId);
                    book.availability = 'Available';
                    borrowingHistory = borrowingHistory.filter(r => !(r.bookId === bookId && r.username === currentUser.username && r.borrowTimestamp === timestamp));
                    saveData();
                    fetchBooks();
                    populateBookSelect();
                    displayBooks();
                    displayHistory();
                    alert(`${book.title} returned successfully!`);
                }
            }, { once: true });
        }
    
        function displayActivities() {
            const table = document.getElementById('activity-table');
            if (!table) {
                console.error('Activity table element not found');
                return;
            }
            table.innerHTML = ''; // Clear existing content
            if (borrowingHistory.length === 0) {
                table.innerHTML = '<tr><td colspan="3" class="text-center">No user activities.</td></tr>';
            } else {
                borrowingHistory.forEach(record => {
                    if (record.title && record.username && record.dueDate) { // Ensure record has required fields
                        const row = `
                            <tr>
                                <td>${record.title}</td>
                                <td>${record.username}</td>
                                <td>${record.dueDate}</td>
                            </tr>
                        `;
                        table.innerHTML += row;
                    }
                });
                if (table.innerHTML === '') {
                    table.innerHTML = '<tr><td colspan="3" class="text-center">No valid user activities.</td></tr>';
                }
            }
        }
    
        function updateDashboard() {
            if (!books || books.length === 0) {
                console.error('No books data available for dashboard');
                return;
            }
    
            // Ensure data is saved and synced
            saveData();
    
            // Update statistics
            const totalBooks = books.length;
            // Calculate totalBorrowed from borrowingHistory to ensure accuracy
            const totalBorrowed = borrowingHistory.length; // Fallback to borrowingHistory
            const totalAvailable = totalBooks - totalBorrowed;
            const mostBorrowed = books.reduce((prev, current) => (prev.borrowCount > current.borrowCount) ? prev : current, { title: 'None', borrowCount: 0 });
    
            console.log('Total Borrowed:', totalBorrowed, 'Books:', books); // Debug
    
            const totalBooksElement = document.getElementById('total-books');
            const totalBorrowedElement = document.getElementById('total-borrowed');
            const totalAvailableElement = document.getElementById('total-available');
            const mostBorrowedElement = document.getElementById('most-borrowed');
    
            if (totalBooksElement) totalBooksElement.textContent = totalBooks;
            if (totalBorrowedElement) totalBorrowedElement.textContent = totalBorrowed;
            if (totalAvailableElement) totalAvailableElement.textContent = totalAvailable;
            if (mostBorrowedElement) mostBorrowedElement.textContent = mostBorrowed.title;
    
            // Update chart
            const chartCanvas = document.getElementById('genre-chart');
            if (!chartCanvas) {
                console.error('Genre chart canvas not found');
                return;
            }
    
            const ctx = chartCanvas.getContext('2d');
            if (!ctx) {
                console.error('Failed to get 2D context for genre chart');
                return;
            }
    
            // Destroy existing chart if it exists
            if (window.genreChart instanceof Chart) {
                window.genreChart.destroy();
            }
    
            // Calculate genre distribution
            const genres = {};
            books.forEach(b => {
                if (b.genre) {
                    genres[b.genre] = (genres[b.genre] || 0) + 1;
                }
            });
    
            if (Object.keys(genres).length === 0) {
                console.warn('No genres available for chart');
                return;
            }
    
            // Initialize new chart
            window.genreChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(genres),
                    datasets: [{
                        data: Object.values(genres),
                        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Genre Distribution' }
                    }
                }
            });
        }
    
        document.getElementById('export-csv').addEventListener('click', () => {
            const userHistory = borrowingHistory.filter(h => h.username === currentUser.username);
            if (userHistory.length === 0) {
                alert('No borrowing history to export!');
                return;
            }
            let csv = 'Title,Due Date\n';
            userHistory.forEach(record => {
                csv += `"${record.title.replace(/"/g, '""')}","${record.dueDate}"\n`;
            });
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'borrowing_history.csv';
            a.click();
            URL.revokeObjectURL(url);
        });
    
        document.getElementById('reset-storage').addEventListener('click', async () => {
            if (confirm('Are you sure you want to reset all data?')) {
                localStorage.clear();
                books = await fetchBooks();
                borrowingHistory = [];
                wishlist = [];
                users = [];
                librarian = initialLibrarian;
                saveData();
                populateGenreFilter();
                updateDashboard();
                displayActivities();
                if (currentUser && currentUser.role === 'librarian') {
                    showLibrarianDashboard();
                } else {
                    showUserDashboard();
                }
                alert('Local storage reset successfully!');
            }
        });
    
        function initializeTheme() {
            const isDarkMode = localStorage.getItem('darkMode') === 'true';
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
                document.querySelector('#theme-toggle i').classList.replace('fa-moon', 'fa-sun');
            }
        }
    
        document.getElementById('theme-toggle').addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = document.querySelector('#theme-toggle i');
            icon.classList.toggle('fa-moon');
            icon.classList.toggle('fa-sun');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
    
        document.getElementById('search-input').addEventListener('input', displayBooks);
        document.getElementById('genre-filter').addEventListener('change', displayBooks);
        document.getElementById('availability-filter').addEventListener('change', displayBooks);
    
        async function init() {
            loadStorage();
            await initializeBooks();
            initializeTheme();
            document.getElementById('landing-page').classList.remove('d-none');
        }
        init();
    });