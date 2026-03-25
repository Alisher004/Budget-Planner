'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';

export default function CalculatorPage() {
  const { user, loading } = useAuth();
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

  if (loading || !user) {
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

  const Button = ({ value, onClick, className = '', span = false }: any) => (
    <button
      onClick={onClick}
      className={`h-16 rounded-lg font-semibold text-lg transition-all hover:scale-105 active:scale-95 ${
        span ? 'col-span-2' : ''
      } ${className}`}
    >
      {value}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userEmail={user.email} />
      
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Калькулятор</h1>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Display */}
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <div className="text-right text-4xl font-bold text-white break-all">
                {display}
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-4 gap-3">
              <Button
                value="C"
                onClick={clear}
                className="bg-red-500 hover:bg-red-600 text-white"
              />
              <Button
                value="/"
                onClick={() => performOperation('/')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              />
              <Button
                value="*"
                onClick={() => performOperation('*')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              />
              <Button
                value="-"
                onClick={() => performOperation('-')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              />

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
                value="+"
                onClick={() => performOperation('+')}
                className="bg-blue-500 hover:bg-blue-600 text-white row-span-2"
              />

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
                value="="
                onClick={handleEquals}
                className="bg-green-500 hover:bg-green-600 text-white row-span-2"
              />

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
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-4">
            Простой калькулятор для быстрых расчетов
          </p>
        </div>
      </main>
    </div>
  );
}
