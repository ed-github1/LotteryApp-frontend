const countryNames = {
    US: 'United States',
    CA: 'Canada',
    MX: 'Mexico',
    GB: 'United Kingdom',
    FR: 'France',
    IT: 'Italy',
    KR: 'South Korea',
    NZ: 'New Zealand',
    // Add more as needed
};

const TicketsReceipt = ({ tickets, date, receiptNumber, customerId }) => {
    // Calculate real total from tickets if not present
    const subtotal = tickets?.reduce((sum, t) => sum + (t.price || 5), 0) || 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    return (
        <div className="bg-zinc-100 w-full text-black shadow-xl border border-gray-200 font-mono text-sm">
            {/* Receipt Header */}
            <div className=" text-center py-3 px-4">
                <div className="font-bold text-lg">PURCHASE RECEIPT</div>
                <div className="text-xs opacity-75">Global Lottery</div>
            </div>

            {/* Receipt Details */}
            <div className="px-4 py-3 border-b border-dashed border-gray-300">
                <div className="flex justify-between text-xs mb-1">
                    <span>Receipt #:</span>
                    <span className="font-bold">{receiptNumber}</span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                    <span>Date:</span>
                    <span>{date}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span>Customer ID:</span>
                    <span>{customerId}</span>
                </div>
            </div>

            {/* Items */}
            <div className="px-4 py-3">
                <div className="font-bold text-xs mb-3 uppercase tracking-wide">LOTTERY TICKETS</div>
                {tickets?.length > 0 ? (
                    <div className="space-y-3">
                        {tickets.map((ticket, idx) => {
                            const code = ticket.countryCode || (ticket.selections[0]?.countryCode ?? 'N/A');
                            const country = countryNames[code] || code;
                            const price = ticket.price || 5;
                            return (
                                <div key={idx} className="border-b border-dotted border-gray-300 pb-2">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="text-xs font-semibold">TICKET #{String(idx + 1).padStart(3, '0')}</div>
                                        <div className="text-xs font-bold">${price.toFixed(2)}</div>
                                    </div>
                                    <div className="text-xs text-gray-600 mb-1">{country} ({code})</div>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {Array.isArray(ticket.selections) && ticket.selections.length > 0 ? (
                                                                                ticket.selections.map((sel, nidx) => (
                                                                                    <span key={nidx} className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                                                                                        {typeof sel === 'object' && sel !== null && 'number' in sel ? sel.number : String(sel)}
                                                                                    </span>
                                                                                ))
                                                                            ) : ticket.selections && typeof ticket.selections === 'object' && Object.keys(ticket.selections).length > 0 ? (
                                                                                Object.entries(ticket.selections).map(([country, number], nidx) => (
                                                                                    <span key={nidx} className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                                                                                        {number}
                                                                                    </span>
                                                                                ))
                                                                            ) : (
                                                                                <span className="text-xs italic text-gray-400">No selections</span>
                                                                            )}
                                                                        </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 text-xs py-4">No tickets selected</div>
                )}
            </div>

            {/* Totals */}
            <div className="px-4 py-3 border-t border-dashed border-gray-400 bg-gray-50">
                <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span>Subtotal ({tickets?.length || 0} tickets):</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span>Tax (8%):</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm border-t border-gray-400 pt-1">
                        <span>TOTAL:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-100 text-center">
                <div className="text-xs text-gray-600 mb-1">Thank you for playing!</div>
                <div className="text-xs text-gray-500">Keep this receipt for your records</div>
                <div className="text-xs text-gray-400 mt-2">www.lottery-app.com</div>
            </div>
        </div>
    );
};

export default TicketsReceipt;