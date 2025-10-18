const FormInput = ({
  label,
  type = 'text',
  register,
  name,
  validation,
  error,
  disabled = false,
  autoComplete,
  className = '',
  placeholder,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        {...register(name, validation)}
        className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-red-400 focus:ring-red-300' : ''
        } ${className}`}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error.message}</p>
      )}
    </div>
  );
};

export default FormInput;
