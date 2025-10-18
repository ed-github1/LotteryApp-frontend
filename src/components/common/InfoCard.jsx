const InfoCard = ({ 
  label, 
  value, 
  editMode, 
  register, 
  name, 
  validation, 
  error, 
  disabled = false,
  autoComplete,
  icon 
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-white/20">
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">{icon}</span>
          </div>
        )}
        <span className="text-sm text-white/80 font-medium">
          {label}
        </span>
      </div>
      
      {editMode ? (
        <div>
          <input
            {...register(name, validation)}
            className={`w-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all duration-300 ${
              error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' : ''
            }`}
            disabled={disabled}
            autoComplete={autoComplete}
            aria-invalid={!!error}
          />
          {error && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {error.message}
            </p>
          )}
        </div>
      ) : (
        <span className="font-semibold text-white text-lg">
          {value || (
            <span className="text-white/60 italic">Not provided</span>
          )}
        </span>
      )}
    </div>
  );
};

export default InfoCard;
