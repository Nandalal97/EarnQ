import React, { useRef } from "react";
import html2pdf from "html2pdf.js";

export default function Invoice() {
  const invoiceRef = useRef();

  // Print only invoice
  const handlePrint = () => {
    const printContents = invoiceRef.current.innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Shipping Invoice</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        </head>
        <body>${printContents}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Download as PDF
  const handleDownload = () => {
    const element = invoiceRef.current;
    const options = {
      margin: 0.5,
      filename: "shipping-invoice.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  return (

    <>
      <div className="page-wrapper">
        <div className="content-row">
          <main className="app-container">
            
              <div className="d-flex justify-content-between mb-3">
                <h3>Shipping Invoice</h3>
                <div>
                  <button className="btn btn-primary me-2" onClick={handlePrint}>
                    Print
                  </button>
                  <button className="btn btn-success" onClick={handleDownload}>
                    Download
                  </button>
                </div>
              </div>

              {/* Invoice Section */}
              <div ref={invoiceRef} className="border-0 p-4 bg-white">
                {/* Header */}
                <div className="d-flex justify-content-between mb-4">
                  <div>
                    <h4>CourierX</h4>
                    <p>
                      123 Courier Street, Kolkata, WB <br />
                      Phone: +91 9876543210 <br />
                      Email: support@courierx.com
                    </p>
                  </div>
                  <div>
                    <h5>Invoice #: INV-2025-001</h5>
                    <p>Date: 23-Aug-2025</p>
                  </div>
                </div>

                {/* Shipping Details */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div style={{ flex: 1, paddingRight: "10px" }}>
                    <h6>Sender</h6>
                    <p>
                      Nandalal Majhi <br />
                      45/2, Howrah, WB <br />
                      Phone: +91 9999999999
                    </p>
                  </div>
                  <div style={{ flex: 1, paddingRight: "10px" }}>
                    <h6>Receiver</h6>
                    <p>
                      Rajesh Kumar <br />
                      101 Park Street, Delhi <br />
                      Phone: +91 8888888888
                    </p>
                  </div>
                </div>

                {/* Package Details */}
                <table className="table table-bordered">
                  <thead className="table-light">
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

                {/* Total */}
                <div className="text-end">
                  <p><strong>Subtotal:</strong> ₹470</p>
                  <p><strong>GST (18%):</strong> ₹84.60</p>
                  <h5><strong>Grand Total: ₹554.60</strong></h5>
                </div>

                {/* Footer */}
                <div className="mt-4 text-center">
                  <p>Thank you for choosing EarnQ!</p>
                  <small>This is a system-generated invoice.</small>
                </div>
              </div>
           
          </main>
        </div>
      </div>
    </>



  );
}
