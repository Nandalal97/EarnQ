import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../utils/axios';

const BookStore = () => {
  const [booksData, setBooksData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;
  const navigate = useNavigate();

  // Fetch books from API
  useEffect(() => {
  const fetchBooks = async () => {
    try {
      const response = await API.get('/books/all?random=true');
      // Make sure it's an array
      const booksArray = Array.isArray(response.data) ? response.data : response.data.books || [];
      setBooksData(booksArray);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooksData([]); // fallback
    }
  };
  fetchBooks();
}, []);


  const categories = ["All", ...(Array.isArray(booksData) ? [...new Set(booksData.map(book => book.category))] : [])];


  const filteredBooks = booksData.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleBookDetails = (book) => {
    // console.log(book);
   navigate(`/book/${book.title}`, { state: { book } });
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content-row">
          <main className="app-container mb-2">
            <div className="books-container">
              <p>Explore exam-focused books with MCQs, detailed explanations, and topic-wise guides. Filter, search, 
              like, and easily navigate to boost your preparation.</p>

              {/* Filters */}
              <div className="row my-2 xxsm">
                <div className="col-12 col-md-6 mb-2">
                  <select className="form-select text-xxsm"
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="col-12 col-md-6 mb-2 text-xxsm">
                  <input
                    type="text"
                    className="form-control text-xxsm"
                    placeholder="Search by book title..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                </div>
              </div>

              {/* Book Grid */}
              <div className="row g-2">
                {currentBooks.length > 0 ? (
                  currentBooks.map(book => {
                    return (
                      <div key={book.id} className="col-4 col-sm-4 col-md-3 col-lg-3 mb-1">
                        <div className="books-list border-0 shadow-sm cursor-pointer"  onClick={() => handleBookDetails(book)}>
                          <img
                            src={book.coverImage}
                            className="book-img"
                            alt={book.title}
                          />
                          <div className="books-card">
                            <h5 className="text-xxsm m-0">{book.title.length > 12 ? book.title.slice(0, 12) + "…" : book.title}</h5>
                            <div className="row g-2">
                              <div className="col-7">
                                <p className="mb-2">
                                  <span className="text-danger fw-bold me-2">₹{book.ebookSalePrice}</span>
                                  {book.ebookDiscount > 0 && <span className="text-muted text-decoration-line-through">₹{book.ebookPrice}</span>}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12 text-center">
                    <p>No books found.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredBooks.length > booksPerPage && (
                <div className="d-flex justify-content-center gap-2 mt-4 flex-wrap">
                  <span
                    className="bg-one text-sm color-white cursor-pointer rounded border-0 px-3 py-1"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </span>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`btn  py-0 ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <span
                    className="bg-one text-sm color-white cursor-pointer rounded border-0 px-3 py-1"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </span>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default BookStore;
