import { useNavigate } from "react-router-dom";
import ActionButton from "../../common/ActionButtons";
import TicketCard from "./TicketCard";

const TicketSummary = ({ tickets = [], handleDeleteTicket, onReview, winningTicketsMap = new Map() }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col max-h-[80vh] h-fullrounded-2xl bg-white/10 ">
        {/* Scrollable tickets list or no tickets message */}
        <div className="flex-1 overflow-y-auto space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-2 ">
          {tickets.length === 0 ? ( 
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-center text-lg p-16 text-white">No tickets found. Please add some tickets first.</p>
            </div>
          ) : (
            tickets.map((ticket, idx) => (
              <TicketCard
                key={idx}
                ticket={ticket}
                idx={idx}
                onDelete={() => handleDeleteTicket(idx)}
                winningTicketsMap={winningTicketsMap}
              />
            ))
          )}
        </div>
      </div>

      {/* Go Back Button */}
      <div className="my-5">
        <ActionButton
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
          icon="←"
          onClick={() => navigate("/dashboard/buy-ticket")}
        >
          Back to Buy Ticket
        </ActionButton>
      </div>
      {/* Static Continue Button */}
      <div className="bg-gradient-to-t from-white/10 via-white/5 to-transparent">
        <ActionButton
          className={
            tickets.length === 0
              ? 'bg-gray-600 text-gray-400'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
          }
          icon="🧾"
          disabled={tickets.length === 0}
          onClick={onReview}
        >
          Continue to Receipt ({tickets.length} ticket{tickets.length !== 1 ? 's' : ''})
        </ActionButton>
      </div>
    </>
  );
};

export default TicketSummary;