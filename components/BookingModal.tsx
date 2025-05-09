'use client';

import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

interface MenuItem {
  name: string;
  price: number;
}

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  restaurantName: string;
  onBook: (date: string, time: string, selectedMenu: MenuItem[]) => void;
  menu: MenuItem[];
  connected: boolean;
  connect: () => void;
  setSelectedRestaurant: (restaurantName: string) => void;
  setModalOpen: (isOpen: boolean) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ open, onClose, restaurantName, onBook, menu, connected, connect, setSelectedRestaurant, setModalOpen }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<MenuItem[]>([]);
  const [paymentDone, setPaymentDone] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  if (!open) return null;

  const handleMenuChange = (item: MenuItem, checked: boolean) => {
    if (checked) {
      setSelectedMenu([...selectedMenu, item]);
    } else {
      setSelectedMenu(selectedMenu.filter(m => m.name !== item.name));
    }
  };

  const totalPrice = selectedMenu.reduce((sum, item) => sum + item.price, 0);

  const handlePay = async () => {
    if (!publicKey) return;
    const recipient = new PublicKey('YOUR_RESTAURANT_SOL_ADDRESS');
    const solAmount = totalPrice * 0.01;
    const lamports = solAmount * LAMPORTS_PER_SOL;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipient,
        lamports: Math.round(lamports),
      })
    );

    try {
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');
      setPaymentDone(true);
      alert('Payment successful!');
    } catch (err) {
      alert('Payment failed: ' + (err as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-xl font-bold mb-4">Book at {restaurantName}</h2>
        {/* Menu Section */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Menu</h3>
          <ul>
            {menu.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center border-b py-1">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedMenu.some(m => m.name === item.name)}
                    onChange={e => handleMenuChange(item, e.target.checked)}
                  />
                  <span>{item.name}</span>
                </label>
                <span>RM {item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Total: RM {totalPrice.toFixed(2)}</h3>
          {connected && selectedMenu.length > 0 && !paymentDone && (
            <button
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              onClick={handlePay}
              type="button"
            >
              Pay {(totalPrice * 0.01).toFixed(4)} SOL
            </button>
          )}
          {paymentDone && (
            <div className="text-green-600 font-semibold mt-2">Payment received!</div>
          )}
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            onBook(date, time, selectedMenu);
          }}
        >
          <label className="block mb-2">
            Date:
            <input
              type="date"
              className="block w-full border rounded px-2 py-1 mt-1"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </label>
          <label className="block mb-4">
            Time:
            <input
              type="time"
              className="block w-full border rounded px-2 py-1 mt-1"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
            />
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded transition text-white ${connected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}`}
              disabled={!connected || !paymentDone}
            >
              {connected ? 'Book' : 'Login to Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
