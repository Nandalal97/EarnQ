import React, { useEffect, useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import API from '../utils/axios';
import { useNavigate } from 'react-router-dom';
function RelatedBooks() {
    const navigate = useNavigate();
    const [relatedBooks, setRelatedBooks] = useState([])
    const [loading, setLoading] = useState(false);
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

    };

    return (
        <>
            <div>
                {relatedBooks.length <= 1 ? (
                    <p className="text-center fw-light text-danger"></p>
                ) : (
                    <>
                        <div className="features-card my-3">
                            <div className="d-flex justify-content-between pb-2">
                                <h5 className="mb-0 text-md color-two">Books</h5>
                                <span className="text-xxsm seeAll cursor-pointer" onClick={() => navigate("/books")}>
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
                    </>

                )}


            </div>
        </>
    )
}

export default RelatedBooks