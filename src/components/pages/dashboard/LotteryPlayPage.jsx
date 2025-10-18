import Lottery from "../../features/lottery//Lottery"
import { useStepper } from "../../../context/StepContext";
import Stepper from "../../common/Stepper";
import JackpotBanner from "../../features/lottery/JackpotBanner";
import { useDraw } from '../../../context/DrawContext'


const LotteryPlayPage = () => {
  const { goToNextStep } = useStepper();
  const { getCurrentFridayUTC } = useDraw();
  const fridayDrawDate = getCurrentFridayUTC();

  return (
    <div className="min-h-screen pb-20 w-full relative ">
      {/* Jackpot banner and Stepper in a shared container */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-7xl px-4">
          {/* Use today's date for current prize pool */}
          <JackpotBanner />
        </div>
        <div className="w-full max-w-7xl mt-2">
          <Stepper />
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-2">
        <Lottery goToNextStep={goToNextStep} />
      </div>
    </div>
  )
}

export default LotteryPlayPage