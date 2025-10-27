import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthToken } from "../utils/getAuthToken";
import { decodeToken } from "../utils/decodeToken";
import API from "../utils/axios";
import { useNavigate } from "react-router-dom";
const BookPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getAuthToken();
  const userData = decodeToken(token);
  const userId = userData.id;
 const navigate = useNavigate();
  // Fetch orders for this user
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/books/orders/${userId}`);
       
        
        if (response.data.status === 1) {
          // Flatten all items from all orders
          const books = response.data.orders.flatMap(order =>
            order.items.map(item => ({
              id: item.bookId,
              title: item.title,
              bookId: item.bookId,
              orderId: order.orderId,
              totalPages:item.totalPages,
              price: `₹${item.price}`,
              salePrice: `₹${item.salePrice}`,
              format: `${item.format}`,
              date: new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
              image: item.coverImage,
            }))
          );
          setPurchases(books);
        } else {
          
          console.log(message);
          
        }
      } catch (err) {
        // console.error(err);
        setError(err.response.data.message);
  
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchOrders();
  }, [userId]);

  if (loading) return <p className="text-center mt-4">Loading orders...</p>;

  const handelReadBook=(book)=>{
    // alert(book.title);
    navigate(`/book/read/${book.title}`, { state: { book } });
  }

  return (
    <div className="page-wrapper">
      <div className="content-row">
        <main className="app-container mb-2">
          <div>
            <h1 className="fw-bold mb-2 text-md">My Books</h1>
            <p className="text-muted mb-4">
              Here’s the complete list of books you’ve purchased. You can revisit them anytime.
            </p>

            {error && (
              <p className="text-center mt-4 text-danger">{error}</p>
            )}

            <div className="row g-2">
              {purchases.map((book) => (
                <div key={book.id} className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-body p-2">
                      <div className="row">
                        <div className="col-3 col-md-2">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="rounded img-fluid book-purches-img"
                          />
                        </div>
                        <div className="col-9 col-md-10">
                          <div className="row d-flex justify-content-between align-items-center">
                            <div className="col-md-8 px-0">
                              <h5 className="text-sm mb-1">{book.title}</h5>
                              <p className="text-muted text-xxsm fw-light mb-1"> <span>ORDI: {book.orderId}</span>, <span>{book.date}</span></p>
                              <p className="text-muted fw-light mb-0"> {book.format}</p>
                            </div>
                            <div className="col-md-4 d-flex flex-md-column justify-content-center">
                              {book.format === 'ebook' && (
                                <span className="btn-one text-center text-xsm cursor-pointer color-one hover-color-one border-color-one my-1 mx-1" onClick={() => handelReadBook(book)}>
                                  Read
                                </span>
                              )}

                              <span className="btn-one text-xsm text-center cursor-pointer color-two hover-color-two border-color-two my-1 mx-1">Review</span>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookPurchases;
