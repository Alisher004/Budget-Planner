'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePremium } from '@/hooks/usePremium';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function CalculatorPage() {
  const { user, loading } = useAuth();
  const { isPremium, isTrialActive, trialDaysLeft, loading: loadingPremium } = usePremium(user);
  const router = useRouter();
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || loadingPremium || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handlePercentage = () => {
    const currentValue = parseFloat(display);
    
    if (previousValue !== null && operation) {
      // Calculate percentage of previous value
      // Example: 200 + 10% = 200 + (200 * 0.10) = 220
      let percentValue = 0;
      
      switch (operation) {
        case '+':
        case '-':
          percentValue = previousValue * (currentValue / 100);
          break;
        case '*':
        case '/':
          percentValue = currentValue / 100;
          break;
        default:
          percentValue = currentValue / 100;
      }
      
      setDisplay(String(percentValue));
    } else {
      // Just convert to percentage
      setDisplay(String(currentValue / 100));
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let newValue = currentValue;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '*':
          newValue = currentValue * inputValue;
          break;
        case '/':
          newValue = currentValue / inputValue;
          break;
        default:
          break;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      let result = previousValue;

      switch (operation) {
        case '+':
          result = previousValue + inputValue;
          break;
        case '-':
          result = previousValue - inputValue;
          break;
        case '*':
          result = previousValue * inputValue;
          break;
        case '/':
          result = previousValue / inputValue;
          break;
        default:
          break;
      }

      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const Button = ({ value, onClick, className = '', span = false, rowSpan = false }: any) => (
    <button
      onClick={onClick}
      className={`h-16 rounded-xl font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-sm ${
        span ? 'col-span-2' : ''
      } ${rowSpan ? 'row-span-2' : ''} ${className}`}
    >
      {value}
    </button>
  );

  return (
    <DashboardLayout
      userEmail={user.email}
      isPremium={isPremium}
      isTrialActive={isTrialActive}
      trialDaysLeft={trialDaysLeft}
    >
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-full">
        <div className="w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            Калькулятор
          </h1>

          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            {/* Display */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 mb-6 shadow-inner">
              <div className="text-right text-3xl sm:text-4xl font-bold text-white break-all min-h-[48px] flex items-center justify-end">
                {display}
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {/* Row 1 */}
              <Button
                value="AC"
                onClick={clear}
                className="bg-red-500 hover:bg-red-600 text-white"
              />
              <Button
                value="⌫"
                onClick={backspace}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              />
              <Button
                value="%"
                onClick={handlePercentage}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              />
              <Button
                value="÷"
                onClick={() => performOperation('/')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              />

              {/* Row 2 */}
              <Button
                value="7"
                onClick={() => inputDigit('7')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900"
              />
              <Button
                value="8"
                onClick={() => inputDigit('8')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900"
              />
              <Button
                value="9"
                onClick={() => inputDigit('9')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900"
              />
              <Button
                value="×"
                onClick={() => performOperation('*')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              />

              {/* Row 3 */}
              <Button
                value="4"
                onClick={() => inputDigit('4')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900"
              />
              <Button
                value="5"
                onClick={() => inputDigit('5')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900"
              />
              <Button
                value="6"
                onClick={() => inputDigit('6')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900"
              />
              <Button
                value="−"
                onClick={() => performOperation('-')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              />

              {/* Row 4 */}
              <Button
                value="1"
                onClick={() => inputDigit('1')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900"
              />
              <Button
                value="2"
                onClick={() => inputDigit('2')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900"
              />
              <Button
                value="3"
                onClick={() => inputDigit('3')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900"
              />
              <Button
                value="+"
                onClick={() => performOperation('+')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              />

              {/* Row 5 */}
              <Button
                value="0"
                onClick={() => inputDigit('0')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 col-span-2"
                span
              />
              <Button
                value="."
                onClick={inputDecimal}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900"
              />
              <Button
                value="="
                onClick={handleEquals}
                className="bg-green-500 hover:bg-green-600 text-white"
              />
            </div>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">💡 Как использовать %:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 200 + 10% = 220 (добавить 10% от 200)</li>
              <li>• 200 - 10% = 180 (вычесть 10% от 200)</li>
              <li>• 50 × 20% = 10 (50 умножить на 0.2)</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
