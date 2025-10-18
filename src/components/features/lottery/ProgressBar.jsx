import { useTicket } from '../../../context/TicketContext';
const ProgressBar = ({ countrySelections }) => {
  const { countryConfigs } = useTicket();
  const totalCountries = countryConfigs.length
  const selectedCount = Object.keys(countrySelections).filter(
    (key) => countrySelections[key]
  ).length

  return (
    <div className="w-full my-4">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-semibold text-gray-700">
          Countries selected: {selectedCount}/{totalCountries}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-yellow-400 h-2.5 rounded-full"
          style={{
            width: `${(selectedCount / totalCountries) * 100}%`
          }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
