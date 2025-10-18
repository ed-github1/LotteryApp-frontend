import SuperBallTicketSummary from "../../features/superball/SuperBallTicketSummary"

const SuperBallTicketSummaryPage = () => {
    return (
        <div className="w-full max-w-9xl pb-32 lg:pb-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-white">Review Your Tickets</h2>
            <SuperBallTicketSummary />
        </div>
    )
}

export default SuperBallTicketSummaryPage