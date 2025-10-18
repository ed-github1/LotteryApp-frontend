import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StepContext = createContext();

export const useStepper = () => useContext(StepContext);

// Define the steps of your purchase flow
const stepsConfig = [
  { path: '/dashboard/buy-ticket', label: 'Select Tickets', step: 1 },
  { path: '/dashboard/ticket-summary', label: 'Review Order', step: 2 },
  { path: '/dashboard/payment', label: 'Payment', step: 3 },
  { path: '/dashboard/pending', label: 'Order Pending', step: 4 },
];

export const StepProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine the current step based on the URL (case-insensitive)
  const getCurrentStep = () => {
    const currentPath = location.pathname.toLowerCase();
    const current = stepsConfig.find(step => currentPath.startsWith(step.path.toLowerCase()));
    return current ? current.step : 0; // Default to 0 if not in the flow
  };

  const [currentStep, setCurrentStep] = useState(getCurrentStep());

  // Update the step whenever the URL changes
  useEffect(() => {
    setCurrentStep(getCurrentStep());
  }, [location.pathname]);

  const goToNextStep = () => {
    const nextStepIndex = stepsConfig.findIndex(step => step.step === currentStep) + 1;
    if (nextStepIndex < stepsConfig.length) {
      const nextStep = stepsConfig[nextStepIndex];
      navigate(nextStep.path);
    }
  };

  // Allow navigating back to previous, completed steps
  const goToStep = (stepNumber) => {
    const targetStep = stepsConfig.find(step => step.step === stepNumber);
    if (targetStep && stepNumber < currentStep) {
      navigate(targetStep.path);
    }
  }

  const value = {
    steps: stepsConfig,
    currentStep,
    goToNextStep,
    goToStep,
  };

  return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
};