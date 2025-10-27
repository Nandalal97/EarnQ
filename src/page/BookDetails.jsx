import React, { useEffect, useState } from 'react';
import { FaStar, FaEye, FaBook, FaCheck, FaShoppingCart } from 'react-icons/fa';
import AdsMiddle from '../components/AdsMiddle';
import OwlCarousel from 'react-owl-carousel';
import BookStartRating from '../components/StarRating';
import { useLocation, useNavigate } from "react-router-dom";
import API from '../utils/axios';
import { getAuthToken } from '../utils/getAuthToken';
import { decodeToken } from '../utils/decodeToken';
const BookDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [book, setBook] = useState(location.state?.book || null);
    const [relatedBooks, setRelatedBooks] = useState([])

    const [quantity, setQuantity] = useState(1);
    const [format, setFormat] = useState("ebook");
    const [added, setAdded] = useState(false); // track if book is added
    const [loading, setLoading] = useState(false);
    // Fetch books from API
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await API.get('/books/all?random=true');
                //   console.log(response.data.books);
                setRelatedBooks(response.data.books);
            } catch (error) {
                console.error('Error fetching books:', error);
                setRelatedBooks([]); // fallback
            }
        };
        fetchBooks();
    }, []);

    // OwlCarousel settings
    const options = {
        margin: 5,
        loop: true,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 2000,
        responsive: {
            0: { items: 3 },
            768: { items: 3 },
            992: { items: 4 }
        }
    };
    
    const handleBookDetails = (book) => {
        // console.log(book);
        navigate(`/book/${book.title}`, { state: { book } });
        setBook(book)
    };

    const handleAddToCart = async (bookId) => {
        setLoading(true);
        try {
            const authToken = getAuthToken();
            const usersData = decodeToken(authToken);
            const userId = usersData.id;
            const res = await API.post('/books/cart/add', { userId, bookId, quantity, format });
            console.log('Book added:', res.data);
            if (res.data.status) {
                setAdded(true);
                navigate('/cart');
            }
        } catch (error) {
            console.error('Error adding book to cart:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className="page-wrapper">
                <div className="content-row">
                    <main className="app-container mb-2">
                        <div className="single-book">
                            {/* Book Main Details */}
                            <div className="row">
                                {/* Left - Book Image */}
                                <div className="col-md-3 d-flex justify-content-center mb-3 mb-md-0">
                                    <div className='single-book-img'>
                                        {book && (
                                            <img
                                                src={book.coverImage}
                                                alt={book.title}
                                                className="img-fluid rounded shadow book-slider-image"
                                            />
                                        )}

                                    </div>
                                </div>
                                {/* Right - Book Info */}
                                <div className="col-md-9">
                                    <h1 className="fw-bold mb-1 text-md">{book.title}</h1>
                                    <p>{book.description}</p>

                                    <div className="d-flex align-items-center justify-content-between mb-3 pt-2">
                                        <div>
                                            <div>
                                                <span className="text-lg text-danger fw-semibold">₹{book.ebookSalePrice} </span>
                                                <span className=" me-1 text-decoration-line-through text-sm">₹{book.ebookPrice}</span>
                                                <span className="color-two text-xsm fw-semibold">(ebook)</span>
                                            </div>
                                            <div className={`${book.hardCopySalePrice <1 ? 'd-none' :'d-block'}`}>
                                                <span className="text-lg text-danger fw-semibold">{book.hardCopySalePrice <1 ? 'Not Available': `₹ ${book.hardCopySalePrice}`} </span>
                                                <span className="text-muted me-1 text-decoration-line-through text-sm">{book.hardCopyPrice<1 ? '': `₹${book.hardCopyPrice}`}</span>
                                                <span className="color-two text-sm fw-semibold">(Hardcopy)</span>
                                            </div>
                                        </div>
                                        <div className="text-warning d-flex align-items-center">
                                            <BookStartRating bookId={book._id} defaultRating={book.defaultRatings || 0} defaultCount={book.defaultRatingUser || 0} />
                                        </div>
                                    </div>
                                    <div className='d-flex gap-1 flex-column flex-md-row'>
                                        <div className='d-flex gap-1'>
                                            <span>
                                                <select className="form-select py-1" value={quantity}
                                                    onChange={(e) => setQuantity(Number(e.target.value))}>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                </select>

                                            </span>
                                            <span>
                                                <select className="form-select py-1" value={format}
                                                    onChange={(e) => setFormat(e.target.value)}>
                                                    <option value="ebook">ebook</option>
                                                    <option value="hardcopy" className={`${book.hardCopySalePrice <1 ? 'd-none' :'d-block'}`} disabled={book.hardCopyPrice < 1} >hardcopy</option>
                                                </select>
                                            </span>

                                            <span className={`color-white btn-one text-sm cursor-pointer py-1 me-1 ${added ? 'bg-success text-white' : 'hover-color-2 border-color-two  bg-two'}`} onClick={() => handleAddToCart(book._id)}>
                                                {added ? <><FaCheck className="me-1" /> Added to Cart</>
                                                    : loading ? 'Adding...'
                                                        : <> <FaShoppingCart className="me-1" /> Add to Cart</>}

                                            </span>
                                        </div>
                                        {/* <span className="mt-2 mt-md-0 btn text-xsm btn-one btn-outline-secondary">
                                            <FaEye /> Sample
                                        </span> */}
                                        <span className="bg-one color-white me-1 border-color-one hover-color-1 btn-one cursor-pointer d-flex align-items-center justify-content-center">
                                            <FaBook className="me-1" /> Read
                                        </span>


                                    </div>


                                </div>
                            </div>

                            <div>
                                <AdsMiddle />
                            </div>

                            {/* Related Books */}
                            <div className="mt-3">
                                <div className="d-flex justify-content-between pb-2">
                                <h5 className="mb-0 text-md color-two">Others Books</h5>
                                <span className="text-sm seeAll cursor-pointer"  onClick={() => navigate("/books")}>
                                    See All
                                </span>
                            </div>
                                <OwlCarousel className="owl-theme" {...options}>
                                    {relatedBooks.map((item) => (
                                        <div key={item._id} className="item" onClick={() => handleBookDetails(item)}>
                                            <div className="slider-book-img shadow-sm">
                                                <img
                                                    src={item.coverImage}
                                                    className="img-fluid book-slider-image"
                                                    alt={item.title}
                                                />
                                                {/* <div className="card-body p-2">
                                                    <h6 className="text-lg mb-0">{item.title}</h6>
                                                    <p className="text-muted mb-0">₹{item.price}</p>
                                                </div> */}
                                            </div>
                                        </div>
                                    ))}
                                </OwlCarousel>
                            </div>

                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default BookDetails;
