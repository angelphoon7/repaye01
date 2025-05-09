import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import BookingModal from '../components/BookingModal';

const WalletButton = dynamic(() => import('../components/WalletButton'), {
  ssr: false
});

interface MenuItem {
  name: string;
  price: number;
}

interface Restaurant {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
  location: string;
  specialties: string[];
  menu: MenuItem[];
}

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Nasi Lemak Alor Corner",
    description: "Authentic Malaysian cuisine featuring the famous Nasi Lemak, with fragrant coconut rice, spicy sambal, and crispy anchovies.",
    image: "/images/nasi-lemak.jpg",
    rating: 4.5,
    location: "Kuala Lumpur",
    specialties: ["Nasi Lemak", "Chicken Rendang", "Ayam Kecap"],
    menu: [
      { name: "Nasi Lemak", price: 8 },
      { name: "Chicken Rendang", price: 12 },
      { name: "Ayam Kecap", price: 10 }
    ]
  },
  {
    id: 2,
    name: "Kedai Makan Suki",
    description: "A traditional Malaysian kedai makan serving authentic local dishes with a modern twist.",
    image: "/images/kedai-makan.jpg",
    rating: 4.6,
    location: "Kuala Lumpur",
    specialties: ["Nasi Lemak", "Laksa", "Bakso"],
    menu: [
      { name: "Nasi Lemak", price: 7 },
      { name: "Laksa", price: 9 },
      { name: "Bakso", price: 8 }
    ]
  },
  {
    id: 3,
    name: "Old Town White Coffee",
    description: "Malaysia's halal kopi tiam restaurant specialises in white coffee, teh tarik, nasi lemak and noodle dishes",
    image: "/images/old-town.jpg",
    rating: 4.8,
    location: "Kuala Lumpur",
    specialties: ["Nasi Lemak", "Curry Mee", "White Coffee"],
    menu: [
      { name: "Nasi Lemak", price: 9 },
      { name: "Curry Mee", price: 11 },
      { name: "White Coffee", price: 6 }
    ]
  },
  {
    id: 4,
    name: "Leaf n Co",
    description: "Leaf n Co is a cozy café to enjoy signature Nasi Lemak,Spaghetti in a warm space.",
    image: "/images/leaf.jpg",
    rating: 4.6,
    location: "Kuala Lumpur",
    specialties: ["Nasi Lemak", "Spaghetti", "Croissant"],
    menu: [
      { name: "Nasi Lemak", price: 10 },
      { name: "Spaghetti", price: 13 },
      { name: "Croissant", price: 7 }
    ]
  }
];

export default function Home() {
  const { connected, connect } = useWallet();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem[]>([]);

  const handleMenuChange = (item: MenuItem, checked: boolean) => {
    if (checked) {
      setSelectedMenu([...selectedMenu, item]);
    } else {
      setSelectedMenu(selectedMenu.filter(m => m.name !== item.name));
    }
  };

  const handleBook = (restaurantName: string) => {
    if (!connected) {
      setShowLoginPrompt(true);
      return;
    }
    setSelectedRestaurant(restaurantName);
    setModalOpen(true);
  };

  const handleBookingSubmit = (date: string, time: string, selectedMenu: MenuItem[]) => {
    setModalOpen(false);
    const totalPrice = selectedMenu.reduce((sum, item) => sum + item.price, 0);
    alert(
      `Booked at ${selectedRestaurant} on ${date} at ${time}\nMenu: ${selectedMenu
        .map((item) => `${item.name} (RM${item.price})`)
        .join(', ')}`
    );
    setSelectedRestaurant(null);
  };

  const handlePay = async () => {
    // Implement the logic to handle the payment
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Malaysian Restaurant Guide</title>
        <meta name="description" content="Discover the best Malaysian restaurants" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Malaysian Restaurant Guide
          </h1>
          <WalletButton />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">{restaurant.name}</h2>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-gray-600">{restaurant.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{restaurant.description}</p>
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Location: {restaurant.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                {/* Book button for each restaurant */}
                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={() => handleBook(restaurant.name)}
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* Booking Modal */}
      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        restaurantName={selectedRestaurant || ''}
        onBook={handleBookingSubmit}
        menu={
          restaurants.find(r => r.name === selectedRestaurant)?.menu ?? []
        }
        connected={connected}
        connect={connect}
        setSelectedRestaurant={setSelectedRestaurant}
        setModalOpen={setModalOpen}
      />
      {/* Login prompt modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Please connect your wallet to book a table.</h2>
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              onClick={() => {
                connect();
                setShowLoginPrompt(false);
              }}
            >
              Connect Wallet
            </button>
            <button
              className="ml-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => setShowLoginPrompt(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 