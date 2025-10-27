import React, { useRef } from "react";
import logo from "../assets/logo1.png";
import { FaPrint } from "react-icons/fa";
export default function Invoice() {
  const invoiceRef = useRef();
  // Print only invoice

  const orderId='ORD2025000136'


  const handlePrint = () => {
    const printContents = invoiceRef.current.innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>${orderId}_Invoice</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        </head>
        <body>${printContents}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content-row">
          <main className="app-container">
          

            {/* Invoice Section */}
            <div ref={invoiceRef} className="border-0 invoice-card">
              {/* Header */}
              <div className="d-flex justify-content-between mb-4 border-bottom ">
                <div><img style={{ width: 100 }} src={logo} alt="logo" /></div>
                <div>
                  <h5 className="mb-0 text-lg">ORD#:2025000136</h5>
                  <p>Date: 23-Aug-2025</p>
                </div>
              </div>

              {/* Shipping Details */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div style={{ flex: 1, paddingRight: "10px" }}>
                  <h6>EarnQ</h6>
                  <p>
                    123 Courier Street, Kolkata, WB <br />
                    +91 9876543210 <br />
                    support@earnq.in
                  </p>
                </div>
                <div style={{ flex: 1, paddingRight: "10px" }}>
                  <h6>Sender</h6>
                  <p>
                    Nandalal Majhi <br />
                    45/2, Howrah, WB <br />
                    +91 9999999999
                  </p>
                </div>
                <div style={{ flex: 1, paddingRight: "10px" }}>
                  <h6>Receiver</h6>
                  <p>
                    Rajesh Kumar <br />
                    101 Park Street, Delhi <br />
                    +91 8888888888
                  </p>
                </div>
              </div>

              {/* Package Details */}
              <table className="table table-bordered">
                <thead className="table-light text-sm">
                  <tr>
                    <th>Package</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Books</td>
                    <td>1</td>
                    <td>₹120</td>
                    <td>₹120</td>
                  </tr>
                  <tr>
                    <td>Electronics Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum, nisi!</td>
                    <td>1</td>
                    <td>₹350</td>
                    <td>₹350</td>
                  </tr>
                </tbody>
              </table>

              {/* Total and Payment Info */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginTop: "20px",
                fontSize: "0.9rem",
                lineHeight: "1.2",
                position: "relative" // relative container for watermark
              }}
              >
                {/* Watermark */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(-45deg)",
                  fontSize: "2.5rem",
                  color: "rgba(0, 0, 0, 0.15)",
                  fontWeight: "bold",
                  pointerEvents: "none",
                  zIndex: 0,
                  whiteSpace: "nowrap"
                }}>
                  PAID
                </div>

                {/* Payment info left */}
                <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
                  <p style={{ margin: "2px 0" }}><strong>Pay Method:</strong> Online (Credit Card) </p>
                  {/* <p style={{ margin: "2px 0" }}><strong>Payment Status:</strong> <span style={{ color: "green", fontWeight: "bold" }}>Paid</span></p> */}
                </div>

                {/* Totals right */}
                <div style={{ textAlign: "right", position: "relative", zIndex: 1 }}>
                  <p style={{ margin: "2px 0" }}><strong>Subtotal:</strong> ₹470</p>
                  <p style={{ margin: "2px 0" }}><strong>GST (18%):</strong> ₹84.60</p>
                  <h5 style={{ margin: "4px 0", lineHeight: "1.2" }}><strong>Grand Total: ₹554.60</strong></h5>
                </div>
              </div>


              {/* Footer */}
              <div className="mt-5 pt-3" style={{ borderTop: "1px solid #ccc", textAlign: "center", fontSize: "0.85rem", color: "#555" }}>
                <p style={{ marginBottom: "4px", fontWeight: "500" }}>Thank you for choosing <strong>EarnQ</strong>!</p>
                <small style={{ display: "block", color: "#888" }}>This is a system-generated invoice and does not require a signature.</small>
                <small style={{ display: "block", color: "#888" }}>For any queries, contact us: support@earnq.in</small>
                <small style={{ display: "block", color: "#888", marginTop: "2px" }}>
    Visit our website: <a href="https://earnq.in" target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none" }}>www.earnq.in</a>
  </small>
              </div>
              

            </div>
            <div className="text-center mt-3">
                <span className="btn-one bg-one color-white me-2 border-0 pb-1 cursor-pointer" onClick={handlePrint}><FaPrint/> Print</span>
              </div>
          </main>
        </div>
      </div>
    </>
  );
}
