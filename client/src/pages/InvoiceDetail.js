import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPrint, FaArrowLeft, FaEdit } from 'react-icons/fa';

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const printRef = useRef();

  useEffect(() => {
    axios.get(`/api/invoices/${id}`).then(r => setInvoice(r.data.invoice)).catch(() => toast.error('Invoice not found')).finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  const updatePayment = async (received) => {
    await axios.put(`/api/invoices/${id}`, { received, status: received >= invoice.finalAmount ? 'Paid' : 'Partial' });
    const res = await axios.get(`/api/invoices/${id}`);
    setInvoice(res.data.invoice);
    toast.success('Payment updated');
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!invoice) return <div className="empty-state"><p>Invoice not found</p></div>;

  const inv = invoice;

  return (
    <div>
      <div className="page-header no-print">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/invoices')}><FaArrowLeft /></button>
          <div><h1>{inv.invoiceNumber}</h1><p>Tax Invoice</p></div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-outline" onClick={handlePrint}><FaPrint /> Print / PDF</button>
          <select className="form-control" style={{ width: 160 }} defaultValue={inv.status}
            onChange={async e => { await axios.put(`/api/invoices/${id}`, { status: e.target.value }); toast.success('Status updated'); }}>
            {['Draft','Issued','Paid','Partial','Cancelled'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Printable Invoice */}
      <div className="invoice-print" ref={printRef}>
        {/* Header */}
        <div className="inv-header">
          <div className="inv-company">
            <div className="inv-logo">⚡</div>
            <div>
              <h1>ANCHAL ELECTRICALS</h1>
              <p>GSTIN: 24AHWPG6193R1ZA | State: 24-Gujarat</p>
              <p>Shop No 14/16, Nirant Shopping Centre, Opp. Subhash Estate, Ramol Road, C.T.M. Ahmedabad 380026</p>
              <p>📞 9664624690 | ✉ electricalsanchal@gmail.com</p>
            </div>
          </div>
          <div className="inv-title">
            <h2>Tax Invoice</h2>
            <table className="inv-meta-table">
              <tbody>
                <tr><td>Invoice No.</td><td><strong>{inv.invoiceNumber}</strong></td></tr>
                <tr><td>Date</td><td>{new Date(inv.createdAt).toLocaleDateString('en-IN')}</td></tr>
                <tr><td>Place of Supply</td><td>{inv.placeOfSupply}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bill To */}
        <div className="inv-bill">
          <div className="bill-to">
            <div className="bill-label">Bill To</div>
            <strong>{inv.customer.name}</strong>
            {inv.customer.address && <p>{inv.customer.address}</p>}
            {inv.customer.phone && <p>Contact: {inv.customer.phone}</p>}
            {inv.customer.gstin && <p>GSTIN: {inv.customer.gstin}</p>}
            {inv.customer.state && <p>State: {inv.customer.state}</p>}
          </div>
        </div>

        {/* Items */}
        <table className="inv-items">
          <thead>
            <tr>
              <th>#</th><th>Item Name</th><th>HSN/SAC</th><th>Qty</th><th>Unit</th>
              <th>Price/Unit</th><th>GST</th><th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {inv.items.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td><strong>{item.name}</strong></td>
                <td>{item.hsnCode || '—'}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>₹{Number(item.pricePerUnit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td>₹{Number(item.gstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({item.gstRate}%)</td>
                <td>₹{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={6}><strong>Total</strong></td><td><strong>₹{Number(inv.totalAmount - inv.subTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td><td><strong>₹{Number(inv.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td></tr>
          </tfoot>
        </table>

        {/* Totals */}
        <div className="inv-footer">
          <div className="inv-bank">
            <strong>Pay To:</strong>
            <p>Bank: State Bank Of India, Express Highway Junction New</p>
            <p>Account No.: 36441708334</p>
            <p>IFSC: SBIN0016028</p>
            <p>Holder: ANCHAL ELECTRICALS</p>
            {inv.notes && <p style={{ marginTop: 12, fontStyle: 'italic' }}><strong>Note:</strong> {inv.notes}</p>}
            <div className="inv-words">
              <strong>Amount in Words:</strong>
              <p style={{ fontStyle: 'italic' }}>₹{inv.finalAmount?.toLocaleString('en-IN')} only</p>
            </div>
          </div>
          <div className="inv-totals">
            <div className="total-row-p"><span>Sub Total</span><span>₹{Number(inv.subTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
            <div className="total-row-p"><span>SGST @9%</span><span>₹{Number(inv.sgst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
            <div className="total-row-p"><span>CGST @9%</span><span>₹{Number(inv.cgst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
            {inv.roundOff !== 0 && <div className="total-row-p"><span>Round Off</span><span>₹{inv.roundOff?.toFixed(2)}</span></div>}
            <div className="total-row-p grand-total"><span>Total</span><span>₹{Number(inv.finalAmount).toLocaleString('en-IN')}</span></div>
            <div className="total-row-p"><span>Received</span><span>₹{Number(inv.received).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
            <div className="total-row-p balance-row"><span>Balance</span><span>₹{Number(inv.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
          </div>
        </div>

        <div className="inv-sign">
          <div className="terms"><strong>Terms & Conditions</strong><p>Thanks for doing business with us!</p></div>
          <div className="sign-box"><p>For: ANCHAL ELECTRICALS</p><div className="sign-space"></div><p><strong>Authorized Signatory</strong></p></div>
        </div>
      </div>

      <style>{`
        .invoice-print { background: white; border-radius: var(--radius); border: 1px solid var(--border); padding: 32px; max-width: 900px; }
        .inv-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 2px solid var(--primary); }
        .inv-company { display: flex; gap: 16px; }
        .inv-logo { width: 56px; height: 56px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 26px; color: white; flex-shrink: 0; }
        .inv-company h1 { font-size: 22px; color: var(--secondary); }
        .inv-company p { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
        .inv-title h2 { font-size: 28px; color: var(--secondary); text-align: right; margin-bottom: 12px; }
        .inv-meta-table td { padding: 4px 12px; font-size: 13px; }
        .inv-meta-table td:first-child { color: var(--text-muted); }
        .inv-bill { background: var(--bg); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 20px; }
        .bill-label { font-size: 13px; color: var(--primary); font-weight: 700; margin-bottom: 6px; }
        .inv-bill strong { font-size: 16px; color: var(--secondary); display: block; margin-bottom: 4px; }
        .inv-bill p { font-size: 13px; color: var(--text-muted); }
        .inv-items { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; }
        .inv-items th { background: var(--secondary); color: white; padding: 10px 12px; text-align: left; }
        .inv-items td { padding: 10px 12px; border-bottom: 1px solid var(--border); }
        .inv-items tfoot td { background: #f8f8f8; font-weight: 600; border-top: 2px solid var(--border); }
        .inv-footer { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 20px; }
        .inv-bank p { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
        .inv-words { margin-top: 16px; background: var(--bg); padding: 12px; border-radius: 8px; font-size: 13px; }
        .inv-totals { border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; }
        .total-row-p { display: flex; justify-content: space-between; padding: 8px 16px; font-size: 14px; border-bottom: 1px solid var(--border); }
        .grand-total { background: var(--secondary); color: white; font-weight: 700; font-size: 16px; }
        .balance-row { background: #fff3cd; font-weight: 700; color: var(--warning); }
        .inv-sign { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid var(--border); padding-top: 20px; }
        .terms p { font-size: 13px; color: var(--text-muted); }
        .sign-box { text-align: center; }
        .sign-space { height: 50px; border-bottom: 1px solid var(--text); width: 180px; margin: 8px auto; }
        .sign-box p { font-size: 13px; }
        @media print {
          .no-print { display: none !important; }
          .invoice-print { border: none; box-shadow: none; padding: 0; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
}
