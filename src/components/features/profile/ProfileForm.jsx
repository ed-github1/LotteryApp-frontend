import FormInput from '../../common/FormInput'
import InfoCard from '../../common/InfoCard'
import { ActionButtons } from '../../common/ActionButtons'
import StatusMessage from '../../common/StatusMessage'

const ProfileForm = ({
  user,
  editMode,
  register,
  handleSubmit,
  onSubmit,
  handleEdit,
  handleCancel,
  errors,
  isDirty,
  isSubmitting,
  apiError,
  success
}) => (
  
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    {/* Name Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoCard
        label="First Name"
        value={user.firstName}
        editMode={editMode}
        register={register}
        name="firstName"
        validation={{ required: 'First name is required' }}
        error={errors.firstName}
        disabled={isSubmitting}
        autoComplete="given-name"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />
      
      <InfoCard
        label="Last Name"
        value={user.lastName}
        editMode={editMode}
        register={register}
        name="lastName"
        validation={{ required: 'Last name is required' }}
        error={errors.lastName}
        disabled={isSubmitting}
        autoComplete="family-name"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />
    </div>

    {/* Contact Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoCard
        label="Email Address"
        value={user.email}
        editMode={editMode}
        register={register}
        name="email"
        validation={{
          required: 'Email is required',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Invalid email address'
          }
        }}
        error={errors.email}
        disabled={isSubmitting}
        autoComplete="email"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
      />
      
      <InfoCard
        label="Phone Number"
        value={user.phone}
        editMode={editMode}
        register={register}
        name="phone"
        validation={{
          required: 'Phone number is required',
          pattern: {
            value: /^\d{2} \d{2} \d{2} \d{2}$/,
            message: 'Invalid phone number format (XX XX XX XX)'
          }
        }}
        error={errors.phone}
        disabled={isSubmitting}
        autoComplete="tel"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        }
      />
    </div>

    {/* Action Buttons */}
    <ActionButtons
      editMode={editMode}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
      onCancel={handleCancel}
    />

    {/* Status Messages */}
    <StatusMessage apiError={apiError} success={success} />
  </form>
)

export default ProfileForm