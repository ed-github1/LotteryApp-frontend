import { CircleFlag } from "react-circle-flags";


const SelectedCountryInfo = ({ selectedCountry, pricePerSelection }) => {
    if (!selectedCountry) return null;

    return (
        <div className="mt-5 bg-gradient-to-r from-[#FFD700]/20 to-[#FFC300]/20 backdrop-blur-sm rounded-xl p-4 mb-4 border border-[#FFD700]/30">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <CircleFlag
                            countryCode={selectedCountry.flag}
                            alt={selectedCountry.name}
                            className="h-8 w-8 rounded-full border-2 border-[#FFD700] shadow-md"
                        />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white">✓</span>
                        </div>
                    </div>
                    <div>
                        <span className="font-bold text-white text-lg">
                            {selectedCountry.name}
                        </span>

                    </div>
                </div>
                <div className="text-right">
                    <span className="text-sm text-white/80 font-medium">
                        Range: 1-{selectedCountry.totalNumbers}
                    </span>
                    <div className="text-xs text-[#FFD700]">
                        💰 ${pricePerSelection} each
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectedCountryInfo;