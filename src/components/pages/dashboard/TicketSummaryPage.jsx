import { useTicket } from "../../../context/TicketContext";
import { useStepper } from "../../../context/StepContext";
import TicketSummary from "../../features/lottery/TicketSummary";
import Stepper from "../../common/Stepper";
const TicketSummaryPage = () => {
  const { tickets, removeTicket, countryConfigs } = useTicket();
  const { goToNextStep } = useStepper();

  const handleDeleteTicket = (idx) => removeTicket(idx);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pb-32 lg:pb-12 ">
      <Stepper />
      <div className="w-full px-4 bg-white/5">
        <div className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Review Your Tickets
        </div>
        <TicketSummary
          tickets={tickets}
          handleDeleteTicket={handleDeleteTicket}
          countryConfigs={countryConfigs}
          onReview={goToNextStep}
        />
      </div>
    </div>
  );
};

export default TicketSummaryPage;